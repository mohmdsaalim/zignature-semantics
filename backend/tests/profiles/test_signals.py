import os

import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings

from apps.accounts.models import User
from apps.profiles.models import Profile


@pytest.fixture
def temp_media(tmp_path):
    with override_settings(MEDIA_ROOT=str(tmp_path)):
        yield tmp_path


@pytest.fixture
def email_user(db):
    return User.objects.create_user(
        email="dennis@example.com",
        username="dennis",
        password="pass123",
    )


@pytest.fixture
def google_user(db):
    return User.objects.create_user(
        email="dennis@gmail.com",
        username="dennis_g",
        password=None,
        auth_provider="google",
    )


# ── Test 1 & 2: Profile auto-created ─────────────────────────────────────────

def test_profile_created_for_email_user(email_user):
    assert Profile.objects.filter(user=email_user).exists()


def test_profile_created_for_google_user(google_user):
    assert Profile.objects.filter(user=google_user).exists()


# ── Test 3: User deleted → files deleted from disk ───────────────────────────

def test_user_deletion_removes_files(db, temp_media):
    user = User.objects.create_user(
        email="todelete@example.com",
        username="todelete",
        password="pass",
    )
    profile = user.profile
    pdf = SimpleUploadedFile("resume.pdf", b"%PDF-1.4 fake content", content_type="application/pdf")
    profile.resume = pdf
    profile.save()

    resume_path = profile.resume.path
    assert os.path.isfile(resume_path)

    user.delete()
    assert not os.path.isfile(resume_path)


# ── Test 4: Resume replaced → old file deleted from disk ─────────────────────

def test_resume_replace_removes_old_file(db, temp_media):
    user = User.objects.create_user(
        email="replace@example.com",
        username="replace",
        password="pass",
    )
    profile = user.profile

    first_pdf = SimpleUploadedFile("resume.pdf", b"%PDF first", content_type="application/pdf")
    profile.resume = first_pdf
    profile.save()
    old_path = profile.resume.path
    assert os.path.isfile(old_path)

    second_pdf = SimpleUploadedFile("resume.pdf", b"%PDF second", content_type="application/pdf")
    profile.resume = second_pdf
    profile.save()

    assert os.path.isfile(old_path)
    with open(old_path, "rb") as f:
        assert f.read() == b"%PDF second"
