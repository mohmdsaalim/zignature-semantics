from pathlib import Path

import environ

from .base import *  # noqa
from .base import BASE_DIR

# Read .env BEFORE any env() calls
_BASE_DIR = Path(__file__).resolve().parent.parent.parent
environ.Env.read_env(_BASE_DIR / ".env")

DEBUG = True
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0"]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": environ.Env()("DB_NAME", default="agency_db"),
        "USER": environ.Env()("DB_USER", default="agency_user"),
        "PASSWORD": environ.Env()("DB_PASSWORD", default="agency_pass"),
        "HOST": environ.Env()("DB_HOST", default="db"),
        "PORT": environ.Env()("DB_PORT", default="5432"),
    }
}

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
MEDIA_ROOT = BASE_DIR / "media"
MEDIA_URL = "/media/"

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False
