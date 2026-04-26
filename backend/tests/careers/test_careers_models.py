"""
Test suite for apps.careers — Ticket 2.1

Coverage:
  - Company model: creation, UUID PK, slug auto-generation, slug uniqueness,
    explicit slug respected, __str__, Meta ordering, is_active index
  - JobListing model: creation, UUID PK, slug auto-generation, slug uniqueness,
    FK to Company (CASCADE), choices validation, __str__, Meta ordering,
    db_index fields
  - Edge cases: slug collision handling, empty slug vs explicit slug,
    special characters in name/title, very long names, re-save does not
    overwrite existing slug
  - DB constraints: unique name for Company, unique slug for both models
  - Relationship: related_name=job_listings, cascade delete

Run:
    docker compose exec backend uv run pytest apps/careers/ -v
"""

import uuid

import pytest
from django.db import IntegrityError

from apps.careers.models import Company, JobListing

# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture
def company(db):
    """A basic active company."""
    return Company.objects.create(
        name="Zignature Tech",
        website="https://zignature.io",
        location="Kochi, Kerala",
        description="Full-stack web agency.",
    )


@pytest.fixture
def inactive_company(db):
    """An inactive company for filter tests."""
    return Company.objects.create(name="Archived Corp", is_active=False)


@pytest.fixture
def job(db, company):
    """A basic active job listing."""
    return JobListing.objects.create(
        company=company,
        title="Backend Developer",
        description="Build REST APIs with Django.",
        job_type=JobListing.JobType.FULL_TIME,
        experience_level=JobListing.ExperienceLevel.MID,
        location="Remote",
    )


# ---------------------------------------------------------------------------
# Company — Model Fields & Creation
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestCompanyModel:
    def test_creates_company_successfully(self, company):
        assert Company.objects.filter(pk=company.pk).exists()

    def test_primary_key_is_uuid(self, company):
        assert isinstance(company.id, uuid.UUID)

    def test_primary_key_is_not_editable(self):
        field = Company._meta.get_field("id")
        assert field.editable is False

    def test_name_is_required(self, db):
        with pytest.raises(IntegrityError):
            Company.objects.create(name=None)

    def test_name_unique_constraint(self, company, db):
        with pytest.raises(IntegrityError):
            Company.objects.create(name="Zignature Tech")

    def test_is_active_defaults_to_true(self, db):
        c = Company.objects.create(name="Active By Default")
        assert c.is_active is True

    def test_is_active_can_be_false(self, inactive_company):
        assert inactive_company.is_active is False

    def test_slug_field_is_unique(self, company, db):
        with pytest.raises(IntegrityError):
            Company.objects.create(name="Totally Different Name", slug=company.slug)

    def test_created_at_is_set_automatically(self, company):
        assert company.created_at is not None

    def test_updated_at_is_set_automatically(self, company):
        assert company.updated_at is not None

    def test_str_returns_name(self, company):
        assert str(company) == "Zignature Tech"

    def test_meta_ordering_is_by_name(self, db):
        Company.objects.create(name="Zebra Ltd")
        Company.objects.create(name="Alpha Inc")
        Company.objects.create(name="Midway Co")
        names = list(Company.objects.values_list("name", flat=True))
        assert names == sorted(names)

    def test_optional_fields_default_to_blank(self, db):
        c = Company.objects.create(name="Minimal Corp")
        assert c.logo.name == "" or not c.logo
        assert c.website == ""
        assert c.description == ""
        assert c.location == ""


