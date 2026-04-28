"""
Management command: create_staff_group

Creates (or updates) the 'staff' Group with the restricted permission set
defined in system.md §10.3:

  - view_company, change_company
  - add_joblisting, change_joblisting, view_joblisting
  - view_profile

Regular staff members: can manage Companies and JobListings, view Profiles.
They CANNOT manage Users or grant permissions.

Usage:
    docker compose exec backend uv run python manage.py create_staff_group

Run this once after initial deploy and after any permission changes.
Idempotent — safe to run multiple times.
"""

from django.contrib.auth.models import Group, Permission
from django.core.management.base import BaseCommand

STAFF_PERMISSIONS = [
    # Companies — staff can view and change, NOT delete
    "view_company",
    "change_company",
    # Job Listings — staff can fully manage listings
    "add_joblisting",
    "change_joblisting",
    "view_joblisting",
    # Profiles — staff can only view, not edit
    "view_profile",
]


class Command(BaseCommand):
    help = (
        "Creates or updates the 'staff' Group with restricted permissions "
        "as defined in system.md §10.3."
    )

    def handle(self, *args, **options):
        group, created = Group.objects.get_or_create(name="staff")
        action = "Created" if created else "Updated"

        permissions = Permission.objects.filter(codename__in=STAFF_PERMISSIONS)
        found_codenames = set(permissions.values_list("codename", flat=True))
        missing = set(STAFF_PERMISSIONS) - found_codenames

        if missing:
            self.stdout.write(
                self.style.WARNING(
                    f"⚠️  Some permissions not found (run migrations first): "
                    f"{', '.join(sorted(missing))}"
                )
            )

        group.permissions.set(permissions)

        self.stdout.write(
            self.style.SUCCESS(
                f"✅ {action} 'staff' group with "
                f"{permissions.count()} permissions: "
                f"{', '.join(sorted(found_codenames))}"
            )
        )
