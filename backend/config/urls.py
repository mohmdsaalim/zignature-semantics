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
    path("api/v1/auth/", include("apps.accounts.urls")),
    path("api/v1/profile/", include("apps.profiles.urls")),  # ← Ticket 1.6
    # path("api/v1/careers/", include("apps.careers.urls")),    ← Ticket 2.1
    path("api/v1/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/v1/schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