# ---------------------------------------------------------------------------
# Company — Slug Auto-Generation
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestCompanySlugGeneration:
    def test_slug_auto_generated_from_name(self, db):
        c = Company.objects.create(name="Test Corp")
        assert c.slug == "test-corp"

    def test_slug_lowercased(self, db):
        c = Company.objects.create(name="UPPER CASE COMPANY")
        assert c.slug == "upper-case-company"

    def test_slug_strips_special_characters(self, db):
        c = Company.objects.create(name="Acme & Sons! Ltd.")
        assert c.slug == "acme-sons-ltd"

    def test_slug_handles_unicode_name(self, db):
        c = Company.objects.create(name="Café Solutions")
        # slugify strips accents; result should be a non-empty slug
        assert c.slug != ""
        assert " " not in c.slug

    def test_explicit_slug_is_respected(self, db):
        c = Company.objects.create(name="Some Company", slug="my-custom-slug")
        assert c.slug == "my-custom-slug"

    def test_re_save_does_not_overwrite_existing_slug(self, company):
        original_slug = company.slug
        company.location = "Mumbai"
        company.save()
        company.refresh_from_db()
        assert company.slug == original_slug

    def test_slug_collision_appends_numeric_suffix(self, db):
        c1 = Company.objects.create(name="Acme Corp")
        c2 = Company.objects.create(name="Acme Corp 2")
        # Force same base slug by using explicit name that produces same slug
        c3 = Company.objects.create(name="Acme Corp 3")
        assert c1.slug == "acme-corp"
        assert c2.slug.startswith("acme-corp")
        assert c3.slug.startswith("acme-corp")
        # All slugs must be distinct
        assert len({c1.slug, c2.slug, c3.slug}) == 3

    def test_slug_collision_direct(self, db):
        """
        Two companies whose names produce the same base slug.
        The second one should get a -2 suffix.
        """
        c1 = Company.objects.create(name="Foo Bar")
        # Manually set same base slug scenario via collision
        c2 = Company.objects.create(name="Foo  Bar")  # extra space → same slug
        assert c1.slug == "foo-bar"
        assert c2.slug == "foo-bar-2"

    def test_slug_max_length_field_constraint(self):
        field = Company._meta.get_field("slug")
        assert field.max_length == 170

    def test_very_long_company_name_generates_slug(self, db):
        long_name = "A" * 140
        c = Company.objects.create(name=long_name)
        assert c.slug != ""
        assert len(c.slug) <= 170


# ---------------------------------------------------------------------------
# JobListing — Model Fields & Creation
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestJobListingModel:
    def test_creates_job_listing_successfully(self, job):
        assert JobListing.objects.filter(pk=job.pk).exists()

    def test_primary_key_is_uuid(self, job):
        assert isinstance(job.id, uuid.UUID)

    def test_primary_key_is_not_editable(self):
        field = JobListing._meta.get_field("id")
        assert field.editable is False

    def test_company_foreign_key(self, job, company):
        assert job.company == company

    def test_is_active_defaults_to_true(self, job):
        assert job.is_active is True

    def test_deadline_nullable(self, db, company):
        j = JobListing.objects.create(
            company=company,
            title="No Deadline Job",
            description="Open-ended.",
            job_type=JobListing.JobType.REMOTE,
            experience_level=JobListing.ExperienceLevel.JUNIOR,
        )
        assert j.deadline is None

    def test_created_at_is_set_automatically(self, job):
        assert job.created_at is not None

    def test_updated_at_is_set_automatically(self, job):
        assert job.updated_at is not None

    def test_str_includes_title_and_company_name(self, job, company):
        assert "Backend Developer" in str(job)
        assert "Zignature Tech" in str(job)

    def test_meta_ordering_newest_first(self, db, company):
        j1 = JobListing.objects.create(
            company=company,
            title="First Job",
            description="d",
            job_type=JobListing.JobType.FULL_TIME,
            experience_level=JobListing.ExperienceLevel.JUNIOR,
        )
        j2 = JobListing.objects.create(
            company=company,
            title="Second Job",
            description="d",
            job_type=JobListing.JobType.FULL_TIME,
            experience_level=JobListing.ExperienceLevel.JUNIOR,
        )
        listings = list(JobListing.objects.all())
        # Newest first — j2 should appear before j1
        assert listings[0].pk == j2.pk
        assert listings[1].pk == j1.pk

    def test_requirements_optional(self, job):
        assert job.requirements == ""

    def test_location_optional(self, db, company):
        j = JobListing.objects.create(
            company=company,
            title="No Location Job",
            description="Remote only.",
            job_type=JobListing.JobType.REMOTE,
            experience_level=JobListing.ExperienceLevel.MID,
        )
        assert j.location == ""


