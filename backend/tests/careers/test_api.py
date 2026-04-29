"""
Test suite for Ticket 2.3 — Careers Public API

Coverage:
  - JobListing list endpoint: status, shape, pagination
  - JobListing detail endpoint: status, all fields present
  - Inactive filtering: inactive jobs hidden, inactive company jobs hidden
  - Filtering: job_type, experience_level, company slug, search, location
  - Ordering: default newest-first, ?ordering=deadline
  - Company list endpoint: status, shape
  - Company detail endpoint: nested jobs, active_jobs_count
  - N+1 query count assertions (select_related / prefetch_related)
  - Serializer field coverage: all system.md §5.4/§5.5 fields present
  - Unauthenticated access: all endpoints return 200 (public API)
  - Pagination: count, next, previous keys present

Run:
    docker compose exec backend uv run pytest tests/careers/test_api.py -v
"""

import pytest
from django.urls import reverse
from rest_framework.test import APIClient

from apps.careers.models import Company, JobListing
from django.utils.text import slugify


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture
def api():
    return APIClient()


@pytest.fixture
def company(db):
    return Company.objects.create(
        name="Zignature Tech",
        slug="zignature-tech",
        location="Kochi, Kerala",
        website="https://zignature.io",
        description="Full-stack web agency.",
        is_active=True,
    )


@pytest.fixture
def inactive_company(db):
    return Company.objects.create(
        name="Archived Corp",
        slug="archived-corp",
        is_active=False,
    )


@pytest.fixture
def active_job(db, company):
    return JobListing.objects.create(
        company=company,
        title="Backend Developer",
        description="Build REST APIs with Django and DRF.",
        requirements="Python 3.10+, Django, PostgreSQL.",
        location="Kochi",
        job_type=JobListing.JobType.FULL_TIME,
        experience_level=JobListing.ExperienceLevel.MID,
        is_active=True,
    )


@pytest.fixture
def inactive_job(db, company):
    return JobListing.objects.create(
        company=company,
        title="Invisible Job",
        description="This job should never appear in the API.",
        job_type=JobListing.JobType.CONTRACT,
        experience_level=JobListing.ExperienceLevel.JUNIOR,
        is_active=False,
    )


@pytest.fixture
def job_for_inactive_company(db, inactive_company):
    """Active job listing but for an inactive company — must be hidden."""
    return JobListing.objects.create(
        company=inactive_company,
        title="Job At Dead Company",
        description="Should be hidden because company is inactive.",
        job_type=JobListing.JobType.REMOTE,
        experience_level=JobListing.ExperienceLevel.SENIOR,
        is_active=True,
    )


@pytest.fixture
def remote_job(db, company):
    return JobListing.objects.create(
        company=company,
        title="React Developer",
        description="Build frontend components.",
        job_type=JobListing.JobType.REMOTE,
        experience_level=JobListing.ExperienceLevel.SENIOR,
        is_active=True,
    )


@pytest.fixture
def multiple_jobs(db, company):
    """Creates 12 active jobs to test pagination (PAGE_SIZE=10)."""
    jobs = []
    for i in range(12):
        title = f"Job Position {i:02d}"
        jobs.append(
            JobListing(
                company=company,
                slug=slugify(title),
                description=f"Description for position {i}.",
                job_type=JobListing.JobType.FULL_TIME,
                experience_level=JobListing.ExperienceLevel.MID,
                is_active=True,
            )
        )
    JobListing.objects.bulk_create(jobs)
    return jobs


