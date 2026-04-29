"""
FilterSets for the careers public API.

Ref: system.md §6.3

Supported filters for /careers/jobs/:
  ?job_type=remote
  ?experience_level=senior
  ?company=acme-corp          (company slug)
  ?search=python              (title OR description)
  ?location=kochi             (case-insensitive contains)
  ?is_active=true             (default filtered in ViewSet, exposed for clarity)

All filters are case-insensitive where it makes sense.
"""

import django_filters
from django.db.models import Q

from .models import Company, JobListing


class JobListingFilter(django_filters.FilterSet):
    """
    FilterSet for JobListing list endpoint.

    `company` filters by company slug (not PK) — matches the API design
    in system.md §6.3: ?company=acme-corp
    """

    company = django_filters.CharFilter(
        field_name="company__slug",
        lookup_expr="iexact",
        label="Company slug",
    )
    location = django_filters.CharFilter(
        field_name="location",
        lookup_expr="icontains",
        label="Location (partial match)",
    )
    search = django_filters.CharFilter(
        method="filter_search",
        label="Keyword search (title, description)",
    )

    class Meta:
        model = JobListing
        fields = {
            "job_type": ["exact"],
            "experience_level": ["exact"],
        }

    def filter_search(self, queryset, name, value):
        """
        Full-text style search across title and description.
        Uses OR — a keyword in either field surfaces the listing.
        Ref: system.md §6.3 ?search=python
        """
        if not value:
            return queryset
        return queryset.filter(
            Q(title__icontains=value) | Q(description__icontains=value)
        )


class CompanyFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(
        method="filter_search",
        label="Keyword search (name, location)",
    )
    location = django_filters.CharFilter(
        field_name="location",
        lookup_expr="icontains",
    )

    class Meta:
        model = Company
        fields: dict = {}

    def filter_search(self, queryset, name, value):
        if not value:
            return queryset
        return queryset.filter(
            Q(name__icontains=value) | Q(location__icontains=value)
        )
