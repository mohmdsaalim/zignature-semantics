"""
Serializers for the careers public API.

Design decisions:
  - CompanySerializer is nested inside JobListingSerializer.
    This avoids a separate company lookup for every job card — the frontend
    gets everything it needs in one request with zero extra queries.

  - logo_url is a SerializerMethodField instead of ImageField.url because
    ImageField.url throws ValueError when the field is blank. The method
    returns None safely.

  - JobListingListSerializer (for the list endpoint) omits the heavy
    `description` and `requirements` fields. These can be large HTML blobs
    and have no place on a job card. They are only returned by the detail
    endpoint via JobListingDetailSerializer.

  - select_related('company') is enforced in the ViewSet queryset, not here,
    so the serializer never triggers an extra DB hit for company data.

Ref: system.md §5.4, §5.5, §6.3
"""

from rest_framework import serializers

from .models import Company, JobListing


class CompanySerializer(serializers.ModelSerializer):
    """
    Compact company representation embedded inside job listing responses.
    Includes all fields from system.md §5.4.
    """

    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = [
            "id",
            "name",
            "slug",
            "logo_url",
            "website",
            "description",
            "location",
        ]

    def get_logo_url(self, obj) -> str | None:
        """Returns absolute URL for the company logo, or None if not set."""
        if not obj.logo:
            return None
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.logo.url)
        return obj.logo.url


class CompanyDetailSerializer(CompanySerializer):
    """
    Full company representation for the /careers/companies/<slug>/ endpoint.
    Includes active_jobs_count for the company detail page badge.
    """

    active_jobs_count = serializers.SerializerMethodField()

    class Meta(CompanySerializer.Meta):
        fields = CompanySerializer.Meta.fields + [
            "is_active",
            "created_at",
            "active_jobs_count",
        ]

    def get_active_jobs_count(self, obj) -> int:
        """
        Uses prefetch_related('job_listings') data if available (set by
        ViewSet). Falls back to a DB query — never causes N+1 if the
        ViewSet uses prefetch_related correctly.
        """
        # The ViewSet prefetches only active job listings via
        # Prefetch('job_listings', queryset=JobListing.objects.filter(is_active=True))
        # so we just count the prefetched cache here.
        if hasattr(obj, '_prefetched_objects_cache') and 'job_listings' in obj._prefetched_objects_cache:
            return len(obj._prefetched_objects_cache['job_listings'])
        return obj.job_listings.filter(is_active=True).count()


class JobListingListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for the job listings list view.

    Omits description and requirements (heavy HTML content) — not needed
    on job cards. The detail serializer provides those fields.

    company is nested (read-only) to avoid a second query per job.
    select_related('company') in the ViewSet makes this free.
    """

    company = CompanySerializer(read_only=True)
    job_type_display = serializers.CharField(
        source="get_job_type_display", read_only=True
    )
    experience_level_display = serializers.CharField(
        source="get_experience_level_display", read_only=True
    )

    class Meta:
        model = JobListing
        fields = [
            "id",
            "slug",
            "title",
            "company",
            "location",
            "job_type",
            "job_type_display",
            "experience_level",
            "experience_level_display",
            "deadline",
            "created_at",
        ]


class JobListingDetailSerializer(JobListingListSerializer):
    """
    Full serializer for the job detail view.
    Extends the list serializer with the content-heavy fields.
    """

    class Meta(JobListingListSerializer.Meta):
        fields = JobListingListSerializer.Meta.fields + [
            "description",
            "requirements",
            "updated_at",
        ]
