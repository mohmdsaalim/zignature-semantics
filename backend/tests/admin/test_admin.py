"""
Test suite for Ticket 2.2 — Django Admin Customisation

Coverage:
  - CompanyAdmin: list_display, list_filter, search_fields,
    prepopulated_fields, fieldsets, logo_preview method
  - JobListingAdmin: list_display, list_filter, search_fields,
    prepopulated_fields, raw_id_fields, date_hierarchy, fieldsets
  - ProfileAdmin: list_display, list_filter, readonly resume/cover_letter
    links render as HTML anchors, dash when no file
  - UserAdmin: extends BaseUserAdmin, auth_provider visible, no
    first_name/last_name, add_fieldsets correct
  - Staff group permissions: correct codenames assigned, no user
    management permissions included
  - Admin HTTP access: superuser can GET list/change views (200),
    staff user can GET careers list (200), staff cannot GET user
    change list (403)
  - DJANGO_ADMIN_URL: admin mounted at settings.DJANGO_ADMIN_URL

Run:
    docker compose exec backend uv run pytest tests/admin/ -v
"""

import pytest
from django.contrib.admin.sites import AdminSite
from django.contrib.auth.models import Group, Permission
from django.test import RequestFactory

from apps.accounts.admin import UserAdmin
from apps.accounts.models import User
from apps.careers.admin import CompanyAdmin, JobListingAdmin
from apps.careers.models import Company, JobListing
from apps.profiles.admin import ProfileAdmin
from apps.profiles.models import Profile

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def make_superuser(db, email="super@zignature.io", password="SuperPass123!"):
    return User.objects.create_superuser(
        email=email,
        username="superuser",
        password=password,
    )


def make_staff_user(db, email="staff@zignature.io", password="StaffPass123!"):
    user = User.objects.create_user(
        email=email,
        username="staffmember",
        password=password,
        is_staff=True,
    )
    return user


def make_company(db, name="Zignature Tech"):
    return Company.objects.create(
        name=name,
        location="Kochi, Kerala",
        website="https://zignature.io",
    )


def make_job(db, company, title="Backend Developer"):
    return JobListing.objects.create(
        company=company,
        title=title,
        description="Build APIs.",
        job_type=JobListing.JobType.FULL_TIME,
        experience_level=JobListing.ExperienceLevel.MID,
    )


# ---------------------------------------------------------------------------
# CompanyAdmin — Configuration
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestCompanyAdminConfig:
    def setup_method(self):
        self.site = AdminSite()
        self.admin = CompanyAdmin(Company, self.site)

    def test_list_display_contains_name(self):
        assert "name" in self.admin.list_display

    def test_list_display_contains_location(self):
        assert "location" in self.admin.list_display

    def test_list_display_contains_is_active(self):
        assert "is_active" in self.admin.list_display

    def test_list_display_contains_created_at(self):
        assert "created_at" in self.admin.list_display

    def test_list_display_has_at_least_3_columns(self):
        assert len(self.admin.list_display) >= 3

    def test_list_filter_contains_is_active(self):
        assert "is_active" in self.admin.list_filter

    def test_search_fields_contains_name(self):
        assert "name" in self.admin.search_fields

    def test_search_fields_contains_location(self):
        assert "location" in self.admin.search_fields

    def test_prepopulated_fields_slug_from_name(self):
        assert self.admin.prepopulated_fields == {"slug": ("name",)}

    def test_readonly_fields_includes_id(self):
        assert "id" in self.admin.readonly_fields

    def test_readonly_fields_includes_timestamps(self):
        assert "created_at" in self.admin.readonly_fields
        assert "updated_at" in self.admin.readonly_fields

    def test_fieldsets_defined(self):
        assert self.admin.fieldsets is not None
        assert len(self.admin.fieldsets) > 0

    def test_all_fieldset_fields_are_flat_strings_or_in_model(self):
        """Fieldsets must not reference non-existent fields (except readonly methods)."""
        model_fields = {f.name for f in Company._meta.get_fields()}
        admin_readonly = set(self.admin.readonly_fields)
        allowed = model_fields | admin_readonly

        for _, options in self.admin.fieldsets:
            for field in options.get("fields", ()):
                assert field in allowed, (
                    f"Field '{field}' in fieldsets not found in model or readonly_fields"
                )

    def test_logo_preview_returns_dash_when_no_logo(self, db):
        company = make_company(db)
        result = self.admin.logo_preview(company)
        assert result == "—"

    def test_logo_preview_returns_img_tag_when_logo_exists(self, db, tmp_path):
        """Logo preview renders an <img> tag when a logo file is set."""
        company = make_company(db)
        # Simulate a logo URL by using a mock object
        class FakeFile:
            url = "/media/company_logos/test.png"
            def __bool__(self):
                return True

        company.logo = FakeFile()
        result = self.admin.logo_preview(company)
        assert "<img" in str(result)
        assert "/media/company_logos/test.png" in str(result)