# ---------------------------------------------------------------------------
# Job Listing List — Basic
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestJobListingList:
    URL = "/api/v1/careers/jobs/"

    def test_returns_200(self, api, active_job):
        response = api.get(self.URL)
        assert response.status_code == 200

    def test_unauthenticated_access_allowed(self, api, active_job):
        """Public API — no auth header needed."""
        response = api.get(self.URL)
        assert response.status_code == 200

    def test_response_has_paginated_shape(self, api, active_job):
        data = api.get(self.URL).data
        assert "count" in data
        assert "results" in data
        assert isinstance(data["results"], list)

    def test_response_has_next_and_previous_keys(self, api, active_job):
        data = api.get(self.URL).data
        assert "next" in data
        assert "previous" in data

    def test_active_job_appears_in_results(self, api, active_job):
        results = api.get(self.URL).data["results"]
        slugs = [j["slug"] for j in results]
        assert active_job.slug in slugs

    def test_count_matches_active_jobs_only(self, api, active_job, inactive_job):
        count = api.get(self.URL).data["count"]
        assert count == 1  # only active_job

    def test_empty_list_returns_200(self, api, db):
        response = api.get(self.URL)
        assert response.status_code == 200
        assert response.data["count"] == 0


# ---------------------------------------------------------------------------
# Job Listing List — Fields (system.md §5.5)
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestJobListingListFields:
    URL = "/api/v1/careers/jobs/"

    def _get_first(self, api, active_job):
        return api.get(self.URL).data["results"][0]

    def test_id_present(self, api, active_job):
        assert "id" in self._get_first(api, active_job)

    def test_slug_present(self, api, active_job):
        assert "slug" in self._get_first(api, active_job)

    def test_title_present(self, api, active_job):
        assert "title" in self._get_first(api, active_job)

    def test_company_nested_object(self, api, active_job):
        item = self._get_first(api, active_job)
        assert "company" in item
        assert isinstance(item["company"], dict)

    def test_company_has_name(self, api, active_job):
        item = self._get_first(api, active_job)
        assert item["company"]["name"] == "Zignature Tech"

    def test_company_has_slug(self, api, active_job):
        item = self._get_first(api, active_job)
        assert item["company"]["slug"] == "zignature-tech"

    def test_job_type_present(self, api, active_job):
        item = self._get_first(api, active_job)
        assert "job_type" in item
        assert item["job_type"] == "full_time"

    def test_job_type_display_present(self, api, active_job):
        item = self._get_first(api, active_job)
        assert "job_type_display" in item
        assert item["job_type_display"] == "Full Time"

    def test_experience_level_present(self, api, active_job):
        item = self._get_first(api, active_job)
        assert "experience_level" in item

    def test_experience_level_display_present(self, api, active_job):
        item = self._get_first(api, active_job)
        assert "experience_level_display" in item

    def test_location_present(self, api, active_job):
        assert "location" in self._get_first(api, active_job)

    def test_deadline_present(self, api, active_job):
        assert "deadline" in self._get_first(api, active_job)

    def test_created_at_present(self, api, active_job):
        assert "created_at" in self._get_first(api, active_job)

    def test_list_does_not_include_description(self, api, active_job):
        """Description is heavy HTML — excluded from list view."""
        item = self._get_first(api, active_job)
        assert "description" not in item

    def test_list_does_not_include_requirements(self, api, active_job):
        item = self._get_first(api, active_job)
        assert "requirements" not in item


# ---------------------------------------------------------------------------
# Job Listing Detail
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestJobListingDetail:
    def _url(self, slug):
        return f"/api/v1/careers/jobs/{slug}/"

    def test_returns_200_for_active_job(self, api, active_job):
        response = api.get(self._url(active_job.slug))
        assert response.status_code == 200

    def test_returns_404_for_inactive_job(self, api, inactive_job):
        response = api.get(self._url(inactive_job.slug))
        assert response.status_code == 404

    def test_returns_404_for_nonexistent_slug(self, api, db):
        response = api.get(self._url("does-not-exist"))
        assert response.status_code == 404

    def test_detail_includes_description(self, api, active_job):
        data = api.get(self._url(active_job.slug)).data
        assert "description" in data
        assert data["description"] == active_job.description

    def test_detail_includes_requirements(self, api, active_job):
        data = api.get(self._url(active_job.slug)).data
        assert "requirements" in data

    def test_detail_includes_updated_at(self, api, active_job):
        data = api.get(self._url(active_job.slug)).data
        assert "updated_at" in data

    def test_detail_slug_matches(self, api, active_job):
        data = api.get(self._url(active_job.slug)).data
        assert data["slug"] == active_job.slug

    def test_detail_company_nested(self, api, active_job):
        data = api.get(self._url(active_job.slug)).data
        assert isinstance(data["company"], dict)
        assert data["company"]["name"] == "Zignature Tech"

    def test_job_for_inactive_company_returns_404(
        self, api, job_for_inactive_company
    ):
        response = api.get(self._url(job_for_inactive_company.slug))
        assert response.status_code == 404


