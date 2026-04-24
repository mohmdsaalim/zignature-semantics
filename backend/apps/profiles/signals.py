from django.conf import settings
from django.db.models.signals import post_save, pre_delete, pre_save
from django.dispatch import receiver

from .models import Profile

# —- Signal 1: Auto-create Profile when a User is saved —────────────────────—

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_profile_for_new_user(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


# —- Signal 2: Delete old file from storage when resume/cover_letter is replaced —

def _delete_file_if_changed(instance, field_name):
    """
    Compares the current DB value of `field_name` against the incoming value.
    If they differ and the old file exists, delete it using storage API.
    """
    if not instance.pk:
        return

    try:
        old_instance = Profile.objects.get(pk=instance.pk)
    except Profile.DoesNotExist:
        return

    old_file = getattr(old_instance, field_name)
    new_file = getattr(instance, field_name)

    if old_file and old_file != new_file:
        try:
            old_file.delete(save=False)
        except Exception:
            pass


@receiver(pre_save, sender=Profile)
def cleanup_old_files_on_replace(sender, instance, **kwargs):
    _delete_file_if_changed(instance, "resume")
    _delete_file_if_changed(instance, "cover_letter")


# —- Signal 3: Delete all media files when a User is deleted —─────────────────

@receiver(pre_delete, sender=settings.AUTH_USER_MODEL)
def cleanup_user_media_on_delete(sender, instance, **kwargs):
    try:
        profile = instance.profile
    except Profile.DoesNotExist:
        return

    for field_name in ("resume", "cover_letter"):
        file_field = getattr(profile, field_name)
        if file_field:
            try:
                file_field.delete(save=False)
            except Exception:
                pass
