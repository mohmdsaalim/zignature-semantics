import environ

from .base import *  # noqa: F403, F405
from .base import BASE_DIR, SIMPLE_JWT  # Explicit import for Ruff

DEBUG = True
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0"]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": environ.Env()("DB_NAME", default="zignature_db"),
        "USER": environ.Env()("DB_USER", default="zignature_user"),
        "PASSWORD": environ.Env()("DB_PASSWORD", default="zignature_pass"),
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

SIMPLE_JWT = {
    **SIMPLE_JWT,
    "AUTH_COOKIE_SAMESITE": "Lax",
}