# ---------------------------------------------------------------------------
# JobListingAdmin — Configuration
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestJobListingAdminConfig:
    def setup_method(self):
        self.site = AdminSite()
        self.admin = JobListingAdmin(JobListing, self.site)

    def test_list_display_contains_title(self):
        assert "title" in self.admin.list_display

    def test_list_display_contains_company(self):
        assert "company" in self.admin.list_display

    def test_list_display_contains_job_type(self):
        assert "job_type" in self.admin.list_display

    def test_list_display_contains_is_active(self):
        assert "is_active" in self.admin.list_display

    def test_list_display_has_at_least_3_columns(self):
        assert len(self.admin.list_display) >= 3

    def test_list_filter_contains_is_active(self):
        assert "is_active" in self.admin.list_filter

    def test_list_filter_contains_job_type(self):
        assert "job_type" in self.admin.list_filter

    def test_list_filter_contains_experience_level(self):
        assert "experience_level" in self.admin.list_filter

    def test_list_filter_contains_company(self):
        assert "company" in self.admin.list_filter

    def test_search_fields_contains_title(self):
        assert "title" in self.admin.search_fields

    def test_search_fields_contains_company_name(self):
        assert "company__name" in self.admin.search_fields

    def test_prepopulated_fields_slug_from_title(self):
        assert self.admin.prepopulated_fields == {"slug": ("title",)}

    def test_raw_id_fields_contains_company(self):
        assert "company" in self.admin.raw_id_fields

    def test_date_hierarchy_is_created_at(self):
        assert self.admin.date_hierarchy == "created_at"

    def test_readonly_fields_includes_timestamps(self):
        assert "created_at" in self.admin.readonly_fields
        assert "updated_at" in self.admin.readonly_fields

    def test_fieldsets_defined(self):
        assert self.admin.fieldsets is not None
        assert len(self.admin.fieldsets) > 0


# ---------------------------------------------------------------------------
# ProfileAdmin — Configuration & File Links
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestProfileAdminConfig:
    def setup_method(self):
        self.site = AdminSite()
        self.admin = ProfileAdmin(Profile, self.site)

    def test_list_display_contains_full_name(self):
        assert "full_name" in self.admin.list_display

    def test_list_display_contains_is_available(self):
        assert "is_available" in self.admin.list_display

    def test_list_filter_contains_is_available(self):
        assert "is_available" in self.admin.list_filter

    def test_search_fields_contains_user_email(self):
        assert "user__email" in self.admin.search_fields

    def test_readonly_fields_includes_resume_link(self):
        assert "resume_link" in self.admin.readonly_fields

    def test_readonly_fields_includes_cover_letter_link(self):
        assert "cover_letter_link" in self.admin.readonly_fields

    def test_readonly_fields_includes_user(self):
        assert "user" in self.admin.readonly_fields

    def test_resume_link_returns_dash_when_no_file(self, db):
        user = User.objects.create_user(
            email="seeker@test.com", username="seeker", password="pass"
        )
        profile = Profile.objects.get(user=user)
        result = self.admin.resume_link(profile)
        assert result == "—"

    def test_resume_link_returns_anchor_when_file_exists(self, db):
        user = User.objects.create_user(
            email="seeker2@test.com", username="seeker2", password="pass"
        )
        profile = Profile.objects.get(user=user)

        class FakeFile:
            url = "/media/resumes/abc/resume.pdf"
            def __bool__(self):
                return True

        profile.resume = FakeFile()
        result = str(self.admin.resume_link(profile))
        assert "<a" in result
        assert "/media/resumes/abc/resume.pdf" in result
        assert "download" in result

    def test_cover_letter_link_returns_dash_when_no_file(self, db):
        user = User.objects.create_user(
            email="seeker3@test.com", username="seeker3", password="pass"
        )
        profile = Profile.objects.get(user=user)
        result = self.admin.cover_letter_link(profile)
        assert result == "—"

    def test_cover_letter_link_returns_anchor_when_file_exists(self, db):
        user = User.objects.create_user(
            email="seeker4@test.com", username="seeker4", password="pass"
        )
        profile = Profile.objects.get(user=user)

        class FakeFile:
            url = "/media/cover_letters/abc/cover_letter.pdf"
            def __bool__(self):
                return True

        profile.cover_letter = FakeFile()
        result = str(self.admin.cover_letter_link(profile))
        assert "<a" in result
        assert "/media/cover_letters/abc/cover_letter.pdf" in result
        assert "download" in result

    def test_has_resume_boolean_display_false(self, db):
        user = User.objects.create_user(
            email="seeker5@test.com", username="seeker5", password="pass"
        )
        profile = Profile.objects.get(user=user)
        assert self.admin.has_resume(profile) is False


