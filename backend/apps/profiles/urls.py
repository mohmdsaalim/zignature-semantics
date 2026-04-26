from django.urls import path

from .views import CoverLetterUploadView, ProfileMeView, ResumeUploadView

urlpatterns = [
    path("me/", ProfileMeView.as_view(), name="profile-me"),
    path("me/upload/resume/", ResumeUploadView.as_view(), name="profile-resume"),
    path("me/upload/cover-letter/", CoverLetterUploadView.as_view(), name="profile-cover-letter"),
]
