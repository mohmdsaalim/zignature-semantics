"""
apps/accounts/google.py

Google ID token verification service for Ticket 1.4.

Architecture decisions:
────────────────────────────────────────────────────────────────
1. NO django-allauth for this endpoint.
   django-allauth is designed for server-side OAuth redirects.
   Our flow is a frontend-driven token exchange — the React frontend
   gets the id_token from Google directly (@react-oauth/google), then
   POSTs it here. We verify it ourselves using Google's public key
   endpoint. This is simpler, faster, and has zero redirect round trips.

2. google-auth library (google-auth[requests]) — the official Google
   client library — is used for id_token verification. It:
     • Fetches Google's public keys from the certs endpoint
     • Caches the public keys in memory until they expire (avoids
       a Google round-trip on every login — key rotation happens ~24h)
     • Validates signature, expiry (exp), audience (aud), issuer (iss)
     • Returns a verified payload dict or raises ValueError

3. 5-second timeout on the Google certs fetch (system.md §13).
   If Google is unreachable, we raise GoogleServiceUnavailable which
   the view catches and returns 503. Email/password login is unaffected.

4. The verified payload contains these fields we use:
     • sub       — Google's unique user ID (stable, never reused)
     • email     — User's email address
     • email_verified — Must be True or we reject
     • name      — Full name (used as display hint)
     • picture   — Avatar URL (not stored in MVP, logged for future use)

5. We do NOT store Google's `sub` in the User model in Ticket 1.4.
   The email is the join key. If two providers share an email, they
   merge into the same account (system.md §13 edge case).
   Storing `sub` is a Ticket for the hardening phase.
"""

import logging
from dataclasses import dataclass

import requests as http_requests
from django.conf import settings
from google.auth.exceptions import TransportError
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

logger = logging.getLogger(__name__)


# ── Custom exceptions ─────────────────────────────────────────────────────────

class GoogleServiceUnavailable(Exception):
    """
    Raised when Google's token verification endpoint is unreachable or
    times out. The view catches this and returns 503.
    """


class GoogleTokenInvalid(Exception):
    """
    Raised when the id_token fails verification — wrong audience,
    expired, bad signature, or email_verified=False.
    """


# ── Verified payload dataclass ────────────────────────────────────────────────

@dataclass(frozen=True)
class GoogleUserInfo:
    """
    Verified, clean payload from a Google ID token.
    All fields are validated before this object is constructed.
    """
    google_sub: str       # Google's stable user ID
    email: str            # Normalised lowercase email
    name: str             # Display name from Google profile
    picture_url: str      # Avatar URL (not stored in MVP)


# ── Verification ──────────────────────────────────────────────────────────────

def verify_google_id_token(raw_id_token: str) -> GoogleUserInfo:
    """
    Verify a Google ID token and return clean user info.

    This is the ONLY function the view calls. All Google-specific
    logic is isolated here — the view never imports google.oauth2.

    Raises:
        GoogleServiceUnavailable — Google's servers unreachable / timeout
        GoogleTokenInvalid       — Token is invalid, expired, or wrong audience
    """
    client_id = settings.GOOGLE_CLIENT_ID

    if not client_id:
        raise GoogleTokenInvalid(
            "GOOGLE_CLIENT_ID is not configured. Cannot verify token."
        )

    try:
        # google.oauth2.id_token.verify_oauth2_token:
        #   1. Fetches Google's public keys (cached until key rotation)
        #   2. Verifies JWT signature using the correct public key
        #   3. Validates: exp, iat, iss (accounts.google.com), aud == client_id
        #   Returns the decoded payload dict if valid, raises ValueError if not.
        request_adapter = google_requests.Request(
            session=_build_session_with_timeout()
        )
        payload = id_token.verify_oauth2_token(
            id_token=raw_id_token,
            request=request_adapter,
            audience=client_id,
            clock_skew_in_seconds=10,  # tolerate minor clock drift on servers
        )

    except TransportError as exc:
        # Network error — Google's certs endpoint was unreachable or timed out
        logger.error("Google certs endpoint unreachable: %s", exc)
        raise GoogleServiceUnavailable(
            "Google authentication service is currently unavailable."
        ) from exc

    except ValueError as exc:
        # Invalid token — bad signature, wrong audience, expired, etc.
        logger.warning("Google id_token verification failed: %s", exc)
        raise GoogleTokenInvalid(str(exc)) from exc

    # ── Post-verification checks ──────────────────────────────────────────────

    if not payload.get("email_verified"):
        raise GoogleTokenInvalid(
            "Google account email is not verified. "
            "Please verify your Google account first."
        )

    email = payload.get("email", "").lower().strip()
    if not email:
        raise GoogleTokenInvalid("No email address in Google token payload.")

    return GoogleUserInfo(
        google_sub=payload["sub"],
        email=email,
        name=payload.get("name", ""),
        picture_url=payload.get("picture", ""),
    )


# ── Private helpers ───────────────────────────────────────────────────────────

def _build_session_with_timeout() -> http_requests.Session:
    """
    Returns a requests.Session with a 5-second connect+read timeout
    (system.md §13: "Verify token against Google's public keys with
    5-second timeout").

    The google-auth library accepts a session object so we can inject
    our timeout. Without this, the default is no timeout — a hung Google
    server would block a Uvicorn worker indefinitely.
    """
    session = http_requests.Session()
    session.request = _timeout_request_factory(session.request, timeout=5)
    return session


def _timeout_request_factory(original_request, timeout: int):
    """
    Wraps session.request to inject a timeout without touching
    google-auth internals.
    """
    def request_with_timeout(*args, **kwargs):
        kwargs.setdefault("timeout", timeout)
        return original_request(*args, **kwargs)
    return request_with_timeout