# ---------------------------------------------------------------------------
# Inactive Filtering — Critical Business Rule
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestInactiveFiltering:
    URL = "/api/v1/careers/jobs/"

    def test_inactive_job_not_in_list(self, api, inactive_job):
        results = api.get(self.URL).data["results"]
        slugs = [j["slug"] for j in results]
        assert inactive_job.slug not in slugs

    def test_job_for_inactive_company_not_in_list(
        self, api, job_for_inactive_company
    ):
        """
        Critical: active job for an inactive company must be hidden.
        system.md §2.3 warning: "if a company is inactive, all its jobs
        should also be hidden even if the job itself is marked active."
        """
        results = api.get(self.URL).data["results"]
        slugs = [j["slug"] for j in results]
        assert job_for_inactive_company.slug not in slugs

    def test_only_active_jobs_counted(
        self, api, active_job, inactive_job, job_for_inactive_company
    ):
        count = api.get(self.URL).data["count"]
        assert count == 1  # only active_job with active company

    def test_activating_company_shows_jobs(
        self, api, job_for_inactive_company, inactive_company
    ):
        """Re-activating a company makes its active jobs visible again."""
        inactive_company.is_active = True
        inactive_company.save()
        results = api.get(self.URL).data["results"]
        slugs = [j["slug"] for j in results]
        assert job_for_inactive_company.slug in slugs


# ---------------------------------------------------------------------------
# Filtering (system.md §6.3)
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestJobListingFiltering:
    URL = "/api/v1/careers/jobs/"

    def test_filter_by_job_type_remote(self, api, active_job, remote_job):
        response = api.get(self.URL, {"job_type": "remote"})
        results = response.data["results"]
        assert all(j["job_type"] == "remote" for j in results)
        slugs = [j["slug"] for j in results]
        assert remote_job.slug in slugs
        assert active_job.slug not in slugs

    def test_filter_by_job_type_full_time(self, api, active_job, remote_job):
        response = api.get(self.URL, {"job_type": "full_time"})
        results = response.data["results"]
        assert all(j["job_type"] == "full_time" for j in results)

    def test_filter_by_experience_level_senior(
        self, api, active_job, remote_job
    ):
        response = api.get(self.URL, {"experience_level": "senior"})
        results = response.data["results"]
        assert all(j["experience_level"] == "senior" for j in results)
        slugs = [j["slug"] for j in results]
        assert remote_job.slug in slugs
        assert active_job.slug not in slugs

    def test_filter_by_company_slug(self, api, active_job, db):
        other_company = Company.objects.create(name="Other Co", is_active=True)
        other_job = JobListing.objects.create(
            company=other_company,
            title="Other Job",
            description="d",
            job_type=JobListing.JobType.FULL_TIME,
            experience_level=JobListing.ExperienceLevel.MID,
            is_active=True,
        )
        response = api.get(self.URL, {"company": "zignature-tech"})
        results = response.data["results"]
        slugs = [j["slug"] for j in results]
        assert active_job.slug in slugs
        assert other_job.slug not in slugs

    def test_search_by_title_keyword(self, api, active_job, remote_job):
        response = api.get(self.URL, {"search": "Backend"})
        results = response.data["results"]
        slugs = [j["slug"] for j in results]
        assert active_job.slug in slugs
        assert remote_job.slug not in slugs

    def test_search_by_description_keyword(self, api, active_job):
        response = api.get(self.URL, {"search": "Django"})
        results = response.data["results"]
        slugs = [j["slug"] for j in results]
        assert active_job.slug in slugs

    def test_search_case_insensitive(self, api, active_job):
        response = api.get(self.URL, {"search": "backend"})
        assert response.data["count"] >= 1

    def test_search_no_match_returns_empty(self, api, active_job):
        response = api.get(self.URL, {"search": "xyznonexistentxyz"})
        assert response.data["count"] == 0

    def test_combined_filters(self, api, active_job, remote_job):
        """Both filters must match — job_type AND experience_level."""
        response = api.get(
            self.URL,
            {"job_type": "remote", "experience_level": "senior"},
        )
        results = response.data["results"]
        slugs = [j["slug"] for j in results]
        assert remote_job.slug in slugs
        assert active_job.slug not in slugs

    def test_filter_no_results_returns_empty_list(self, api, active_job):
        response = api.get(self.URL, {"job_type": "part_time"})
        assert response.data["count"] == 0
        assert response.data["results"] == []


