"""
common/exception_handler.py

Standard error envelope for ALL API responses.
Shape: { "error_code": "...", "message": "...", "details": {...} }

This must be wired in before any views are written so every error
in the entire project follows the same shape.
"""

from django.core.exceptions import PermissionDenied
from django.http import Http404
from rest_framework import exceptions, status
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_default_handler

# ── Canonical error codes ────────────────────────────────────────────────────
# Keep these as constants so views can import them instead of using raw strings.

VALIDATION_ERROR = "VALIDATION_ERROR"
AUTHENTICATION_FAILED = "AUTHENTICATION_FAILED"
NOT_AUTHENTICATED = "NOT_AUTHENTICATED"
PERMISSION_DENIED = "PERMISSION_DENIED"
NOT_FOUND = "NOT_FOUND"
METHOD_NOT_ALLOWED = "METHOD_NOT_ALLOWED"
THROTTLED = "THROTTLED"
SERVER_ERROR = "SERVER_ERROR"

# Auth-specific codes used by views
EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS"
INVALID_CREDENTIALS = "INVALID_CREDENTIALS"
TOKEN_EXPIRED = "TOKEN_EXPIRED"
TOKEN_INVALID = "TOKEN_INVALID"
TOKEN_BLACKLISTED = "TOKEN_BLACKLISTED"
GOOGLE_AUTH_FAILED = "GOOGLE_AUTH_FAILED"
PASSWORD_CHANGE_NOT_ALLOWED = "PASSWORD_CHANGE_NOT_ALLOWED"
REFRESH_COOKIE_MISSING = "REFRESH_COOKIE_MISSING"


# ── Map DRF exception types → our error codes ────────────────────────────────

_EXCEPTION_CODE_MAP = {
    exceptions.ValidationError: VALIDATION_ERROR,
    exceptions.AuthenticationFailed: AUTHENTICATION_FAILED,
    exceptions.NotAuthenticated: NOT_AUTHENTICATED,
    exceptions.PermissionDenied: PERMISSION_DENIED,
    exceptions.NotFound: NOT_FOUND,
    Http404: NOT_FOUND,
    PermissionDenied: PERMISSION_DENIED,
    exceptions.MethodNotAllowed: METHOD_NOT_ALLOWED,
    exceptions.Throttled: THROTTLED,
}


def _get_error_code(exc: Exception) -> str:
    """
    Return the canonical error code for this exception.

    simplejwt raises AuthenticationFailed with detail codes like
    'token_not_valid', 'token_blacklisted', etc. — we surface those
    as our own codes so the frontend can handle them precisely.
    """
    # First check exception CLASS (for DRF built-in exceptions)
    # This handles AuthenticationFailed, ValidationError, etc.
    # NOTE: Must check class FIRST, before default_code, because DRF exceptions
    # have their own default_code attribute (lowercase) that would override this
    for exc_class, code in _EXCEPTION_CODE_MAP.items():
        if isinstance(exc, exc_class):
            return code

    # Check for custom default_code attribute (for custom exceptions only)
    custom_code = getattr(exc, "default_code", None)
    if custom_code:
        return custom_code

    # Then check simplejwt detail dict for token-specific codes
    detail = getattr(exc, "detail", None)
    if isinstance(detail, dict):
        code = detail.get("code") or detail.get("detail", {})
        if hasattr(code, "code"):
            code = code.code
        if code == "token_not_valid":
            return TOKEN_INVALID
        if code == "token_blacklisted":
            return TOKEN_BLACKLISTED

    return SERVER_ERROR


def _normalise_details(detail) -> dict:
    """
    Convert DRF's nested ErrorDetail structures into plain dicts/lists
    so they're JSON-serialisable without surprises.
    """
    if isinstance(detail, list):
        return {"non_field_errors": [str(e) for e in detail]}
    if isinstance(detail, dict):
        return {k: [str(e) for e in v] if isinstance(v, list) else str(v)
                for k, v in detail.items()}
    return {"detail": str(detail)}


def custom_exception_handler(exc: Exception, context: dict) -> Response | None:
    """
    Replacement for DRF's default exception handler.

    Every error response will have exactly this shape:
    {
        "error_code": "VALIDATION_ERROR",
        "message":    "Human-readable summary.",
        "details":    { ... field-level errors or empty dict ... }
    }
    """
    # Let DRF convert Http404 / PermissionDenied → DRF exceptions first
    response = drf_default_handler(exc, context)

    if response is None:
        custom_status = getattr(exc, "status_code", None)
        if custom_status:
            return Response(
                {
                    "error_code": _get_error_code(exc),
                    "message": str(exc),
                    "details": {},
                },
                status=custom_status,
            )
        return Response(
            {
                "error_code": SERVER_ERROR,
                "message": "An unexpected error occurred.",
                "details": {},
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    error_code = _get_error_code(exc)
    detail = getattr(exc, "detail", str(exc))

    # Build a clean human-readable message from the top-level detail
    if isinstance(detail, dict) and "detail" in detail:
        message = str(detail["detail"])
    elif isinstance(detail, list):
        message = str(detail[0]) if detail else "Validation failed."
    else:
        message = str(detail)

    details = _normalise_details(detail)

    response.data = {
        "error_code": error_code,
        "message": message,
        "details": details,
    }
    return response
