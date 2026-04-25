"""
tests/test_google_auth.py

Full test suite for Ticket 1.4 — Google OAuth2 Integration.

All Google HTTP calls are mocked — no real Google servers needed.
Tests run offline and are deterministic.

Coverage:
  ✅ Valid id_token for new email → user created, 201, access token returned
  ✅ Valid id_token for existing email → existing user logged in, 200
  ✅ Valid id_token for existing Google user → existing user logged in, 200
  ✅ Google service down (TransportError) → 503 SERVICE_UNAVAILABLE
  ✅ Invalid id_token (bad signature) → 401 GOOGLE_AUTH_FAILED
  ✅ Unverified email in token payload → 401 GOOGLE_AUTH_FAILED
  ✅ Google user tries password change → 403 PERMISSION_DENIED
  ✅ Missing id_token field → 400 VALIDATION_ERROR
  ✅ Malformed id_token (not a JWT) → 400 VALIDATION_ERROR
  ✅ httpOnly refresh cookie set after Google login
  ✅ Response shape is identical to email/password login
  ✅ Username auto-generated from email prefix
  ✅ Username collision generates unique suffix
  ✅ _generate_username handles special characters in email prefix

Run with:
    pytest tests/test_google_auth.py -v
    # or with coverage:
    pytest tests/test_google_auth.py -v --cov=apps.accounts
"""

from unittest.mock import patch

import pytest
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.google import (
    GoogleServiceUnavailable,
    GoogleTokenInvalid,
    GoogleUserInfo,
)
from apps.accounts.services import _generate_username, get_or_create_google_user

User = get_user_model()

# ── Constants ─────────────────────────────────────────────────────────────────

GOOGLE_URL = "/api/v1/auth/google/"
PASSWORD_CHANGE_URL = "/api/v1/auth/password/change/"
COOKIE_NAME = "refresh_token"

# A fake but structurally valid JWT (3 dot-separated parts)
# The actual content doesn't matter because verify_google_id_token is mocked
FAKE_ID_TOKEN = "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMjM0NTYifQ.signature"


# ── Fixtures ──────────────────────────────────────────────────────────────────

@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def google_user_info():
    """A valid, verified GoogleUserInfo object for a new user."""
    return GoogleUserInfo(
        google_sub="google_sub_abc123",
        email="newgoogleuser@example.com",
        name="New Google User",
        picture_url="https://lh3.googleusercontent.com/photo.jpg",
    )


@pytest.fixture
def existing_email_user(db):
    """An existing email/password user whose email will be used in Google login."""
    return User.objects.create_user(
        email="existing@example.com",
        username="existing_user",
        password="StrongPass123!",
    )


@pytest.fixture
def existing_google_user(db):
    """An existing user already created via Google OAuth."""
    user = User.objects.create(
        email="repeatgoogle@example.com",
        username="repeat_google",
        auth_provider=User.AuthProvider.GOOGLE,
        is_active=True,
    )
    user.set_unusable_password()
    user.save()
    return user


# ── Helpers ───────────────────────────────────────────────────────────────────

def assert_error_envelope(response, expected_code: str):
    data = response.json()
    assert "error_code" in data, f"Missing 'error_code' in: {data}"
    assert "message" in data, f"Missing 'message' in: {data}"
    assert "details" in data, f"Missing 'details' in: {data}"
    assert data["error_code"] == expected_code, (
        f"Expected {expected_code!r}, got {data['error_code']!r}\nFull response: {data}"
    )


def mock_verify_success(google_info: GoogleUserInfo):
    """
    Returns a context manager that patches verify_google_id_token
    to return the given GoogleUserInfo without hitting Google.
    """
    return patch(
        "apps.accounts.views.verify_google_id_token",
        return_value=google_info,
    )


def mock_verify_failure(exc_class, message: str):
    """
    Returns a context manager that patches verify_google_id_token
    to raise the given exception class.
    """
    return patch(
        "apps.accounts.views.verify_google_id_token",
        side_effect=exc_class(message),
    )


# ══════════════════════════════════════════════════════════════════════════════
# GOOGLE LOGIN — HAPPY PATHS
# ══════════════════════════════════════════════════════════════════════════════

