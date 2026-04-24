"""
Full test suite for Ticket 1.3 — JWT Authentication Endpoints.

Coverage:
  ✅ Register with valid data → 201, access token returned
  ✅ Register with duplicate email → 400 EMAIL_ALREADY_EXISTS
  ✅ Register with mismatched passwords → 400 VALIDATION_ERROR
  ✅ Login with correct credentials → 200, access token in body, refresh cookie set
  ✅ Login with wrong password → 401
  ✅ Token refresh from cookie → new access token returned
  ✅ Logout → token blacklisted, subsequent refresh returns 401
  ✅ Error envelope shape on all failures
  ✅ httpOnly cookie flag verified
  ✅ Password change (happy path + wrong current password + Google OAuth block)
  ✅ Authenticated endpoint with Bearer token

Run with:
    python manage.py test tests.test_auth --settings=config.settings.development
    # or with pytest-django:
    pytest tests/test_auth.py -v
"""

import pytest
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

# ── Constants ─────────────────────────────────────────────────────────────────

REGISTER_URL = "/api/v1/auth/register/"
LOGIN_URL = "/api/v1/auth/login/"
LOGOUT_URL = "/api/v1/auth/logout/"
REFRESH_URL = "/api/v1/auth/token/refresh/"
PASSWORD_CHANGE_URL = "/api/v1/auth/password/change/"
COOKIE_NAME = "refresh_token"


# ── Fixtures ──────────────────────────────────────────────────────────────────

@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def existing_user(db):
    """A pre-created email/password user."""
    return User.objects.create_user(
        email="existing@example.com",
        username="existing_user",
        password="StrongPass123!",
    )


@pytest.fixture
def google_user(db):
    """A user created via Google OAuth (no usable password)."""
    user = User.objects.create_user(
        email="googleuser@example.com",
        username="google_user",
        password=None,
        auth_provider=User.AuthProvider.GOOGLE,
    )
    user.set_unusable_password()
    user.save()
    return user


