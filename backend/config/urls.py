from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path(settings.DJANGO_ADMIN_URL, admin.site.urls),
    # path("api/v1/auth/",    include("apps.accounts.urls")),   ← Ticket 1.3
    # path("api/v1/profile/", include("apps.profiles.urls")),   ← Ticket 1.6
    # path("api/v1/careers/", include("apps.careers.urls")),    ← Ticket 2.1
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