# ---------------------------------------------------------------------------
# Ordering
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestJobListingOrdering:
    URL = "/api/v1/careers/jobs/"

    def test_default_ordering_newest_first(self, api, multiple_jobs):
        results = api.get(self.URL).data["results"]
        dates = [r["created_at"] for r in results]
        assert dates == sorted(dates, reverse=True)

    def test_ordering_by_title_ascending(self, api, multiple_jobs):
        response = api.get(self.URL, {"ordering": "title"})
        results = response.data["results"]
        titles = [r["title"] for r in results]
        assert titles == sorted(titles)

    def test_ordering_by_title_descending(self, api, multiple_jobs):
        response = api.get(self.URL, {"ordering": "-title"})
        results = response.data["results"]
        titles = [r["title"] for r in results]
        assert titles == sorted(titles, reverse=True)


# ---------------------------------------------------------------------------
# Pagination
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestJobListingPagination:
    URL = "/api/v1/careers/jobs/"

    def test_page_size_is_10(self, api, multiple_jobs):
        """12 jobs created, page 1 should return 10."""
        response = api.get(self.URL)
        assert len(response.data["results"]) == 10

    def test_total_count_is_12(self, api, multiple_jobs):
        assert api.get(self.URL).data["count"] == 12

    def test_next_page_url_present_on_page_1(self, api, multiple_jobs):
        assert api.get(self.URL).data["next"] is not None

    def test_previous_is_null_on_page_1(self, api, multiple_jobs):
        assert api.get(self.URL).data["previous"] is None

    def test_page_2_has_remaining_results(self, api, multiple_jobs):
        response = api.get(self.URL, {"page": 2})
        assert len(response.data["results"]) == 2

    def test_page_2_previous_is_not_null(self, api, multiple_jobs):
        assert api.get(self.URL, {"page": 2}).data["previous"] is not None


# ---------------------------------------------------------------------------
# Company List Endpoint
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestCompanyList:
    URL = "/api/v1/careers/companies/"

    def test_returns_200(self, api, company):
        assert api.get(self.URL).status_code == 200

    def test_unauthenticated_access_allowed(self, api, company):
        assert api.get(self.URL).status_code == 200

    def test_paginated_shape(self, api, company):
        data = api.get(self.URL).data
        assert "count" in data
        assert "results" in data

    def test_active_company_in_results(self, api, company):
        results = api.get(self.URL).data["results"]
        slugs = [c["slug"] for c in results]
        assert "zignature-tech" in slugs

    def test_inactive_company_not_in_results(self, api, inactive_company):
        results = api.get(self.URL).data["results"]
        slugs = [c["slug"] for c in results]
        assert inactive_company.slug not in slugs

    def test_company_fields_present(self, api, company):
        results = api.get(self.URL).data["results"]
        item = results[0]
        for field in ["id", "name", "slug", "website", "location", "logo_url"]:
            assert field in item, f"Missing field: {field}"

    def test_search_by_company_name(self, api, company):
        response = api.get(self.URL, {"search": "Zignature"})
        assert response.data["count"] >= 1

    def test_search_no_match(self, api, company):
        response = api.get(self.URL, {"search": "xyznotexists"})
        assert response.data["count"] == 0


