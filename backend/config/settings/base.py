from datetime import timedelta
from pathlib import Path

import environ

BASE_DIR = Path(__file__).resolve().parent.parent.parent

env = environ.Env(
    DEBUG=(bool, False),
    ALLOWED_HOSTS=(list, []),
    CORS_ALLOWED_ORIGINS=(list, []),
    CSRF_TRUSTED_ORIGINS=(list, []),
    JWT_ACCESS_TOKEN_LIFETIME_MINUTES=(int, 15),
    JWT_REFRESH_TOKEN_LIFETIME_DAYS=(int, 7),
    DB_PORT=(str, "5432"),
    DB_HOST=(str, "127.0.0.1"),
    SPECTACULAR_TITLE=(str, "Zignature API"),
    SPECTACULAR_DESC=(str, "API documentation for Zignature"),
    SPECTACULAR_SERVER_URL=(str, "http://localhost:8000/api/v1"),
    SPECTACULAR_VERSION=(str, "1.0.0"),
)

environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("SECRET_KEY")
ALLOWED_HOSTS = env("ALLOWED_HOSTS")

DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS = [
    "rest_framework",
    "corsheaders",
    "rest_framework_simplejwt.token_blacklist",
    "drf_spectacular",
    "django_filters",
]

LOCAL_APPS = [
    "apps.accounts",  # ← Ticket 1.2
    "apps.profiles",  # ← Ticket 1.6
    "apps.careers",   # ← Ticket 2.1
    "common",
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    # CorsMiddleware MUST be first — before any response-generating middleware
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = env("MEDIA_URL", default="/media/")
MEDIA_ROOT = env("MEDIA_ROOT", default=str(BASE_DIR / "media"))

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "accounts.User"

# ── Django REST Framework ────────────────────────────────────────────────────

REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    # Auth — JWT access token from Authorization header
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
     # Default: public endpoints unless explicitly restricted
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ],
     # Pagination — all list endpoints return paginated results
    # system.md §2.1: /careers/jobs/ target p95 = 150ms; PAGE_SIZE=10 keeps
    # response payload small and well within that budget.
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,
    # Filtering — enables DjangoFilterBackend globally
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.OrderingFilter",
    ],
    # ── Wire in the standard error envelope ─────────────────────────────────
    "EXCEPTION_HANDLER": "common.exception_handler.custom_exception_handler",
}

SPECTACULAR_SETTINGS = {
    "TITLE": env("SPECTACULAR_TITLE"),
    "DESCRIPTION": env("SPECTACULAR_DESC"),
    "SERVERS": [
        {
            "url": env("SPECTACULAR_SERVER_URL"),
            "description": "API Server",
        },
    ],
    "SCHEMA_PATH_PREFIX": r"/api/v1/",
    "VERSION": env("SPECTACULAR_VERSION"),
    "SCHEMA_PATH_PREFIX_TRIM": True,
    "COMPONENT_SPLIT_REQUEST": False,
}


# ── CORS ─────────────────────────────────────────────────────────────────────
# CORS_ALLOW_CREDENTIALS = True is REQUIRED for cross-origin cookie sending.
# The browser will not attach the httpOnly cookie to cross-origin requests
# unless both:
#   1. The server has CORS_ALLOW_CREDENTIALS = True
#   2. The cookie has SameSite=None; Secure

CORS_ALLOWED_ORIGINS = env("CORS_ALLOWED_ORIGINS")
CORS_ALLOW_CREDENTIALS = True  # ← CRITICAL for cookie support

# ── JWT & Cookie Configuration ───────────────────────────────────────────────
#
# AUTH_COOKIE_SAMESITE = "None" is the correct value.
#
# Why NOT SameSite=Strict:
#   • Cross-origin frontends (app.yourdomain.com → api.yourdomain.com):
#     The cookie is NEVER sent. Login silently breaks.
#   • Mobile browsers (Safari iOS, Chrome Android): Same problem.
#   • Any OAuth redirect flow: Redirect breaks the same-site context.
#
# Why SameSite=None; Secure is safe:
#   • CSRF: The CORS policy (CORS_ALLOWED_ORIGINS) + DRF's enforcement
#     of the Origin header already prevents CSRF for JSON APIs.
#     JSON APIs don't accept form submissions from other origins.
#   • XSS: The httpOnly flag prevents JS from reading the cookie even if
#     the attacker has JS execution on your domain.
#   • The Secure flag ensures the cookie is only sent over HTTPS in production.
#
# In development (DEBUG=True), views.py sets secure=False automatically.

SIMPLE_JWT = {
    # ── Token lifetimes (system.md §7.3) ────────────────────────────────────
    "ACCESS_TOKEN_LIFETIME": timedelta(
        minutes=env("JWT_ACCESS_TOKEN_LIFETIME_MINUTES")
    ),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=env("JWT_REFRESH_TOKEN_LIFETIME_DAYS")),
    # ── Rotation & blacklist ─────────────────────────────────────────────────
    # ROTATE_REFRESH_TOKENS: every /token/refresh/ issues a NEW refresh token
    # and the old one is blacklisted. This enables stolen-token detection:
    # if an attacker uses a refresh token after the legitimate user has already
    # rotated it, the attacker's token is already blacklisted → 401.
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": True,
    # ── Algorithm ────────────────────────────────────────────────────────────
    # HS256 is fine for monoliths. Use RS256 if you have multiple services
    # that need to verify tokens independently (microservices).
    "ALGORITHM": "HS256",
    # ── Headers ──────────────────────────────────────────────────────────────
    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    # ── Cookie settings (system.md §7.4) ────────────────────────────────────
    "AUTH_COOKIE": "refresh_token",
    "AUTH_COOKIE_PATH": "/api/v1/auth/",
    # SameSite=None → cookie is sent on all cross-origin requests.
    # This is what makes the auth work on every browser and device.
    # The CORS policy + httpOnly + Secure are our actual security layers.
    "AUTH_COOKIE_SAMESITE": "None",
}

DJANGO_ADMIN_URL = env("DJANGO_ADMIN_URL", default="admin/")

# ── Google OAuth2 (Ticket 1.4) ───────────────────────────────────────────────
# GOOGLE_CLIENT_ID is used by google.py to verify id_tokens.
# Must match the Client ID in Google Cloud Console → OAuth 2.0 Credentials.
# The frontend (@react-oauth/google) must use the same client ID.
GOOGLE_CLIENT_ID = env("GOOGLE_CLIENT_ID", default="")

# Admin URL — never use the default `admin/` in production.
# Set this in your .env file.
# Example: DJANGO_ADMIN_URL=secure-admin/
DJANGO_ADMIN_URL = env("DJANGO_ADMIN_URL", default="admin/")
