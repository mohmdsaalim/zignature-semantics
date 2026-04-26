from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    CoverLetterUploadSerializer,
    ProfileSerializer,
    ResumeUploadSerializer,
)


class ProfileMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.profile
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def patch(self, request):
        profile = request.user.profile
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ResumeUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = ResumeUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        profile = request.user.profile
        profile.resume = serializer.validated_data["resume"]
        profile.save()
        return Response(
            {"resume": request.build_absolute_uri(profile.resume.url)},
            status=status.HTTP_200_OK,
        )

    def delete(self, request):
        profile = request.user.profile
        if not profile.resume:
            return Response(
                {"detail": "No resume to delete."},
                status=status.HTTP_404_NOT_FOUND,
            )
        profile.resume.delete(save=True)
        return Response(status=status.HTTP_204_NO_CONTENT)


class CoverLetterUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = CoverLetterUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        profile = request.user.profile
        profile.cover_letter = serializer.validated_data["cover_letter"]
        profile.save()
        return Response(
            {"cover_letter": request.build_absolute_uri(profile.cover_letter.url)},
            status=status.HTTP_200_OK,
        )

    def delete(self, request):
        profile = request.user.profile
        if not profile.cover_letter:
            return Response(
                {"detail": "No cover letter to delete."},
                status=status.HTTP_404_NOT_FOUND,
            )
        profile.cover_letter.delete(save=True)
        return Response(status=status.HTTP_204_NO_CONTENT)
