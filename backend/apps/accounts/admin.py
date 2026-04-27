from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Custom admin for the User model.

    Key differences from Django's default UserAdmin:
      - USERNAME_FIELD is email (not username)
      - first_name / last_name removed — not on the model (system.md §5.2)
      - auth_provider field visible in detail and list views
      - Superuser-only: creating/deleting staff accounts

    Ref: system.md §5.2, §10.2, §10.3
    """

    # ------------------------------------------------------------------ #
    # List view
    # ------------------------------------------------------------------ #
    list_display = (
        "email",
        "username",
        "auth_provider",
        "is_active",
        "is_staff",
        "created_at",
    )
    list_filter = ("is_active", "is_staff", "auth_provider")
    search_fields = ("email", "username")
    ordering = ("email",)

    # ------------------------------------------------------------------ #
    # Detail view — fieldsets
    # Django's BaseUserAdmin fieldsets reference first_name/last_name
    # and username as USERNAME_FIELD. We override completely.
    # ------------------------------------------------------------------ #
    fieldsets = (
        (
            None,
            {
                "fields": ("email", "username", "password"),
            },
        ),
        (
            _("Authentication"),
            {
                "fields": ("auth_provider",),
                "description": (
                    "Users with auth_provider=google cannot change "
                    "their password through the platform."
                ),
            },
        ),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (
            _("Important dates"),
            {
                "fields": ("created_at", "updated_at"),
                "classes": ("collapse",),
            },
        ),
    )

    # ------------------------------------------------------------------ #
    # Add user form fieldsets (the "+" page)
    # ------------------------------------------------------------------ #
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "username",
                    "auth_provider",
                    "password1",
                    "password2",
                    "is_active",
                    "is_staff",
                ),
            },
        ),
    )

    readonly_fields = ("created_at", "updated_at")

    # ------------------------------------------------------------------ #
    # Superuser-only restriction: only superusers can create/delete staff
    # Ref: system.md §10.3
    # ------------------------------------------------------------------ #
    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        # Non-superusers cannot grant superuser or staff status
        if not request.user.is_superuser:
            if "is_superuser" in form.base_fields:
                form.base_fields["is_superuser"].disabled = True
            if "is_staff" in form.base_fields:
                form.base_fields["is_staff"].disabled = True
            if "user_permissions" in form.base_fields:
                form.base_fields["user_permissions"].disabled = True
        return form
