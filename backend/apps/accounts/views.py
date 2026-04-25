"""
apps/accounts/views.py

All authentication endpoints for Ticket 1.3 + Ticket 1.4.

Design decisions for 2026 production-grade security:
──────────────────────────────────────────────────────
1. REFRESH TOKEN in httpOnly cookie (SameSite=None; Secure in production).
   SameSite=None is required for cross-origin frontends (subdomain or
   separate domain) and works on ALL modern browsers including Safari iOS.
   SameSite=Strict is intentionally NOT used — it silently drops the cookie
   on cross-origin requests, breaking mobile and subdomain setups.

2. ACCESS TOKEN in response body only.
   Frontend stores it in memory (Zustand). Never in localStorage / sessionStorage.
   15-minute lifetime limits blast radius if stolen.

3. ROTATE_REFRESH_TOKENS = True  →  every /token/refresh/ issues a fresh
   refresh token and blacklists the old one. This means a stolen refresh token
   is detected on next legitimate use (token rotation attack detection).

4. BLACKLIST_AFTER_ROTATION = True  →  used tokens are permanently dead.

5. All errors return the standard envelope via custom_exception_handler.
   Views never return raw strings — they raise DRF exceptions.

6. [Ticket 1.4] Google OAuth uses frontend-driven token exchange.
   The React frontend gets the id_token from Google directly, then
   POSTs it to /auth/google/. No server-side redirect flow needed.
   Verification is done by google-auth library with a 5s timeout.
"""

from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from common.exception_handler import (
    INVALID_CREDENTIALS,
    PASSWORD_CHANGE_NOT_ALLOWED,
    REFRESH_COOKIE_MISSING,
)

from .google import GoogleServiceUnavailable, GoogleTokenInvalid, verify_google_id_token
from .serializers import (
    GoogleLoginSerializer,
    PasswordChangeSerializer,
    RegisterSerializer,
    UserPublicSerializer,
)
from .services import get_or_create_google_user


class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": str(user.id),
            "email": user.email,
            "username": user.username,
        })

# ── Helpers ──────────────────────────────────────────────────────────────────

def _cookie_settings(request) -> dict:
    """
    Returns the kwargs for set_cookie() / delete_cookie().

    SameSite=None; Secure — the only setting that works universally:
      • Web (same domain, subdomain, cross-origin) ✅
      • Mobile browsers (Safari iOS, Chrome Android) ✅
      • React Native / Flutter using cookie jar ✅

    In development (DEBUG=True) Secure=False so HTTP localhost works.
    SameSite="None" with Secure=False is technically invalid per spec but
    browsers allow it in development; the settings.py dev override can also
    set SIMPLE_JWT["AUTH_COOKIE_SAMESITE"] = "Lax" for local testing.
    """
    is_secure = not settings.DEBUG
    samesite = settings.SIMPLE_JWT.get("AUTH_COOKIE_SAMESITE", "None")
    return dict(
        key=settings.SIMPLE_JWT["AUTH_COOKIE"],
        max_age=int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
        httponly=True,
        secure=is_secure,
        samesite=samesite,
        path=settings.SIMPLE_JWT["AUTH_COOKIE_PATH"],
    )


def _set_refresh_cookie(response: Response, refresh_token: str, request) -> None:
    response.set_cookie(value=refresh_token, **_cookie_settings(request))


def _delete_refresh_cookie(response: Response, request) -> None:
    """Expire the cookie by setting max_age=0."""
    response.delete_cookie(
        key=settings.SIMPLE_JWT["AUTH_COOKIE"],
        path=settings.SIMPLE_JWT["AUTH_COOKIE_PATH"],
        samesite=settings.SIMPLE_JWT.get("AUTH_COOKIE_SAMESITE", "None"),
    )


def _tokens_for_user(user) -> tuple[str, str]:
    """Return (access_token_str, refresh_token_str) for a user."""
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token), str(refresh)


# ── Register ─────────────────────────────────────────────────────────────────