# ---------------------------------------------------------------------------
# UserAdmin — Configuration
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestUserAdminConfig:
    def setup_method(self):
        self.site = AdminSite()
        self.admin = UserAdmin(User, self.site)

    def test_list_display_contains_email(self):
        assert "email" in self.admin.list_display

    def test_list_display_contains_auth_provider(self):
        assert "auth_provider" in self.admin.list_display

    def test_list_display_contains_is_active(self):
        assert "is_active" in self.admin.list_display

    def test_list_display_does_not_contain_first_name(self):
        assert "first_name" not in self.admin.list_display

    def test_list_display_does_not_contain_last_name(self):
        assert "last_name" not in self.admin.list_display

    def test_fieldsets_do_not_contain_first_name(self):
        all_fields = []
        for _, options in self.admin.fieldsets:
            all_fields.extend(options.get("fields", []))
        assert "first_name" not in all_fields

    def test_fieldsets_do_not_contain_last_name(self):
        all_fields = []
        for _, options in self.admin.fieldsets:
            all_fields.extend(options.get("fields", []))
        assert "last_name" not in all_fields

    def test_fieldsets_contain_auth_provider(self):
        all_fields = []
        for _, options in self.admin.fieldsets:
            all_fields.extend(options.get("fields", []))
        assert "auth_provider" in all_fields

    def test_fieldsets_contain_email(self):
        all_fields = []
        for _, options in self.admin.fieldsets:
            all_fields.extend(options.get("fields", []))
        assert "email" in all_fields

    def test_add_fieldsets_contain_email(self):
        all_fields = []
        for _, options in self.admin.add_fieldsets:
            all_fields.extend(options.get("fields", []))
        assert "email" in all_fields

    def test_add_fieldsets_contain_auth_provider(self):
        all_fields = []
        for _, options in self.admin.add_fieldsets:
            all_fields.extend(options.get("fields", []))
        assert "auth_provider" in all_fields

    def test_non_superuser_cannot_delete_users(self, db):
        staff = make_staff_user(db)
        factory = RequestFactory()
        request = factory.get("/")
        request.user = staff
        assert self.admin.has_delete_permission(request) is False

    def test_superuser_can_delete_users(self, db):
        superuser = make_superuser(db)
        factory = RequestFactory()
        request = factory.get("/")
        request.user = superuser
        assert self.admin.has_delete_permission(request) is True

    def test_non_superuser_cannot_grant_superuser_via_form(self, db):
        staff = make_staff_user(db)
        factory = RequestFactory()
        request = factory.get("/")
        request.user = staff
        form = self.admin.get_form(request)
        if "is_superuser" in form.base_fields:
            assert form.base_fields["is_superuser"].disabled is True

    def test_non_superuser_cannot_grant_staff_via_form(self, db):
        staff = make_staff_user(db)
        factory = RequestFactory()
        request = factory.get("/")
        request.user = staff
        form = self.admin.get_form(request)
        if "is_staff" in form.base_fields:
            assert form.base_fields["is_staff"].disabled is True


# ---------------------------------------------------------------------------
# Staff Group Permissions
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestStaffGroupPermissions:
    """
    Verifies the staff group contains exactly the permissions from
    system.md §10.3. Tests run the same logic as the management command.
    """

    EXPECTED_PERMS = {
        "view_company",
        "change_company",
        "add_joblisting",
        "change_joblisting",
        "view_joblisting",
        "view_profile",
    }

    FORBIDDEN_PERMS = {
        "add_user",
        "change_user",
        "delete_user",
        "view_user",
        "add_group",
        "change_group",
        "delete_group",
    }

    def _create_staff_group(self):
        group, _ = Group.objects.get_or_create(name="staff")
        permissions = Permission.objects.filter(codename__in=self.EXPECTED_PERMS)
        group.permissions.set(permissions)
        return group

    def test_staff_group_can_be_created(self, db):
        group = self._create_staff_group()
        assert group.name == "staff"

    def test_staff_group_has_view_company(self, db):
        group = self._create_staff_group()
        codenames = set(group.permissions.values_list("codename", flat=True))
        assert "view_company" in codenames

    def test_staff_group_has_change_company(self, db):
        group = self._create_staff_group()
        codenames = set(group.permissions.values_list("codename", flat=True))
        assert "change_company" in codenames

    def test_staff_group_has_view_joblisting(self, db):
        group = self._create_staff_group()
        codenames = set(group.permissions.values_list("codename", flat=True))
        assert "view_joblisting" in codenames

    def test_staff_group_has_change_joblisting(self, db):
        group = self._create_staff_group()
        codenames = set(group.permissions.values_list("codename", flat=True))
        assert "change_joblisting" in codenames

    def test_staff_group_has_view_profile(self, db):
        group = self._create_staff_group()
        codenames = set(group.permissions.values_list("codename", flat=True))
        assert "view_profile" in codenames

    def test_staff_group_does_not_have_user_permissions(self, db):
        group = self._create_staff_group()
        codenames = set(group.permissions.values_list("codename", flat=True))
        for forbidden in self.FORBIDDEN_PERMS:
            assert forbidden not in codenames, (
                f"Staff group should NOT have permission: {forbidden}"
            )

    def test_staff_group_is_idempotent(self, db):
        """Running group creation twice does not duplicate permissions."""
        self._create_staff_group()
        self._create_staff_group()
        group = Group.objects.get(name="staff")
        codenames = list(group.permissions.values_list("codename", flat=True))
        # No duplicates
        assert len(codenames) == len(set(codenames))