@pytest.mark.django_db
class TestGoogleLoginSuccess:

    def test_new_google_user_returns_201_with_access_token(
        self, client, google_user_info
    ):
        """
        Valid id_token for a brand-new email → 201.
        Access token in body, refresh cookie set.
        """
        with mock_verify_success(google_user_info):
            response = client.post(GOOGLE_URL, {"id_token": FAKE_ID_TOKEN})

        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert "access" in data, "Access token must be in response body"
        assert "user" in data, "User object must be in response body"
        assert data["created"] is True
        assert "refresh" not in data, "Refresh token must NOT be in body"

    def test_new_google_user_creates_user_in_db(self, client, google_user_info):
        """A new User record must exist after Google login."""
        with mock_verify_success(google_user_info):
            client.post(GOOGLE_URL, {"id_token": FAKE_ID_TOKEN})

        assert User.objects.filter(email=google_user_info.email).exists()
        user = User.objects.get(email=google_user_info.email)
        assert user.auth_provider == User.AuthProvider.GOOGLE
        assert not user.has_usable_password()

    def test_new_google_user_sets_httponly_cookie(self, client, google_user_info):
        """Google login must set an httpOnly refresh cookie."""
        with mock_verify_success(google_user_info):
            response = client.post(GOOGLE_URL, {"id_token": FAKE_ID_TOKEN})

        assert COOKIE_NAME in response.cookies, "refresh_token cookie not set"
        cookie = response.cookies[COOKIE_NAME]
        assert cookie["httponly"], "Cookie must be httpOnly"

    def test_existing_email_user_returns_200(self, client, existing_email_user):
        """
        Valid id_token for an email that already exists (email/password user)
        → 200, same user is logged in, created=False.
        (system.md §13: email merge case)
        """
        info = GoogleUserInfo(
            google_sub="new_sub",
            email=existing_email_user.email,
            name="Existing User",
            picture_url="",
        )
        with mock_verify_success(info):
            response = client.post(GOOGLE_URL, {"id_token": FAKE_ID_TOKEN})

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["created"] is False
        assert data["user"]["email"] == existing_email_user.email
        # auth_provider is NOT changed — user still has email/password
        existing_email_user.refresh_from_db()
        assert existing_email_user.auth_provider == User.AuthProvider.EMAIL

    def test_existing_google_user_returns_200(self, client, existing_google_user):
        """
        Returning Google user logs in again → 200, created=False.
        """
        info = GoogleUserInfo(
            google_sub="same_sub",
            email=existing_google_user.email,
            name="Repeat Google User",
            picture_url="",
        )
        with mock_verify_success(info):
            response = client.post(GOOGLE_URL, {"id_token": FAKE_ID_TOKEN})

        assert response.status_code == status.HTTP_200_OK
        assert response.json()["created"] is False

    def test_google_login_response_shape_matches_email_login(
        self, client, google_user_info
    ):
        """
        Google login response must have the same shape as email/password login.
        Frontend handles both identically.
        """
        with mock_verify_success(google_user_info):
            response = client.post(GOOGLE_URL, {"id_token": FAKE_ID_TOKEN})

        data = response.json()
        # Must have: access, user object with id/email/username/auth_provider
        assert "access" in data
        user_data = data["user"]
        for field in ("id", "email", "username", "auth_provider"):
            assert field in user_data, f"Missing field '{field}' in user object"
        assert user_data["auth_provider"] == "google"

    def test_google_login_sets_cookie_with_correct_path(
        self, client, google_user_info
    ):
        """Refresh cookie path must be /api/v1/auth/ as configured."""
        with mock_verify_success(google_user_info):
            response = client.post(GOOGLE_URL, {"id_token": FAKE_ID_TOKEN})

        cookie = response.cookies.get(COOKIE_NAME)
        assert cookie is not None
        assert cookie["path"] == "/api/v1/auth/"


# ══════════════════════════════════════════════════════════════════════════════
# GOOGLE LOGIN — ERROR CASES
# ══════════════════════════════════════════════════════════════════════════════