class RegisterView(generics.CreateAPIView):
    """
    POST /api/v1/auth/register/

    Creates a new user and returns tokens immediately so the frontend
    can skip the login step after registration.

    201 → { "access": "...", "user": { ... } }
         + httpOnly refresh cookie
    400 → standard error envelope
    """

    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        access, refresh = _tokens_for_user(user)

        response = Response(
            {
                "access": access,
                "user": UserPublicSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )
        _set_refresh_cookie(response, refresh, request)
        return response


# ── Login ─────────────────────────────────────────────────────────────────────

class CookieTokenObtainPairView(TokenObtainPairView):
    """
    POST /api/v1/auth/login/

    Extends simplejwt's TokenObtainPairView to:
      1. Move refresh token from body → httpOnly cookie.
      2. Add the user object to the response body.

    200 → { "access": "...", "user": { ... } }
         + httpOnly refresh cookie
    401 → { "error_code": "AUTHENTICATION_FAILED", ... }
    """

    def finalize_response(self, request, response, *args, **kwargs):
        if response.status_code == 200 and response.data.get("refresh"):
            refresh_token = response.data.pop("refresh")
            _set_refresh_cookie(response, refresh_token, request)

            # Add user info to login response
            if request.user and request.user.is_authenticated:
                response.data["user"] = UserPublicSerializer(request.user).data

        return super().finalize_response(request, response, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        # Attach user to response after successful login
        if response.status_code == 200:
            # The serializer validated credentials — get the user from token
            from rest_framework_simplejwt.tokens import AccessToken
            try:
                token = AccessToken(response.data["access"])
                from django.contrib.auth import get_user_model
                User = get_user_model()
                user = User.objects.get(id=token["user_id"])
                response.data["user"] = UserPublicSerializer(user).data
            except Exception:
                pass  # Non-critical — access token is still returned

        return response


# ── Token Refresh ─────────────────────────────────────────────────────────────

class CookieTokenRefreshView(TokenRefreshView):
    """
    POST /api/v1/auth/token/refresh/

    Reads refresh token from the httpOnly cookie instead of the request body.
    With ROTATE_REFRESH_TOKENS=True, issues a new refresh cookie on every call.

    This is the silent re-authentication path hit by the Axios interceptor
    on every page reload and 401 response.

    200 → { "access": "..." }
         + new httpOnly refresh cookie (rotation)
    401 → { "error_code": "TOKEN_INVALID" | "TOKEN_BLACKLISTED", ... }
    """

    def get_serializer(self, *args, **kwargs):
        cookie_value = self.request.COOKIES.get(
            settings.SIMPLE_JWT["AUTH_COOKIE"], ""
        )
        if not cookie_value:
            from rest_framework.exceptions import AuthenticationFailed
            raise AuthenticationFailed(
                detail={"code": "refresh_cookie_missing",
                        "detail": "Refresh token cookie is missing."},
                code=REFRESH_COOKIE_MISSING,
            )
        kwargs["data"] = {"refresh": cookie_value}
        return super().get_serializer(*args, **kwargs)

    def finalize_response(self, request, response, *args, **kwargs):
        if response.status_code == 200 and response.data.get("refresh"):
            new_refresh = response.data.pop("refresh")
            _set_refresh_cookie(response, new_refresh, request)

        return super().finalize_response(request, response, *args, **kwargs)


# ── Logout ────────────────────────────────────────────────────────────────────

class LogoutView(APIView):
    """
    POST /api/v1/auth/logout/

    Blacklists the refresh token from the cookie, then expires the cookie.
    The access token will naturally expire in ≤15 minutes — this is acceptable
    because access tokens are short-lived and stored in memory only.

    For stricter requirements (instant access token revocation), add a
    Redis-backed blocklist for access tokens (out of scope for Ticket 1.3).

    200 → { "message": "Logged out successfully." }
    401 → { "error_code": "TOKEN_INVALID" | "REFRESH_COOKIE_MISSING" }
    """

    # Logout is allowed without authentication so a user with an expired
    # access token can still log out (the refresh cookie is what matters).
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT["AUTH_COOKIE"])

        if not refresh_token:
            from rest_framework.exceptions import AuthenticationFailed
            raise AuthenticationFailed(
                detail="No refresh token cookie found.",
                code=REFRESH_COOKIE_MISSING,
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError as e:
            raise InvalidToken(str(e)) from e

        response = Response(
            {"message": "Logged out successfully."},
            status=status.HTTP_200_OK,
        )
        _delete_refresh_cookie(response, request)
        return response


# ── Password Change ────────────────────────────────────────────────────────────

class PasswordChangeView(APIView):
    """
    POST /api/v1/auth/password/change/

    Only available to email/password users. Google OAuth users have
    no password to change — return 403 with PASSWORD_CHANGE_NOT_ALLOWED.

    200 → { "message": "Password changed successfully." }
    400 → VALIDATION_ERROR (wrong current password, mismatch, weak password)
    403 → PASSWORD_CHANGE_NOT_ALLOWED (Google OAuth user)
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user

        # Block Google OAuth users
        if user.is_google_user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied(
                detail="Google OAuth accounts cannot change their password. "
                       "Use Google to manage your credentials.",
                code=PASSWORD_CHANGE_NOT_ALLOWED,
            )

        serializer = PasswordChangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Verify current password
        if not user.check_password(serializer.validated_data["current_password"]):
            from rest_framework.exceptions import ValidationError
            raise ValidationError(
                {"current_password": "Current password is incorrect."},
                code=INVALID_CREDENTIALS,
            )

        user.set_password(serializer.validated_data["new_password"])
        user.save(update_fields=["password", "updated_at"])

        # Blacklist all existing refresh tokens so the user must log in again
        # on other devices after a password change.
        # (simplejwt's OutstandingToken — requires token_blacklist app)
        try:
            from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
            for token in OutstandingToken.objects.filter(user=user):
                try:
                    RefreshToken(token.token).blacklist()
                except TokenError:
                    pass
        except ImportError:
            pass  # token_blacklist not installed — skip

        return Response(
            {"message": "Password changed successfully. Please log in again."},
            status=status.HTTP_200_OK,
        )


# ── Google OAuth2 ─────────────────────────────────────────────────────────────

class GoogleLoginView(APIView):
    """
    POST /api/v1/auth/google/

    Frontend-driven Google OAuth2 token exchange (system.md §7.2).

    Flow:
      1. React frontend opens Google consent screen (@react-oauth/google)
      2. Google returns id_token to the frontend
      3. Frontend POSTs { "id_token": "..." } to this endpoint
      4. We verify the id_token against Google's public keys (5s timeout)
      5. get_or_create_google_user() finds or creates the User record
      6. Return same access+cookie response shape as /auth/login/

    This means the frontend auth handling code is identical for both
    email/password and Google login — same response shape, same cookie.

    201 → new user created  { "access": "...", "user": {...}, "created": true }
    200 → existing user     { "access": "...", "user": {...}, "created": false }
    401 → { "error_code": "GOOGLE_AUTH_FAILED", ... }   (invalid token)
    503 → { "error_code": "SERVICE_UNAVAILABLE", ... }  (Google unreachable)
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = GoogleLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        raw_id_token = serializer.validated_data["id_token"]

        # ── Step 1: Verify the token with Google ──────────────────────────────
        try:
            google_info = verify_google_id_token(raw_id_token)
        except GoogleServiceUnavailable as exc:
            # Google's servers are down / timed out — return 503
            # Frontend should show Google button as disabled
            raise _GoogleUnavailableException(str(exc)) from exc
        except GoogleTokenInvalid as exc:
            # Token is forged, expired, wrong audience, etc.
            from rest_framework.exceptions import AuthenticationFailed
            raise AuthenticationFailed(
                detail=str(exc),
                code="GOOGLE_AUTH_FAILED",
            ) from exc

        # ── Step 2: Get or create the user ────────────────────────────────────
        user, created = get_or_create_google_user(google_info)

        # ── Step 3: Issue JWT tokens ───────────────────────────────────────────
        access, refresh = _tokens_for_user(user)

        http_status = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        response = Response(
            {
                "access": access,
                "user": UserPublicSerializer(user).data,
                "created": created,
            },
            status=http_status,
        )
        _set_refresh_cookie(response, refresh, request)
        return response


class _GoogleUnavailableException(Exception):
    """
    Internal exception for Google service unavailability.
    Caught by custom_exception_handler and mapped to 503.

    We subclass plain Exception (not a DRF exception) so we can
    attach a custom status_code that the exception handler reads.
    """
    status_code = 503
    default_code = "SERVICE_UNAVAILABLE"

    def __init__(self, message: str):
        self.detail = message
        super().__init__(message)
