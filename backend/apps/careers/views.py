"""
ViewSets for the careers public API.

Query optimisation strategy (zero N+1):

  JobListingViewSet
    .select_related('company')
      → Each job needs its company for the nested serializer.
        select_related fetches both in ONE JOIN query.
        Without this: 1 query for jobs + N queries for companies = N+1.

  CompanyDetailView
    .prefetch_related(
        Prefetch('job_listings', queryset=JobListing.objects.filter(is_active=True))
    )
      → Company detail page shows the company's active jobs.
        Prefetch with a filtered queryset fetches all jobs in ONE query
        and maps them to companies in Python. The serializer reads from
        the prefetch cache — zero extra queries.

Both ViewSets are read-only (ModelViewSet with read-only mixin) and
require no authentication — these are the public browsing endpoints.

Ref: system.md §6.3
"""

from django.db.models import Prefetch
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, mixins, viewsets
from rest_framework.permissions import AllowAny

from .filters import CompanyFilter, JobListingFilter
from .models import Company, JobListing
from .serializers import (
    CompanyDetailSerializer,
    CompanySerializer,
    JobListingDetailSerializer,
    JobListingListSerializer,
)


class JobListingViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    """
    Public read-only API for job listings.

    list:   GET /api/v1/careers/jobs/
    detail: GET /api/v1/careers/jobs/<slug>/

    Filtering (system.md §6.3):
      ?job_type=remote
      ?experience_level=senior
      ?company=acme-corp
      ?search=python
      ?location=kochi

    Pagination: 10 per page (PAGE_SIZE in settings).
    Auth: None — fully public.

    Inactive listings AND listings for inactive companies are both hidden.
    This is enforced in get_queryset() not in the filter class so it
    cannot be bypassed by any query parameter.
    """

    permission_classes = [AllowAny]
    lookup_field = "slug"  # /careers/jobs/<slug>/ not /careers/jobs/<pk>/

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = JobListingFilter
    ordering_fields = ["created_at", "deadline", "title"]
    ordering = ["-created_at"]  # default

    def get_queryset(self):
        """
        Base queryset:
          - Only active job listings
          - Only for active companies
          - select_related('company') eliminates N+1 on the company FK

        The is_active filters are applied here (not in filterset) so they
        are never overridable via query params.
        """
        return (
            JobListing.objects.filter(
                is_active=True,
                company__is_active=True,  # hides jobs for inactive companies
            )
            .select_related("company")  # eliminates N+1
            .order_by("-created_at")
        )

    def get_serializer_class(self):
        """
        List view: lightweight serializer without description/requirements.
        Detail view: full serializer with all fields.
        """
        if self.action == "retrieve":
            return JobListingDetailSerializer
        return JobListingListSerializer


class CompanyViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    """
    Public read-only API for companies.

    list:   GET /api/v1/careers/companies/
    detail: GET /api/v1/careers/companies/<slug>/

    The detail endpoint includes the company's active job listings
    (prefetched in one query) and an active_jobs_count.
    """

    permission_classes = [AllowAny]
    lookup_field = "slug"

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = CompanyFilter
    ordering_fields = ["name", "created_at"]
    ordering = ["name"]

    def get_queryset(self):
        """
        Only active companies.

        For the detail view, prefetch active job listings so
        CompanyDetailSerializer.get_active_jobs_count() and the embedded
        job list both read from the prefetch cache — no extra queries.
        """
        if self.action == "retrieve":
            active_jobs_prefetch = Prefetch(
                "job_listings",
                queryset=JobListing.objects.filter(
                    is_active=True,
                ).select_related("company"),
            )
            return Company.objects.filter(is_active=True).prefetch_related(
                active_jobs_prefetch
            )

        return Company.objects.filter(is_active=True)

    def get_serializer_class(self):
        if self.action == "retrieve":
            return CompanyDetailSerializer
        return CompanySerializer
