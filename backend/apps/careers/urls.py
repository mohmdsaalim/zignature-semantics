"""
URL registration for the careers public API.

Routes produced by DefaultRouter:

  GET  /api/v1/careers/jobs/              → JobListingViewSet.list
  GET  /api/v1/careers/jobs/<slug>/       → JobListingViewSet.retrieve
  GET  /api/v1/careers/companies/         → CompanyViewSet.list
  GET  /api/v1/careers/companies/<slug>/  → CompanyViewSet.retrieve

No write routes are registered — the ViewSets use read-only mixins.
Ref: system.md §6.3
"""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CompanyViewSet, JobListingViewSet

router = DefaultRouter()
router.register(r"jobs", JobListingViewSet, basename="job")
router.register(r"companies", CompanyViewSet, basename="company")

urlpatterns = [
    path("", include(router.urls)),
]