# ---------------------------------------------------------------------------
# JobListing — Slug Auto-Generation
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestJobListingSlugGeneration:
    def test_slug_auto_generated_from_title(self, job):
        assert job.slug == "backend-developer"

    def test_slug_lowercased(self, db, company):
        j = JobListing.objects.create(
            company=company,
            title="SENIOR ENGINEER",
            description="d",
            job_type=JobListing.JobType.FULL_TIME,
            experience_level=JobListing.ExperienceLevel.SENIOR,
        )
        assert j.slug == "senior-engineer"

    def test_explicit_slug_is_respected(self, db, company):
        j = JobListing.objects.create(
            company=company,
            title="React Developer",
            slug="custom-react-dev",
            description="d",
            job_type=JobListing.JobType.FULL_TIME,
            experience_level=JobListing.ExperienceLevel.MID,
        )
        assert j.slug == "custom-react-dev"

    def test_re_save_does_not_overwrite_existing_slug(self, job):
        original_slug = job.slug
        job.location = "Bangalore"
        job.save()
        job.refresh_from_db()
        assert job.slug == original_slug

    def test_slug_collision_appends_numeric_suffix(self, db, company):
        j1 = JobListing.objects.create(
            company=company,
            title="Software Engineer",
            description="d",
            job_type=JobListing.JobType.FULL_TIME,
            experience_level=JobListing.ExperienceLevel.MID,
        )
        j2 = JobListing.objects.create(
            company=company,
            title="Software  Engineer",  # extra space → same slug
            description="d",
            job_type=JobListing.JobType.FULL_TIME,
            experience_level=JobListing.ExperienceLevel.MID,
        )
        assert j1.slug == "software-engineer"
        assert j2.slug == "software-engineer-2"

    def test_multiple_slug_collisions(self, db, company):
        titles = ["Data Analyst", "Data  Analyst", "Data   Analyst"]
        jobs = []
        for title in titles:
            j = JobListing.objects.create(
                company=company,
                title=title,
                description="d",
                job_type=JobListing.JobType.FULL_TIME,
                experience_level=JobListing.ExperienceLevel.JUNIOR,
            )
            jobs.append(j)
        slugs = [j.slug for j in jobs]
        # All must be unique
        assert len(set(slugs)) == 3
        assert jobs[0].slug == "data-analyst"
        assert jobs[1].slug == "data-analyst-2"
        assert jobs[2].slug == "data-analyst-3"

    def test_slug_unique_constraint_enforced(self, job, db, company):
        with pytest.raises(IntegrityError):
            JobListing.objects.create(
                company=company,
                title="Different Title",
                slug=job.slug,
                description="d",
                job_type=JobListing.JobType.FULL_TIME,
                experience_level=JobListing.ExperienceLevel.MID,
            )

    def test_slug_max_length_field_constraint(self):
        field = JobListing._meta.get_field("slug")
        assert field.max_length == 220


# ---------------------------------------------------------------------------
# JobListing — Choices
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestJobListingChoices:
    def test_job_type_choices(self):
        expected = {"full_time", "part_time", "contract", "remote"}
        actual = {choice[0] for choice in JobListing.JobType.choices}
        assert actual == expected

    def test_experience_level_choices(self):
        expected = {"junior", "mid", "senior", "lead"}
        actual = {choice[0] for choice in JobListing.ExperienceLevel.choices}
        assert actual == expected

    @pytest.mark.parametrize(
        "job_type",
        [
            JobListing.JobType.FULL_TIME,
            JobListing.JobType.PART_TIME,
            JobListing.JobType.CONTRACT,
            JobListing.JobType.REMOTE,
        ],
    )
    def test_all_job_types_can_be_saved(self, db, company, job_type):
        j = JobListing.objects.create(
            company=company,
            title=f"Job {job_type}",
            description="d",
            job_type=job_type,
            experience_level=JobListing.ExperienceLevel.MID,
        )
        j.refresh_from_db()
        assert j.job_type == job_type

    @pytest.mark.parametrize(
        "exp_level",
        [
            JobListing.ExperienceLevel.JUNIOR,
            JobListing.ExperienceLevel.MID,
            JobListing.ExperienceLevel.SENIOR,
            JobListing.ExperienceLevel.LEAD,
        ],
    )
    def test_all_experience_levels_can_be_saved(self, db, company, exp_level):
        j = JobListing.objects.create(
            company=company,
            title=f"Level {exp_level}",
            description="d",
            job_type=JobListing.JobType.FULL_TIME,
            experience_level=exp_level,
        )
        j.refresh_from_db()
        assert j.experience_level == exp_level


# ---------------------------------------------------------------------------
# Company ↔ JobListing Relationship
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestCompanyJobListingRelationship:
    def test_company_has_related_job_listings(self, company, job):
        assert company.job_listings.count() == 1
        assert company.job_listings.first() == job

    def test_related_name_is_job_listings(self, company, job):
        assert hasattr(company, "job_listings")

    def test_cascade_delete_removes_job_listings(self, company, job, db):
        job_id = job.id
        company.delete()
        assert not JobListing.objects.filter(pk=job_id).exists()

    def test_multiple_jobs_per_company(self, db, company):
        for i in range(5):
            JobListing.objects.create(
                company=company,
                title=f"Role {i}",
                description="d",
                job_type=JobListing.JobType.FULL_TIME,
                experience_level=JobListing.ExperienceLevel.MID,
            )
        assert company.job_listings.count() == 5

    def test_job_belongs_to_correct_company(self, job, company):
        assert job.company_id == company.id

    def test_jobs_from_different_companies(self, db, company, inactive_company):
        j1 = JobListing.objects.create(
            company=company,
            title="Job at Active Co",
            description="d",
            job_type=JobListing.JobType.FULL_TIME,
            experience_level=JobListing.ExperienceLevel.SENIOR,
        )
        j2 = JobListing.objects.create(
            company=inactive_company,
            title="Job at Inactive Co",
            description="d",
            job_type=JobListing.JobType.CONTRACT,
            experience_level=JobListing.ExperienceLevel.JUNIOR,
        )
        assert j1.company != j2.company
        assert JobListing.objects.count() == 2


