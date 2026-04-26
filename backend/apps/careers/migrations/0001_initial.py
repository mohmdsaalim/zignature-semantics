import uuid

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Company",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("name", models.CharField(max_length=150, unique=True)),
                ("slug", models.SlugField(blank=True, max_length=170, unique=True)),
                ("logo", models.ImageField(blank=True, upload_to="company_logos/")),
                ("website", models.URLField(blank=True)),
                ("description", models.TextField(blank=True)),
                ("location", models.CharField(blank=True, max_length=100)),
                ("is_active", models.BooleanField(db_index=True, default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name": "Company",
                "verbose_name_plural": "Companies",
                "ordering": ["name"],
            },
        ),
        migrations.CreateModel(
            name="JobListing",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("title", models.CharField(max_length=200)),
                ("slug", models.SlugField(blank=True, max_length=220, unique=True)),
                ("description", models.TextField()),
                ("requirements", models.TextField(blank=True)),
                ("location", models.CharField(blank=True, max_length=100)),
                (
                    "job_type",
                    models.CharField(
                        choices=[
                            ("full_time", "Full Time"),
                            ("part_time", "Part Time"),
                            ("contract", "Contract"),
                            ("remote", "Remote"),
                        ],
                        db_index=True,
                        max_length=20,
                    ),
                ),
                (
                    "experience_level",
                    models.CharField(
                        choices=[
                            ("junior", "Junior"),
                            ("mid", "Mid"),
                            ("senior", "Senior"),
                            ("lead", "Lead"),
                        ],
                        db_index=True,
                        max_length=20,
                    ),
                ),
                ("is_active", models.BooleanField(db_index=True, default=True)),
                ("deadline", models.DateField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "company",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="job_listings",
                        to="careers.company",
                    ),
                ),
            ],
            options={
                "verbose_name": "Job Listing",
                "verbose_name_plural": "Job Listings",
                "ordering": ["-created_at"],
            },
        ),
    ]
