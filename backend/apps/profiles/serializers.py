import re

from rest_framework import serializers

from .models import Profile

MAX_FILE_SIZE = 5 * 1024 * 1024
PHONE_REGEX = re.compile(r'^\d{10}$')


def validate_pdf(file):

    header = file.read(4)
    file.seek(0)
    if header != b"%PDF":
        raise serializers.ValidationError(
            code="INVALID_FILE_TYPE",
            detail="Only PDF files are allowed.",
        )
    if file.size > MAX_FILE_SIZE:
        raise serializers.ValidationError(
            code="FILE_TOO_LARGE",
            detail="File size must not exceed 5 MB.",
        )
    return file


def validate_phone(value):
    if not PHONE_REGEX.match(value):
        raise serializers.ValidationError(
            {"phone": "Phone number must be exactly 10 digits."}
        )
    return value


class ProfileSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(
        max_length=10,
        min_length=10,
        validators=[validate_phone],
        required=False,
        allow_blank=True,
    )

    class Meta:
        model = Profile
        fields = [
            "id",
            "full_name",
            "phone",
            "location",
            "bio",
            "resume",
            "cover_letter",
            "linkedin_url",
            "portfolio_url",
            "is_available",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "resume", "cover_letter", "created_at", "updated_at"]


class ResumeUploadSerializer(serializers.Serializer):
    resume = serializers.FileField()

    def validate_resume(self, file):
        return validate_pdf(file)


class CoverLetterUploadSerializer(serializers.Serializer):
    cover_letter = serializers.FileField()

    def validate_cover_letter(self, file):
        return validate_pdf(file)
