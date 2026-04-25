from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    """
    Validates and creates a new email/password user.
    password and password_confirm are write-only; neither is ever
    returned in any response.
    """

    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={"input_type": "password"},
    )
    password_confirm = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
    )

    class Meta:
        model = User
        fields = ("email", "username", "password", "password_confirm")

    # ── Field-level validation ────────────────────────────────────────────────

    def validate_email(self, value: str) -> str:
        normalised = value.lower().strip()
        if User.objects.filter(email=normalised).exists():
            # Raise with a custom code so the exception handler surfaces
            # EMAIL_ALREADY_EXISTS instead of the generic VALIDATION_ERROR.
            raise serializers.ValidationError(
                "A user with this email already exists.",
                code="EMAIL_ALREADY_EXISTS",
            )
        return normalised

    def validate_password(self, value: str) -> str:
        # Run Django's built-in password validators (length, common, numeric…)
        validate_password(value)
        return value

    # ── Object-level validation ───────────────────────────────────────────────

    def validate(self, attrs: dict) -> dict:
        if attrs["password"] != attrs.pop("password_confirm"):
            raise serializers.ValidationError(
                {"password_confirm": "Passwords do not match."},
                code="VALIDATION_ERROR",
            )
        return attrs

    def create(self, validated_data: dict) -> User:
        return User.objects.create_user(
            email=validated_data["email"],
            username=validated_data["username"],
            password=validated_data["password"],
        )


class UserPublicSerializer(serializers.ModelSerializer):
    """Read-only snapshot of a user that is safe to include in responses."""

    class Meta:
        model = User
        fields = ("id", "email", "username", "auth_provider")
        read_only_fields = fields


class PasswordChangeSerializer(serializers.Serializer):
    """
    Validates a password-change request.
    Google OAuth users cannot change their password because they
    never had one — the view enforces this but we also encode the
    constraint here as documentation.
    """

    current_password = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
    )
    new_password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={"input_type": "password"},
    )
    new_password_confirm = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
    )

    def validate_new_password(self, value: str) -> str:
        validate_password(value)
        return value

    def validate(self, attrs: dict) -> dict:
        if attrs["new_password"] != attrs.pop("new_password_confirm"):
            raise serializers.ValidationError(
                {"new_password_confirm": "New passwords do not match."},
            )
        return attrs


class GoogleLoginSerializer(serializers.Serializer):
    """
    Validates the incoming Google id_token from the frontend.

    The frontend receives this token from @react-oauth/google after
    the user completes the Google consent screen. It's a signed JWT
    issued by Google — we verify it in google.py.

    We don't validate the token format here (that's google-auth's job).
    We just confirm the field is present and non-empty.
    """

    id_token = serializers.CharField(
        required=True,
        allow_blank=False,
        help_text="Google ID token from @react-oauth/google credential response.",
    )

    def validate_id_token(self, value: str) -> str:
        value = value.strip()
        if not value:
            raise serializers.ValidationError("id_token cannot be empty.")
        # Basic sanity: Google JWTs are always 3-part dot-separated strings
        if value.count(".") != 2:
            raise serializers.ValidationError(
                "id_token does not appear to be a valid JWT. "
                "Expected a Google credential response token."
            )
        return value