@pytest.mark.django_db
class TestGoogleLoginErrors:

    def test_google_service_down_returns_503(self, client):
        """
        Google token verification network error → 503 SERVICE_UNAVAILABLE.
        (system.md §13: "If Google servers are unreachable → return 503")
        """
        with mock_verify_failure(
            GoogleServiceUnavailable,
            "Google authentication service is currently unavailable."
        ):
            response = client.post(GOOGLE_URL, {"id_token": FAKE_ID_TOKEN})

        assert response.status_code == status.HTTP_503_SERVICE_UNAVAILABLE
        assert_error_envelope(response, "SERVICE_UNAVAILABLE")

    def test_invalid_id_token_returns_401(self, client):
        """
        Token with bad signature / wrong audience / expired → 401 GOOGLE_AUTH_FAILED.
        """
        with mock_verify_failure(
            GoogleTokenInvalid,
            "Token signature verification failed."
        ):
            response = client.post(GOOGLE_URL, {"id_token": FAKE_ID_TOKEN})

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert_error_envelope(response, "AUTHENTICATION_FAILED")

    def test_unverified_google_email_returns_401(self, client):
        """
        Google account where email_verified=False → 401.
        (We reject unverified emails — they could be spoofed.)
        """
        with mock_verify_failure(
            GoogleTokenInvalid,
            "Google account email is not verified."
        ):
            response = client.post(GOOGLE_URL, {"id_token": FAKE_ID_TOKEN})

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_missing_id_token_field_returns_400(self, client):
        """POST with no id_token field → 400 VALIDATION_ERROR."""
        response = client.post(GOOGLE_URL, {})

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert_error_envelope(response, "VALIDATION_ERROR")

    def test_empty_id_token_returns_400(self, client):
        """POST with empty id_token → 400 VALIDATION_ERROR."""
        response = client.post(GOOGLE_URL, {"id_token": ""})

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert_error_envelope(response, "VALIDATION_ERROR")

    def test_malformed_id_token_not_jwt_returns_400(self, client):
        """
        id_token that isn't a JWT (no dots) → 400 before even hitting Google.
        The serializer catches this early — no Google round trip.
        """
        response = client.post(GOOGLE_URL, {"id_token": "notajwtatall"})

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert_error_envelope(response, "VALIDATION_ERROR")

    def test_no_user_created_when_google_service_down(self, client):
        """When Google is down, no partial user record should be created."""
        initial_count = User.objects.count()

        with mock_verify_failure(
            GoogleServiceUnavailable, "Timeout"
        ):
            client.post(GOOGLE_URL, {"id_token": FAKE_ID_TOKEN})

        assert User.objects.count() == initial_count

    def test_no_user_created_when_token_invalid(self, client):
        """When token is invalid, no user record should be created."""
        initial_count = User.objects.count()

        with mock_verify_failure(GoogleTokenInvalid, "Bad token"):
            client.post(GOOGLE_URL, {"id_token": FAKE_ID_TOKEN})

        assert User.objects.count() == initial_count


# ══════════════════════════════════════════════════════════════════════════════
# PASSWORD CHANGE — GOOGLE USER BLOCKED (system.md §13)
# ══════════════════════════════════════════════════════════════════════════════

@pytest.mark.django_db
class TestGoogleUserPasswordChange:

    def test_google_user_cannot_change_password(self, client, existing_google_user):
        """
        Google OAuth user POSTing to /auth/password/change/ → 403.
        error_code = PERMISSION_DENIED.
        (system.md §13: "PASSWORD_CHANGE_NOT_ALLOWED")
        """
        refresh = RefreshToken.for_user(existing_google_user)
        client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {str(refresh.access_token)}"
        )

        response = client.post(PASSWORD_CHANGE_URL, {
            "current_password": "anything",
            "new_password": "NewPass456!",
            "new_password_confirm": "NewPass456!",
        })

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert_error_envelope(response, "PERMISSION_DENIED")

    def test_error_message_mentions_google(self, client, existing_google_user):
        """The error message should guide the user to use Google instead."""
        refresh = RefreshToken.for_user(existing_google_user)
        client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {str(refresh.access_token)}"
        )

        response = client.post(PASSWORD_CHANGE_URL, {
            "current_password": "anything",
            "new_password": "NewPass456!",
            "new_password_confirm": "NewPass456!",
        })

        message = response.json()["message"].lower()
        assert "google" in message, (
            "Error message should mention Google to guide the user"
        )


# ══════════════════════════════════════════════════════════════════════════════
# SERVICES — get_or_create_google_user unit tests
# ══════════════════════════════════════════════════════════════════════════════

@pytest.mark.django_db
class TestGetOrCreateGoogleUser:

    def test_creates_new_user_for_new_email(self):
        info = GoogleUserInfo(
            google_sub="sub_new",
            email="brandnew@example.com",
            name="Brand New",
            picture_url="",
        )
        user, created = get_or_create_google_user(info)

        assert created is True
        assert user.email == "brandnew@example.com"
        assert user.auth_provider == User.AuthProvider.GOOGLE
        assert not user.has_usable_password()

    def test_returns_existing_user_for_known_email(self, existing_email_user):
        info = GoogleUserInfo(
            google_sub="sub_existing",
            email=existing_email_user.email,
            name="Existing",
            picture_url="",
        )
        user, created = get_or_create_google_user(info)

        assert created is False
        assert user.pk == existing_email_user.pk

    def test_does_not_change_auth_provider_on_email_merge(self, existing_email_user):
        """
        When an email/password user logs in via Google for the first time,
        their auth_provider must NOT be changed to 'google' — they might
        still use their password for login.
        """
        info = GoogleUserInfo(
            google_sub="sub_merge",
            email=existing_email_user.email,
            name="Merge Test",
            picture_url="",
        )
        get_or_create_google_user(info)

        existing_email_user.refresh_from_db()
        assert existing_email_user.auth_provider == User.AuthProvider.EMAIL

    def test_google_user_has_unusable_password(self):
        info = GoogleUserInfo(
            google_sub="sub_nopw",
            email="nopw@example.com",
            name="No Password",
            picture_url="",
        )
        user, _ = get_or_create_google_user(info)
        assert not user.has_usable_password()

    def test_idempotent_for_same_google_user(self):
        """Calling twice with same email → same user, no duplicate."""
        info = GoogleUserInfo(
            google_sub="sub_idem",
            email="idempotent@example.com",
            name="Idem",
            picture_url="",
        )
        user1, created1 = get_or_create_google_user(info)
        user2, created2 = get_or_create_google_user(info)

        assert created1 is True
        assert created2 is False
        assert user1.pk == user2.pk
        assert User.objects.filter(email="idempotent@example.com").count() == 1