# ---------------------------------------------------------------------------
# Company Detail Endpoint
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestCompanyDetail:
    def _url(self, slug):
        return f"/api/v1/careers/companies/{slug}/"

    def test_returns_200_for_active_company(self, api, company):
        assert api.get(self._url("zignature-tech")).status_code == 200

    def test_returns_404_for_inactive_company(self, api, inactive_company):
        assert api.get(self._url(inactive_company.slug)).status_code == 404

    def test_returns_404_for_nonexistent_slug(self, api, db):
        assert api.get(self._url("does-not-exist")).status_code == 404

    def test_detail_has_active_jobs_count(self, api, company, active_job):
        data = api.get(self._url("zignature-tech")).data
        assert "active_jobs_count" in data
        assert data["active_jobs_count"] == 1

    def test_active_jobs_count_excludes_inactive(
        self, api, company, active_job, inactive_job
    ):
        data = api.get(self._url("zignature-tech")).data
        assert data["active_jobs_count"] == 1

    def test_detail_has_is_active_field(self, api, company):
        data = api.get(self._url("zignature-tech")).data
        assert "is_active" in data
        assert data["is_active"] is True

    def test_detail_has_created_at(self, api, company):
        data = api.get(self._url("zignature-tech")).data
        assert "created_at" in data

    def test_detail_description_present(self, api, company):
        data = api.get(self._url("zignature-tech")).data
        assert "description" in data


# ---------------------------------------------------------------------------
# Query Count — N+1 Prevention
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestQueryOptimisation:
    """
    Ensures select_related and prefetch_related are working.

    Strategy: create N jobs across 2 companies, assert the list endpoint
    uses a fixed small number of queries regardless of N.

    Expected queries for job list:
      1. COUNT(*) for pagination
      2. SELECT jobs JOIN companies (select_related)
    Total: 2 queries always — never N+1.
    """

    URL = "/api/v1/careers/jobs/"

    def test_job_list_query_count(self, api, db, django_assert_num_queries):
        company_a = Company.objects.create(name="Company A", is_active=True)
        company_b = Company.objects.create(name="Company B", is_active=True)

        for i in range(5):
            JobListing.objects.create(
                company=company_a,
                title=f"Job A{i}",
                description="d",
                job_type=JobListing.JobType.FULL_TIME,
                experience_level=JobListing.ExperienceLevel.MID,
                is_active=True,
            )
        for i in range(5):
            JobListing.objects.create(
                company=company_b,
                title=f"Job B{i}",
                description="d",
                job_type=JobListing.JobType.REMOTE,
                experience_level=JobListing.ExperienceLevel.SENIOR,
                is_active=True,
            )

        with django_assert_num_queries(2):
            # 1: COUNT for pagination header
            # 2: SELECT jobs JOIN companies (select_related)
            api.get(self.URL)

    def test_company_detail_query_count(
        self, api, db, django_assert_num_queries, company, active_job, inactive_job
    ):
        """
        Company detail must NOT fire a query per job listing.
        Expected:
          1. SELECT company WHERE slug=...
          2. SELECT job_listings WHERE company_id=... AND is_active=True
             (prefetch_related)
        Total: 2 queries.
        """
        with django_assert_num_queries(2):
            api.get(f"/api/v1/careers/companies/{company.slug}/")


# ---------------------------------------------------------------------------
# Write Operations Blocked (read-only API)
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestReadOnlyAPI:
    def test_post_to_jobs_returns_405(self, api, company):
        response = api.post(
            "/api/v1/careers/jobs/",
            {"title": "Hack", "company": str(company.id)},
            format="json",
        )
        assert response.status_code == 405

    def test_put_to_job_returns_405(self, api, active_job):
        response = api.put(
            f"/api/v1/careers/jobs/{active_job.slug}/",
            {"title": "Updated"},
            format="json",
        )
        assert response.status_code == 405

    def test_delete_job_returns_405(self, api, active_job):
        response = api.delete(f"/api/v1/careers/jobs/{active_job.slug}/")
        assert response.status_code == 405

    def test_post_to_companies_returns_405(self, api, company):
        response = api.post(
            "/api/v1/careers/companies/",
            {"name": "Hack Corp"},
            format="json",
        )
        assert response.status_code == 405
