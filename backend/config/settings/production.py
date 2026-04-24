"""
config/settings/production.py

Production overrides. SameSite=None; Secure=True is enforced.
"""
import environ

from .base import *  # noqa: F401, F403

DEBUG = False

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": environ.Env()("DB_NAME"),
        "USER": environ.Env()("DB_USER"),
        "PASSWORD": environ.Env()("DB_PASSWORD"),
        "HOST": environ.Env()("DB_HOST"),
        "PORT": environ.Env()("DB_PORT"),
        "CONN_MAX_AGE": 60,
        "OPTIONS": {
            "sslmode": "require",
        },
    }
}

# Security headers
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_SSL_REDIRECT = True
CSRF_TRUSTED_ORIGINS = environ.Env()("CSRF_TRUSTED_ORIGINS")
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
X_FRAME_OPTIONS = "DENY"

# In production, SameSite=None is already set in base.py.
# Secure=True is enforced in views.py via `not settings.DEBUG`.
# CORS_ALLOWED_ORIGINS must be set via environment variable.

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "level": "INFO",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
    "loggers": {
        "django.db.backends": {
            "level": "WARNING",
        },
    },
}