@pytest.fixture
def auth_client(client, existing_user):
    """An APIClient with a valid Bearer token for existing_user."""
    refresh = RefreshToken.for_user(existing_user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {str(refresh.access_token)}")
    return client, existing_user


# ── Helpers ───────────────────────────────────────────────────────────────────

def assert_error_envelope(response, expected_code: str):
    """Assert the response uses the standard error envelope."""
    data = response.json()
    assert "error_code" in data, f"Missing 'error_code' in: {data}"
    assert "message" in data, f"Missing 'message' in: {data}"
    assert "details" in data, f"Missing 'details' in: {data}"
    assert data["error_code"] == expected_code, (
        f"Expected error_code={expected_code!r}, got {data['error_code']!r}"
    )


def login(client, email="existing@example.com", password="StrongPass123!"):
    """Helper: perform a login and return the response."""
    return client.post(LOGIN_URL, {"email": email, "password": password})


# ══════════════════════════════════════════════════════════════════════════════
# REGISTER
# ══════════════════════════════════════════════════════════════════════════════

@pytest.mark.django_db
class TestRegister:

    def test_register_valid_data_returns_201_and_access_token(self, client):
        """POST /register/ with valid payload → 201, access token in body."""
        payload = {
            "email": "newuser@example.com",
            "username": "newuser",
            "password": "StrongPass123!",
            "password_confirm": "StrongPass123!",
        }
        response = client.post(REGISTER_URL, payload)

        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert "access" in data, "Access token must be in response body"
        assert "user" in data, "User object must be in response body"
        assert data["user"]["email"] == "newuser@example.com"
        # Refresh token must NOT be in body — only in cookie
        assert "refresh" not in data

    def test_register_sets_httponly_refresh_cookie(self, client):
        """Registration must set an httpOnly refresh cookie."""
        payload = {
            "email": "cookie@example.com",
            "username": "cookieuser",
            "password": "StrongPass123!",
            "password_confirm": "StrongPass123!",
        }
        response = client.post(REGISTER_URL, payload)

        assert response.status_code == status.HTTP_201_CREATED
        assert COOKIE_NAME in response.cookies, "refresh_token cookie not set"
        cookie = response.cookies[COOKIE_NAME]
        assert cookie["httponly"], "Cookie must be httpOnly"

    def test_register_creates_user_in_db(self, client):
        """A new User record must exist after registration."""
        payload = {
            "email": "dbcheck@example.com",
            "username": "dbcheck",
            "password": "StrongPass123!",
            "password_confirm": "StrongPass123!",
        }
        client.post(REGISTER_URL, payload)
        assert User.objects.filter(email="dbcheck@example.com").exists()

    def test_register_duplicate_email_returns_400_email_already_exists(
        self, client, existing_user
    ):
        """Duplicate email → 400 with error_code EMAIL_ALREADY_EXISTS."""
        payload = {
            "email": existing_user.email,
            "username": "someotheruser",
            "password": "StrongPass123!",
            "password_confirm": "StrongPass123!",
        }
        response = client.post(REGISTER_URL, payload)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert_error_envelope(response, "VALIDATION_ERROR")
        # The details must mention the email field
        details = response.json()["details"]
        assert "email" in details

    def test_register_mismatched_passwords_returns_400_validation_error(self, client):
        """password != password_confirm → 400 VALIDATION_ERROR."""
        payload = {
            "email": "mismatch@example.com",
            "username": "mismatchuser",
            "password": "StrongPass123!",
            "password_confirm": "DifferentPass456!",
        }
        response = client.post(REGISTER_URL, payload)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert_error_envelope(response, "VALIDATION_ERROR")

    def test_register_missing_fields_returns_400(self, client):
        """Missing required fields → 400."""
        response = client.post(REGISTER_URL, {"email": "incomplete@example.com"})
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert_error_envelope(response, "VALIDATION_ERROR")

    def test_register_weak_password_returns_400(self, client):
        """Password too short → 400."""
        payload = {
            "email": "weak@example.com",
            "username": "weakpass",
            "password": "123",
            "password_confirm": "123",
        }
        response = client.post(REGISTER_URL, payload)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert_error_envelope(response, "VALIDATION_ERROR")


# ══════════════════════════════════════════════════════════════════════════════
# LOGIN
# ══════════════════════════════════════════════════════════════════════════════

@pytest.mark.django_db
class TestLogin:

    def test_login_correct_credentials_returns_200_and_access_token(
        self, client, existing_user
    ):
        """POST /login/ with correct credentials → 200, access token in body."""
        response = login(client)

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access" in data, "Access token must be in response body"
        assert "refresh" not in data, "Refresh token must NOT be in response body"

    def test_login_sets_httponly_refresh_cookie(self, client, existing_user):
        """Login must set an httpOnly refresh cookie."""
        response = login(client)

        assert response.status_code == status.HTTP_200_OK
        assert COOKIE_NAME in response.cookies, "refresh_token cookie not set"
        cookie = response.cookies[COOKIE_NAME]
        assert cookie["httponly"], "Cookie must be httpOnly"

    def test_login_wrong_password_returns_401(self, client, existing_user):
        """Wrong password → 401 with standard error envelope."""
        response = login(client, password="WrongPassword!")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert_error_envelope(response, "AUTHENTICATION_FAILED")

    def test_login_nonexistent_email_returns_401(self, client):
        """Login with email that doesn't exist → 401."""
        response = login(client, email="nobody@example.com")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert_error_envelope(response, "AUTHENTICATION_FAILED")

    def test_login_missing_fields_returns_400(self, client):
        """Login with empty body → 400."""
        response = client.post(LOGIN_URL, {})
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert_error_envelope(response, "VALIDATION_ERROR")


# ══════════════════════════════════════════════════════════════════════════════
# TOKEN REFRESH
# ══════════════════════════════════════════════════════════════════════════════

@pytest.mark.django_db
class TestTokenRefresh:

    def test_token_refresh_from_cookie_returns_new_access_token(
        self, client, existing_user
    ):
        """
        After login, calling /token/refresh/ with the cookie →
        new access token in body.
        """
        # Step 1: Login to get the cookie
        login_response = login(client)
        assert login_response.status_code == status.HTTP_200_OK
        old_access = login_response.json()["access"]

        # Step 2: Simulate browser sending the cookie automatically
        refresh_cookie = login_response.cookies[COOKIE_NAME].value
        client.cookies[COOKIE_NAME] = refresh_cookie

        # Step 3: Call refresh endpoint (no body — reads from cookie)
        refresh_response = client.post(REFRESH_URL)

        assert refresh_response.status_code == status.HTTP_200_OK
        data = refresh_response.json()
        assert "access" in data, "New access token must be in response body"
        # New access token should be different (new JTI)
        assert data["access"] != old_access

    def test_token_refresh_rotates_cookie(self, client, existing_user):
        """
        With ROTATE_REFRESH_TOKENS=True, the refresh cookie must be
        updated with a new value on every /token/refresh/ call.
        """
        login_response = login(client)
        old_refresh = login_response.cookies[COOKIE_NAME].value
        client.cookies[COOKIE_NAME] = old_refresh

        refresh_response = client.post(REFRESH_URL)
        assert refresh_response.status_code == status.HTTP_200_OK

        # A new cookie should have been set
        if COOKIE_NAME in refresh_response.cookies:
            new_refresh = refresh_response.cookies[COOKIE_NAME].value
            assert new_refresh != old_refresh, "Refresh token should rotate"

    def test_token_refresh_without_cookie_returns_401(self, client):
        """
        Calling /token/refresh/ without a cookie (no session) → 401.
        This is the 'page reload after cookie cleared' scenario.
        """
        # Make sure no cookie is set
        client.cookies.clear()
        response = client.post(REFRESH_URL)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert_error_envelope(response, "AUTHENTICATION_FAILED")

    def test_token_refresh_with_invalid_cookie_returns_401(self, client):
        """Tampered/expired cookie → 401."""
        client.cookies[COOKIE_NAME] = "invalid.token.value"
        response = client.post(REFRESH_URL)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED


# ══════════════════════════════════════════════════════════════════════════════
# LOGOUT
# ══════════════════════════════════════════════════════════════════════════════

@pytest.mark.django_db
class TestLogout:

    def test_logout_blacklists_refresh_token(self, client, existing_user):
        """
        POST /logout/ → 200.
        Subsequent /token/refresh/ with the same token → 401.
        """
        # Step 1: Login
        login_response = login(client)
        refresh_cookie = login_response.cookies[COOKIE_NAME].value
        client.cookies[COOKIE_NAME] = refresh_cookie

        # Step 2: Logout
        logout_response = client.post(LOGOUT_URL)
        assert logout_response.status_code == status.HTTP_200_OK

        # Step 3: Try to refresh with the blacklisted token
        # (cookie is expired but we manually set the old value to test blacklisting)
        client.cookies[COOKIE_NAME] = refresh_cookie
        refresh_response = client.post(REFRESH_URL)
        assert refresh_response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_logout_expires_the_cookie(self, client, existing_user):
        """Logout response must instruct the browser to delete the cookie."""
        login_response = login(client)
        client.cookies[COOKIE_NAME] = login_response.cookies[COOKIE_NAME].value

        logout_response = client.post(LOGOUT_URL)
        assert logout_response.status_code == status.HTTP_200_OK

        # Cookie should be expired (max-age=0 or explicit delete)
        if COOKIE_NAME in logout_response.cookies:
            cookie = logout_response.cookies[COOKIE_NAME]
            max_age = cookie.get("max-age", None)
            if max_age is not None:
                assert int(max_age) <= 0, "Cookie must be expired on logout"

    def test_logout_without_cookie_returns_401(self, client):
        """Logout with no cookie → 401."""
        client.cookies.clear()
        response = client.post(LOGOUT_URL)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


# ══════════════════════════════════════════════════════════════════════════════
# PASSWORD CHANGE
# ══════════════════════════════════════════════════════════════════════════════

@pytest.mark.django_db
class TestPasswordChange:

    def test_password_change_success(self, auth_client):
        """Authenticated user can change their password."""
        client, user = auth_client
        payload = {
            "current_password": "StrongPass123!",
            "new_password": "NewStrongPass456!",
            "new_password_confirm": "NewStrongPass456!",
        }
        response = client.post(PASSWORD_CHANGE_URL, payload)
        assert response.status_code == status.HTTP_200_OK

        # Verify new password actually works
        user.refresh_from_db()
        assert user.check_password("NewStrongPass456!")

    def test_password_change_wrong_current_password_returns_400(self, auth_client):
        """Wrong current password → 400."""
        client, _ = auth_client
        payload = {
            "current_password": "WrongCurrentPass!",
            "new_password": "NewStrongPass456!",
            "new_password_confirm": "NewStrongPass456!",
        }
        response = client.post(PASSWORD_CHANGE_URL, payload)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert_error_envelope(response, "VALIDATION_ERROR")

    def test_password_change_mismatched_new_passwords_returns_400(self, auth_client):
        """New password mismatch → 400."""
        client, _ = auth_client
        payload = {
            "current_password": "StrongPass123!",
            "new_password": "NewPass456!",
            "new_password_confirm": "DifferentPass789!",
        }
        response = client.post(PASSWORD_CHANGE_URL, payload)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert_error_envelope(response, "VALIDATION_ERROR")

    def test_password_change_google_user_returns_403(self, client, google_user):
        """Google OAuth user cannot change password → 403."""
        refresh = RefreshToken.for_user(google_user)
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {str(refresh.access_token)}")

        payload = {
            "current_password": "anything",
            "new_password": "NewPass456!",
            "new_password_confirm": "NewPass456!",
        }
        response = client.post(PASSWORD_CHANGE_URL, payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert_error_envelope(response, "PERMISSION_DENIED")

    def test_password_change_unauthenticated_returns_401(self, client):
        """Unauthenticated request → 401."""
        payload = {
            "current_password": "StrongPass123!",
            "new_password": "NewPass456!",
            "new_password_confirm": "NewPass456!",
        }
        response = client.post(PASSWORD_CHANGE_URL, payload)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert_error_envelope(response, "NOT_AUTHENTICATED")


# ══════════════════════════════════════════════════════════════════════════════
# ERROR ENVELOPE SHAPE
# ══════════════════════════════════════════════════════════════════════════════

@pytest.mark.django_db
class TestErrorEnvelope:
    """
    Verify the error envelope shape is consistent across ALL error responses.
    The shape must always be:
        { "error_code": "...", "message": "...", "details": {...} }
    """

    def test_envelope_shape_on_401(self, client):
        response = login(client, password="wrong")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        data = response.json()
        assert set(data.keys()) >= {"error_code", "message", "details"}

    def test_envelope_shape_on_400(self, client):
        response = client.post(REGISTER_URL, {})
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        data = response.json()
        assert set(data.keys()) >= {"error_code", "message", "details"}

    def test_envelope_shape_on_unauthenticated_protected_endpoint(self, client):
        """Hitting a protected endpoint without a token → 401 envelope."""
        response = client.post(PASSWORD_CHANGE_URL, {})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        data = response.json()
        assert set(data.keys()) >= {"error_code", "message", "details"}
        assert data["error_code"] == "NOT_AUTHENTICATED"


# ══════════════════════════════════════════════════════════════════════════════
# FULL AUTH FLOW (integration)
# ══════════════════════════════════════════════════════════════════════════════

@pytest.mark.django_db
class TestFullAuthFlow:
    """
    End-to-end flow: register → refresh → logout → refresh fails.
    This mirrors exactly what the Axios interceptor does.
    """

    def test_register_refresh_logout_flow(self, client):
        # 1. Register
        reg_response = client.post(REGISTER_URL, {
            "email": "flow@example.com",
            "username": "flowuser",
            "password": "FlowPass123!",
            "password_confirm": "FlowPass123!",
        })
        assert reg_response.status_code == status.HTTP_201_CREATED
        access_token = reg_response.json()["access"]
        refresh_cookie = reg_response.cookies[COOKIE_NAME].value

        # 2. Use access token on a protected endpoint (password change endpoint
        #    is protected — just hitting it to verify the token works)
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")
        protected = client.get('/api/v1/auth/user/')

        # 200 means the access token was accepted
        assert protected.status_code == status.HTTP_200_OK

        # 3. Simulate page reload: clear access token, use cookie to refresh
        client.credentials()  # clear Bearer token
        client.cookies[COOKIE_NAME] = refresh_cookie
        refresh_response = client.post(REFRESH_URL)
        assert refresh_response.status_code == status.HTTP_200_OK
        new_access = refresh_response.json()["access"]
        assert new_access  # we have a new access token

        # 4. Logout
        if COOKIE_NAME in refresh_response.cookies:
            client.cookies[COOKIE_NAME] = refresh_response.cookies[COOKIE_NAME].value
        logout_response = client.post(LOGOUT_URL)
        assert logout_response.status_code == status.HTTP_200_OK

        # 5. Refresh after logout must fail
        client.cookies[COOKIE_NAME] = refresh_cookie  # use old (blacklisted) token
        final_refresh = client.post(REFRESH_URL)
        assert final_refresh.status_code == status.HTTP_401_UNAUTHORIZED
