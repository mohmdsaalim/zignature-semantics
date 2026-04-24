import os

import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from rest_framework.test import APIClient

from apps.accounts.models import User


@pytest.fixture
def temp_media(tmp_path):
    with override_settings(MEDIA_ROOT=str(tmp_path)):
        yield tmp_path


@pytest.fixture
def user(db):
    return User.objects.create_user(
        email="dennis@example.com",
        username="dennis",
        password="pass123",
    )


@pytest.fixture
def auth_client(user):
    client = APIClient()
    client.force_authenticate(user=user)
    return client


@pytest.fixture
def anon_client():
    return APIClient()


def make_pdf(content=b"%PDF-1.4 fake"):
    return SimpleUploadedFile("resume.pdf", content, content_type="application/pdf")


# ── GET /profile/me/ ─────────────────────────────────────────────────────────

def test_get_profile_authenticated(auth_client, user):
    response = auth_client.get("/api/v1/profile/me/")
    assert response.status_code == 200
    assert response.data["id"] == str(user.profile.id)


def test_get_profile_unauthenticated(anon_client):
    response = anon_client.get("/api/v1/profile/me/")
    assert response.status_code == 401


# ── PATCH /profile/me/ ───────────────────────────────────────────────────────

def test_patch_profile(auth_client):
    response = auth_client.patch(
        "/api/v1/profile/me/",
        {"full_name": "Dennis", "bio": "Backend dev"},
        format="json",
    )
    assert response.status_code == 200
    assert response.data["full_name"] == "Dennis"
    assert response.data["bio"] == "Backend dev"


def test_patch_profile_unauthenticated(anon_client):
    response = anon_client.patch("/api/v1/profile/me/", {}, format="json")
    assert response.status_code == 401


# ── POST /profile/me/upload/resume/ ──────────────────────────────────────────

def test_upload_valid_pdf(auth_client, temp_media):
    pdf = make_pdf()
    response = auth_client.post(
        "/api/v1/profile/me/upload/resume/",
        {"resume": pdf},
        format="multipart",
    )
    assert response.status_code == 200
    assert "resume" in response.data


def test_upload_non_pdf_rejected(auth_client, temp_media):
    fake = SimpleUploadedFile("resume.pdf", b"notapdf", content_type="application/pdf")
    response = auth_client.post(
        "/api/v1/profile/me/upload/resume/",
        {"resume": fake},
        format="multipart",
    )
    assert response.status_code == 400


def test_upload_oversized_file_rejected(auth_client, temp_media):
    big = SimpleUploadedFile(
        "resume.pdf",
        b"%PDF" + b"x" * (5 * 1024 * 1024 + 1),
        content_type="application/pdf",
    )
    response = auth_client.post(
        "/api/v1/profile/me/upload/resume/",
        {"resume": big},
        format="multipart",
    )
    assert response.status_code == 400


def test_upload_resume_twice_replaces_file(auth_client, user, temp_media):
    # First upload
    auth_client.post(
        "/api/v1/profile/me/upload/resume/",
        {"resume": make_pdf(b"%PDF first")},
        format="multipart",
    )


    # Second upload
    auth_client.post(
        "/api/v1/profile/me/upload/resume/",
        {"resume": make_pdf(b"%PDF second")},
        format="multipart",
    )

    # Old file replaced — same path, new content
    user.profile.refresh_from_db()
    with open(user.profile.resume.path, "rb") as f:
        assert f.read() == b"%PDF second"


# ── DELETE /profile/me/upload/resume/ ────────────────────────────────────────

def test_delete_resume_removes_file(auth_client, user, temp_media):
    auth_client.post(
        "/api/v1/profile/me/upload/resume/",
        {"resume": make_pdf()},
        format="multipart",
    )
    user.profile.refresh_from_db()
    resume_path = user.profile.resume.path
    assert os.path.isfile(resume_path)

    response = auth_client.delete("/api/v1/profile/me/upload/resume/")
    assert response.status_code == 204

    user.profile.refresh_from_db()
    assert not user.profile.resume  # field is empty
    assert not os.path.isfile(resume_path)  # file gone from disk


def test_delete_resume_when_none(auth_client):
    response = auth_client.delete("/api/v1/profile/me/upload/resume/")
    assert response.status_code == 404