# ══════════════════════════════════════════════════════════════════════════════
# SERVICES — _generate_username unit tests
# ══════════════════════════════════════════════════════════════════════════════

@pytest.mark.django_db
class TestGenerateUsername:

    def test_simple_email_prefix(self):
        username = _generate_username("johndoe@example.com")
        assert username == "johndoe"

    def test_dots_replaced_with_underscores(self):
        username = _generate_username("john.doe@example.com")
        assert username == "john_doe"

    def test_special_chars_replaced(self):
        username = _generate_username("john+tag@example.com")
        assert "_" in username or "johntag" in username

    def test_collision_generates_unique_suffix(self):
        # Pre-create a user with the username 'alice'
        User.objects.create_user(
            email="alice_taken@example.com",
            username="alice",
            password="pass",
        )
        username = _generate_username("alice@example.com")
        # Must not be exactly 'alice' (that's taken)
        assert username != "alice"
        # Must start with 'alice_'
        assert username.startswith("alice_")
        # Must be unique
        assert not User.objects.filter(username=username).exists()

    def test_username_max_length_50(self):
        long_email = "a" * 60 + "@example.com"
        username = _generate_username(long_email)
        assert len(username) <= 50

    def test_generated_username_is_unique_in_db(self):
        username = _generate_username("unique_test@example.com")
        # Create a user with that username
        User.objects.create_user(
            email="unique_test@example.com",
            username=username,
            password="pass",
        )
        # Generate again — must be different
        username2 = _generate_username("unique_test@example.com")
        assert username2 != username


# ══════════════════════════════════════════════════════════════════════════════
# GOOGLE MODULE — verify_google_id_token unit tests (mocked at lower level)
# ══════════════════════════════════════════════════════════════════════════════

class TestVerifyGoogleIdToken:
    """
    These tests mock at the google.oauth2.id_token level to test
    that our wrapper correctly translates Google exceptions into
    our custom exceptions.
    """

    def test_transport_error_raises_google_service_unavailable(self):
        from google.auth.exceptions import TransportError

        from apps.accounts.google import verify_google_id_token

        with patch("apps.accounts.google.id_token.verify_oauth2_token") as mock_verify:
            mock_verify.side_effect = TransportError("Connection timeout")
            with pytest.raises(GoogleServiceUnavailable):
                verify_google_id_token(FAKE_ID_TOKEN)

    def test_value_error_raises_google_token_invalid(self):
        from apps.accounts.google import verify_google_id_token

        with patch("apps.accounts.google.id_token.verify_oauth2_token") as mock_verify:
            mock_verify.side_effect = ValueError("Wrong audience")
            with pytest.raises(GoogleTokenInvalid):
                verify_google_id_token(FAKE_ID_TOKEN)

    def test_unverified_email_raises_google_token_invalid(self):
        from apps.accounts.google import verify_google_id_token

        # Return a payload with email_verified=False
        with patch("apps.accounts.google.id_token.verify_oauth2_token") as mock_verify:
            with patch("apps.accounts.google._build_session_with_timeout"):
                mock_verify.return_value = {
                    "sub": "123",
                    "email": "unverified@example.com",
                    "email_verified": False,
                    "name": "Test",
                }
                with pytest.raises(GoogleTokenInvalid, match="not verified"):
                    verify_google_id_token(FAKE_ID_TOKEN)

    def test_valid_payload_returns_google_user_info(self):
        from apps.accounts.google import verify_google_id_token

        with patch("apps.accounts.google.id_token.verify_oauth2_token") as mock_verify:
            with patch("apps.accounts.google._build_session_with_timeout"):
                mock_verify.return_value = {
                    "sub": "google_sub_999",
                    "email": "Valid@Example.COM",  # will be normalised
                    "email_verified": True,
                    "name": "Valid User",
                    "picture": "https://example.com/pic.jpg",
                }
                result = verify_google_id_token(FAKE_ID_TOKEN)

        assert result.email == "valid@example.com"  # lowercased
        assert result.google_sub == "google_sub_999"
        assert result.name == "Valid User"
        assert result.picture_url == "https://example.com/pic.jpg"
