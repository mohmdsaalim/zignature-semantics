import uuid

from django.db import models
from django.utils.text import slugify


class Company(models.Model):
    """
    Represents an employer company managed by the agency admin.

    Admins create and manage companies via the Django admin panel.
    Employers browse listings publicly — no platform account needed.

    Slug is auto-generated from `name` on first save if not provided.
    Unique slugs are enforced at DB level. Collision handling appends
    a numeric suffix (e.g. acme-corp-2).

    Ref: system.md §5.4
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=170, unique=True, blank=True)
    logo = models.ImageField(upload_to="company_logos/", blank=True)
    website = models.URLField(blank=True)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Company"
        verbose_name_plural = "Companies"
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name

    def _generate_unique_slug(self) -> str:
        """
        Generates a unique slug from the company name.
        Appends an incrementing suffix if the base slug already exists.
        e.g. 'acme-corp', 'acme-corp-2', 'acme-corp-3', ...
        """
        base_slug = slugify(self.name)
        slug = base_slug
        counter = 2

        qs = Company.objects.exclude(pk=self.pk)
        while qs.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1

        return slug

    def save(self, *args, **kwargs) -> None:
        if not self.slug:
            self.slug = self._generate_unique_slug()
        super().save(*args, **kwargs)


class JobListing(models.Model):
    """
    Represents a job opportunity listed by the agency for a specific company.

    Job listings are read-only from the public API — job seekers cannot
    apply through the platform. The CTA is 'Contact the Agency' (off-platform).

    Slug is auto-generated from `title` on first save if not provided.
    Collision handling appends a numeric suffix.

    Ref: system.md §5.5
    """

    class JobType(models.TextChoices):
        FULL_TIME = "full_time", "Full Time"
        PART_TIME = "part_time", "Part Time"
        CONTRACT = "contract", "Contract"
        REMOTE = "remote", "Remote"

    class ExperienceLevel(models.TextChoices):
        JUNIOR = "junior", "Junior"
        MID = "mid", "Mid"
        SENIOR = "senior", "Senior"
        LEAD = "lead", "Lead"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="job_listings",
    )
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField()
    requirements = models.TextField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    job_type = models.CharField(
        max_length=20,
        choices=JobType.choices,
        db_index=True,
    )
    experience_level = models.CharField(
        max_length=20,
        choices=ExperienceLevel.choices,
        db_index=True,
    )
    is_active = models.BooleanField(default=True, db_index=True)
    deadline = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Job Listing"
        verbose_name_plural = "Job Listings"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.title} — {self.company.name}"

    def _generate_unique_slug(self) -> str:
        """
        Generates a unique slug from the job title.
        Appends an incrementing suffix if the base slug already exists.
        e.g. 'software-engineer', 'software-engineer-2', ...
        """
        base_slug = slugify(self.title)
        slug = base_slug
        counter = 2

        qs = JobListing.objects.exclude(pk=self.pk)
        while qs.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1

        return slug

    def save(self, *args, **kwargs) -> None:
        if not self.slug:
            self.slug = self._generate_unique_slug()
        super().save(*args, **kwargs)