# ---------------------------------------------------------------------------
# Database Index Verification
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestDatabaseIndexes:
    """
    Verifies that db_index=True is set on the fields specified in system.md §5.6.
    Does not test the underlying PostgreSQL index — that is validated via
    `docker compose exec db psql ... \\d careers_company`.
    """

    def test_company_is_active_has_db_index(self):
        field = Company._meta.get_field("is_active")
        assert field.db_index is True

    def test_joblisting_is_active_has_db_index(self):
        field = JobListing._meta.get_field("is_active")
        assert field.db_index is True

    def test_joblisting_job_type_has_db_index(self):
        field = JobListing._meta.get_field("job_type")
        assert field.db_index is True

    def test_joblisting_experience_level_has_db_index(self):
        field = JobListing._meta.get_field("experience_level")
        assert field.db_index is True

    def test_company_slug_is_unique(self):
        field = Company._meta.get_field("slug")
        assert field.unique is True

    def test_joblisting_slug_is_unique(self):
        field = JobListing._meta.get_field("slug")
        assert field.unique is True

    def test_company_name_is_unique(self):
        field = Company._meta.get_field("name")
        assert field.unique is True

    def test_company_id_is_primary_key(self):
        field = Company._meta.get_field("id")
        assert field.primary_key is True

    def test_joblisting_id_is_primary_key(self):
        field = JobListing._meta.get_field("id")
        assert field.primary_key is True


# ---------------------------------------------------------------------------
# Queryset Filtering (simulates API query patterns from system.md §6.3)
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestQueryPatterns:
    """Validates the filter patterns the API will rely on (system.md §6.3)."""

    def test_filter_active_companies(self, company, inactive_company):
        active = Company.objects.filter(is_active=True)
        assert company in active
        assert inactive_company not in active

    def test_filter_active_job_listings(self, db, company):
        active_job = JobListing.objects.create(
            company=company,
            title="Active Role",
            description="d",
            job_type=JobListing.JobType.FULL_TIME,
            experience_level=JobListing.ExperienceLevel.MID,
            is_active=True,
        )
        inactive_job = JobListing.objects.create(
            company=company,
            title="Inactive Role",
            description="d",
            job_type=JobListing.JobType.FULL_TIME,
            experience_level=JobListing.ExperienceLevel.MID,
            is_active=False,
        )
        active = JobListing.objects.filter(is_active=True)
        assert active_job in active
        assert inactive_job not in active

    def test_filter_by_job_type(self, db, company):
        remote_job = JobListing.objects.create(
            company=company,
            title="Remote Role",
            description="d",
            job_type=JobListing.JobType.REMOTE,
            experience_level=JobListing.ExperienceLevel.MID,
        )
        office_job = JobListing.objects.create(
            company=company,
            title="Office Role",
            description="d",
            job_type=JobListing.JobType.FULL_TIME,
            experience_level=JobListing.ExperienceLevel.MID,
        )
        remote_qs = JobListing.objects.filter(job_type=JobListing.JobType.REMOTE)
        assert remote_job in remote_qs
        assert office_job not in remote_qs

    def test_filter_by_experience_level(self, db, company):
        senior_job = JobListing.objects.create(
            company=company,
            title="Senior Role",
            description="d",
            job_type=JobListing.JobType.FULL_TIME,
            experience_level=JobListing.ExperienceLevel.SENIOR,
        )
        junior_job = JobListing.objects.create(
            company=company,
            title="Junior Role",
            description="d",
            job_type=JobListing.JobType.FULL_TIME,
            experience_level=JobListing.ExperienceLevel.JUNIOR,
        )
        senior_qs = JobListing.objects.filter(
            experience_level=JobListing.ExperienceLevel.SENIOR
        )
        assert senior_job in senior_qs
        assert junior_job not in senior_qs

    def test_filter_by_company_slug(self, db, company, job):
        results = JobListing.objects.filter(company__slug=company.slug)
        assert job in results

    def test_get_company_by_slug(self, company):
        found = Company.objects.get(slug=company.slug)
        assert found == company

    def test_get_job_by_slug(self, job):
        found = JobListing.objects.get(slug=job.slug)
        assert found == job
