"""
apps/accounts/services.py

Business logic for Google OAuth user get-or-create.

Separated from views.py so it can be tested independently
and reused (e.g., in a future mobile token endpoint).

This module owns the answer to:
  "Given a verified GoogleUserInfo, which User account does it map to?"
"""

import logging
import uuid

from django.contrib.auth import get_user_model
from django.db import transaction

from .google import GoogleUserInfo

logger = logging.getLogger(__name__)

User = get_user_model()


def get_or_create_google_user(info: GoogleUserInfo) -> tuple:
    """
    Given a verified Google user payload, return (user, created).

    Logic (system.md §7.2, §13):
    ─────────────────────────────
    Case 1 — email already exists in DB:
        • Return that user regardless of auth_provider.
        • If auth_provider = 'email', the user is silently upgrading
          to Google login. We do NOT overwrite auth_provider here —
          the user still has their email/password. They can use either.
          (Changing auth_provider would break password change for them.)
        • Log a warning so the admin can see the merge event.

    Case 2 — email is new:
        • Create User with auth_provider='google', unusable password.
        • Username is auto-generated from email prefix + short UUID.
        • Profile is auto-created by post_save signal (Ticket 1.5).
        • Return (user, True).

    This runs in a transaction so partial user creation never happens.
    """
    email = info.email  # already normalised in verify_google_id_token

    # ── Case 1: Existing user ─────────────────────────────────────────────────
    try:
        user = User.objects.get(email=email)
        if user.auth_provider != User.AuthProvider.GOOGLE:
            logger.warning(
                "Google login for email=%s which has auth_provider=%s. "
                "Allowing login but not changing auth_provider.",
                email,
                user.auth_provider,
            )
        return user, False

    except User.DoesNotExist:
        pass

    # ── Case 2: New user ──────────────────────────────────────────────────────
    with transaction.atomic():
        username = _generate_username(email)
        user = User.objects.create(
            email=email,
            username=username,
            auth_provider=User.AuthProvider.GOOGLE,
            is_active=True,
        )
        # Set unusable password — Google users have no password.
        # user.check_password() will always return False.
        # PasswordChangeView already blocks this user (is_google_user = True).
        user.set_unusable_password()
        user.save(update_fields=["password"])

        logger.info(
            "New Google user created: email=%s username=%s",
            email,
            username,
        )
        return user, True


def _generate_username(email: str) -> str:
    """
    Generate a unique username from the email prefix.

    Strategy:
      1. Take everything before the @ sign.
      2. Keep only alphanumeric chars and underscores.
      3. If that username is taken, append a 6-char UUID fragment.
      4. Truncate to 50 chars (User.username max_length).

    Examples:
      john.doe@gmail.com  → john_doe
      john.doe@gmail.com  → john_doe_a3f9c2  (if john_doe exists)
    """
    prefix = email.split("@")[0]
    # Replace non-alphanumeric (except underscore) with underscore
    clean = "".join(c if c.isalnum() or c == "_" else "_" for c in prefix)
    clean = clean[:44]  # leave room for suffix

    if not User.objects.filter(username=clean).exists():
        return clean

    # Append short UUID suffix to guarantee uniqueness
    suffix = uuid.uuid4().hex[:6]
    return f"{clean}_{suffix}"[:50]
