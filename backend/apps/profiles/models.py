import uuid

from django.conf import settings
from django.db import models

from common.models import TimeStampedModel


def resume_upload_path(instance, filename):
    return f"resumes/{instance.user_id}/resume.pdf"

def cover_letter_upload_path(instance, filename):
    return f"cover_letters/{instance.user_id}/cover_letter.pdf"

class Profile(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    full_name = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=12, blank=True)
    location = models.TextField(blank=True)
    bio = models.TextField(blank=True)
    resume = models.FileField(upload_to=resume_upload_path, blank=True)
    cover_letter = models.FileField(upload_to=cover_letter_upload_path, blank=True)
    linkedin_url = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)
    is_available = models.BooleanField(default=True, db_index=True)

    def __str__(self):
        return f"Profile({self.user.email})"
