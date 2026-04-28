from django.contrib import admin
from django.utils.html import format_html

from .models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Profile model.

    resume and cover_letter fields are rendered as clickable download links
    so staff can open / download files directly from the admin panel without
    needing to know the file path.

    Staff permissions (non-superuser):
      - view_profile only — cannot edit or delete user profiles.

    Ref: system.md §10.2
    """

    # ------------------------------------------------------------------ #
    # List view
    # ------------------------------------------------------------------ #
    list_display = (
        "get_email",
        "full_name",
        "is_available",
        "has_resume",
        "updated_at",
    )
    list_filter = ("is_available",)
    search_fields = ("user__email", "full_name", "phone")
    ordering = ("-updated_at",)

    # ------------------------------------------------------------------ #
    # Detail view
    # ------------------------------------------------------------------ #
    readonly_fields = (
        "id",
        "user",
        "created_at",
        "updated_at",
        "resume_link",      # clickable download link
        "cover_letter_link",  # clickable download link
    )

    fieldsets = (
        (
            None,
            {
                "fields": ("id", "user"),
            },
        ),
        (
            "Personal Information",
            {
                "fields": ("full_name", "phone", "location", "bio"),
            },
        ),
        (
            "Documents",
            {
                "description": (
                    "Files are served directly from the server. "
                    "Click the link to download."
                ),
                "fields": (
                    "resume",
                    "resume_link",
                    "cover_letter",
                    "cover_letter_link",
                ),
            },
        ),
        (
            "Online Presence",
            {
                "fields": ("linkedin_url", "portfolio_url"),
            },
        ),
        (
            "Availability",
            {
                "fields": ("is_available",),
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

    @admin.display(description="Email", ordering="user__email")
    def get_email(self, obj):
        return obj.user.email

    @admin.display(description="Resume?", boolean=True)
    def has_resume(self, obj):
        return bool(obj.resume)

    @admin.display(description="Resume Download")
    def resume_link(self, obj):
        """
        Renders the resume field as a clickable anchor tag with
        Content-Disposition:attachment so the browser downloads the file.
        Displays a dash when no file is uploaded.
        """
        if obj.resume:
            return format_html(
                '<a href="{}" target="_blank" download>'
                '📄 Download Resume</a>',
                obj.resume.url,
            )
        return "—"

    @admin.display(description="Cover Letter Download")
    def cover_letter_link(self, obj):
        """
        Renders the cover_letter field as a clickable anchor tag.
        Displays a dash when no file is uploaded.
        """
        if obj.cover_letter:
            return format_html(
                '<a href="{}" target="_blank" download>'
                '📄 Download Cover Letter</a>',
                obj.cover_letter.url,
            )
        return "—"
