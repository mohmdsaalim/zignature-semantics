from django.contrib import admin

from .models import Company, JobListing


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    """
    Admin configuration for Company model.
    Ref: system.md §10.2
    """

    list_display = ("name", "location", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name", "location")
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ("id", "created_at", "updated_at")
    ordering = ("name",)

    fieldsets = (
        (
            None,
            {
                "fields": ("id", "name", "slug", "logo", "website"),
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


@admin.register(JobListing)
class JobListingAdmin(admin.ModelAdmin):
    """
    Admin configuration for JobListing model.
    Ref: system.md §10.2
    """

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
    prepopulated_fields = {"slug": ("title",)}
    raw_id_fields = ("company",)
    date_hierarchy = "created_at"
    readonly_fields = ("id", "created_at", "updated_at")
    ordering = ("-created_at",)

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
            "Metadata",
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
