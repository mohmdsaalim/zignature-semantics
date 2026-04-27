from django.contrib import admin
from django.utils.html import format_html

from .models import Company, JobListing


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    """
    Admin configuration for Company model.

    Staff permissions (non-superuser):
      - Can view and change companies
      - Cannot delete companies (superuser only)

    Ref: system.md §10.2
    """

    # ------------------------------------------------------------------ #
    # List view
    # ------------------------------------------------------------------ #
    list_display = ("name", "location", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name", "location")
    ordering = ("name",)

    # ------------------------------------------------------------------ #
    # Detail view
    # ------------------------------------------------------------------ #
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ("id", "created_at", "updated_at", "logo_preview")

    fieldsets = (
        (
            None,
            {
                "fields": ("id", "name", "slug"),
            },
        ),
        (
            "Branding & Contact",
            {
                "fields": ("logo", "logo_preview", "website"),
            },
        ),
        (
            "Details",
            {
                "fields": ("description", "location", "is_active"),
            },
        ),
        (
            "Timestamps",
            {
                "fields": ("created_at", "updated_at"),
                "classes": ("collapse",),
            },
        ),
    )

    # ------------------------------------------------------------------ #
    # Custom display methods
    # ------------------------------------------------------------------ #
    @admin.display(description="Logo Preview")
    def logo_preview(self, obj):
        if obj.logo:
            return format_html(
                '<img src="{}" style="max-height:60px; max-width:120px; '
                'object-fit:contain; border-radius:4px;" />',
                obj.logo.url,
            )
        return "—"


@admin.register(JobListing)
class JobListingAdmin(admin.ModelAdmin):
    """
    Admin configuration for JobListing model.

    Staff can view, add and change job listings.
    list_filter lets staff quickly toggle active/inactive listings and
    narrow by type/level — critical for day-to-day content management.

    Ref: system.md §10.2
    """

    # ------------------------------------------------------------------ #
    # List view
    # ------------------------------------------------------------------ #
    list_display = (
        "title",
        "company",
        "job_type",
        "experience_level",
        "is_active",
        "deadline",
    )
    list_filter = ("job_type", "experience_level", "is_active", "company")
    search_fields = ("title", "company__name", "location")
    ordering = ("-created_at",)
    date_hierarchy = "created_at"

    # ------------------------------------------------------------------ #
    # Detail view
    # ------------------------------------------------------------------ #
    prepopulated_fields = {"slug": ("title",)}
    raw_id_fields = ("company",)
    readonly_fields = ("id", "created_at", "updated_at")

    fieldsets = (
        (
            None,
            {
                "fields": ("id", "company", "title", "slug"),
            },
        ),
        (
            "Content",
            {
                "fields": ("description", "requirements"),
            },
        ),
        (
            "Classification",
            {
                "fields": (
                    "location",
                    "job_type",
                    "experience_level",
                    "is_active",
                    "deadline",
                ),
            },
        ),
        (
            "Timestamps",
            {
                "fields": ("created_at", "updated_at"),
                "classes": ("collapse",),
            },
        ),
    )
