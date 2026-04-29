"""
Root URL configuration.

Admin URL is driven by the DJANGO_ADMIN_URL environment variable so
the path is never the default `admin/`. This is a security-through-obscurity
measure — not a substitute for strong auth, but a useful layer.

Ref: system.md §10.3, §12.1

Example .env entry:
    DJANGO_ADMIN_URL=secure-admin-xyz/

The trailing slash is required.
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path(settings.DJANGO_ADMIN_URL, admin.site.urls),
    path("api/v1/auth/",    include("apps.accounts.urls")),  # ← Ticket 1.3
    path("api/v1/profile/", include("apps.profiles.urls")),  # ← Ticket 1.6
    path("api/v1/careers/", include("apps.careers.urls")),   # ← Ticket 2.1
    path("api/v1/schema/",  SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/v1/schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