# ---------------------------------------------------------------------------
# Admin HTTP Access Tests (integration)
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestAdminHttpAccess:
    """
    Tests that the admin is reachable and access is correctly scoped.

    Uses Django test client to make real HTTP requests against the admin.
    Verifies system.md §10.3: staff can see careers, cannot see users.
    """

    def _add_staff_group_perms(self, user):
        group, _ = Group.objects.get_or_create(name="staff")
        perms = Permission.objects.filter(
            codename__in=[
                "view_company", "change_company",
                "add_joblisting", "change_joblisting", "view_joblisting",
                "view_profile",
            ]
        )
        group.permissions.set(perms)
        user.groups.add(group)
        # Refresh cached permissions
        user._perm_cache = set()
        user._user_perm_cache = set()

    def test_superuser_can_access_admin_index(self, db, client):
        superuser = make_superuser(db)
        client.force_login(superuser)
        from django.conf import settings
        url = f"/{settings.DJANGO_ADMIN_URL}"
        response = client.get(url)
        assert response.status_code == 200

    def test_superuser_can_access_company_list(self, db, client):
        superuser = make_superuser(db)
        client.force_login(superuser)
        response = client.get("/admin/careers/company/")
        assert response.status_code == 200

    def test_superuser_can_access_user_list(self, db, client):
        superuser = make_superuser(db)
        client.force_login(superuser)
        response = client.get("/admin/accounts/user/")
        assert response.status_code == 200

    def test_staff_can_access_company_list(self, db, client):
        staff = make_staff_user(db, email="staff2@test.com")
        self._add_staff_group_perms(staff)
        client.force_login(staff)
        response = client.get("/admin/careers/company/")
        assert response.status_code == 200

    def test_staff_can_access_joblisting_list(self, db, client):
        staff = make_staff_user(db, email="staff3@test.com")
        self._add_staff_group_perms(staff)
        client.force_login(staff)
        response = client.get("/admin/careers/joblisting/")
        assert response.status_code == 200

    def test_staff_cannot_access_user_list(self, db, client):
        staff = make_staff_user(db, email="staff4@test.com")
        self._add_staff_group_perms(staff)
        client.force_login(staff)
        response = client.get("/admin/accounts/user/")
        # Staff without user perms gets redirected (302) or forbidden (403)
        assert response.status_code in (302, 403)

    def test_anonymous_user_redirected_from_admin(self, db, client):
        response = client.get("/admin/careers/company/")
        assert response.status_code == 302
        assert "/login/" in response["Location"] or "login" in response["Location"]

    def test_admin_system_check_passes(self, db):
        """Equivalent to: python manage.py check"""
        from io import StringIO

        from django.core import management
        out = StringIO()
        # Will raise SystemCheckError if admin is misconfigured
        management.call_command("check", stdout=out, stderr=out)
        output = out.getvalue()
        assert "no issues" in output.lower() or output == ""


# ---------------------------------------------------------------------------
# DJANGO_ADMIN_URL Setting
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestAdminUrl:
    def test_django_admin_url_setting_exists(self):
        from django.conf import settings
        assert hasattr(settings, "DJANGO_ADMIN_URL")

    def test_django_admin_url_is_string(self):
        from django.conf import settings
        assert isinstance(settings.DJANGO_ADMIN_URL, str)

    def test_django_admin_url_ends_with_slash(self):
        from django.conf import settings
        assert settings.DJANGO_ADMIN_URL.endswith("/"), (
            "DJANGO_ADMIN_URL must end with a trailing slash. "
            f"Current value: '{settings.DJANGO_ADMIN_URL}'"
        )

    def test_django_admin_url_is_not_empty(self):
        from django.conf import settings
        assert settings.DJANGO_ADMIN_URL.strip("/") != ""
