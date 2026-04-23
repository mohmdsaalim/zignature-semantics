import pytest
from django.contrib.auth import get_user_model
from django.db import IntegrityError

User = get_user_model()


@pytest.mark.django_db
class TestUserCreation:
    """Tests for basic User model creation."""

    def test_create_user_with_email_and_username(self):
        """A regular user can be created with email, username, and password."""
        user = User.objects.create_user(
            email="testuser@example.com",
            username="testuser",
            password="StrongPass123!",
        )
        assert user.email == "testuser@example.com"
        assert user.username == "testuser"
        assert user.is_active is True
        assert user.is_staff is False
        assert user.is_superuser is False

    def test_user_password_is_hashed(self):
        """Password must be stored as a hash, never plaintext."""
        user = User.objects.create_user(
            email="hash@example.com",
            username="hashuser",
            password="PlainTextPass123!",
        )
        assert user.password != "PlainTextPass123!"
        assert user.check_password("PlainTextPass123!") is True

    def test_user_id_is_uuid(self):
        """Primary key must be a UUID, not an integer."""
        import uuid

        user = User.objects.create_user(
            email="uuid@example.com",
            username="uuiduser",
            password="Pass123!",
        )
        assert isinstance(user.id, uuid.UUID)

    def test_user_str_returns_email(self):
        """__str__ must return email."""
        user = User.objects.create_user(
            email="str@example.com",
            username="struser",
            password="Pass123!",
        )
        assert str(user) == "str@example.com"

    def test_default_auth_provider_is_email(self):
        """auth_provider defaults to 'email' for regular registration."""
        user = User.objects.create_user(
            email="provider@example.com",
            username="provideruser",
            password="Pass123!",
        )
        assert user.auth_provider == "email"

    def test_create_google_user(self):
        """A user created via Google OAuth has auth_provider='google'."""
        user = User.objects.create_user(
            email="google@example.com",
            username="googleuser",
            password=None,
            auth_provider="google",
        )
        assert user.auth_provider == "google"
        assert user.is_google_user is True

    def test_user_has_timestamps(self):
        """created_at and updated_at must be set automatically."""
        user = User.objects.create_user(
            email="timestamps@example.com",
            username="timestampuser",
            password="Pass123!",
        )
        assert user.created_at is not None
        assert user.updated_at is not None


@pytest.mark.django_db
class TestUserUniqueness:
    """Tests for unique constraint enforcement."""

    def test_duplicate_email_raises_error(self):
        """Creating two users with the same email must fail."""
        User.objects.create_user(
            email="duplicate@example.com",
            username="user_one",
            password="Pass123!",
        )
        with pytest.raises(IntegrityError):
            User.objects.create_user(
                email="duplicate@example.com",
                username="user_two",
                password="Pass123!",
            )

    def test_duplicate_username_raises_error(self):
        """Creating two users with the same username must fail."""
        User.objects.create_user(
            email="user1@example.com",
            username="sameusername",
            password="Pass123!",
        )
        with pytest.raises(IntegrityError):
            User.objects.create_user(
                email="user2@example.com",
                username="sameusername",
                password="Pass123!",
            )

    def test_email_is_case_normalised(self):
        """Emails should be normalised to lowercase domain."""
        user = User.objects.create_user(
            email="User@EXAMPLE.COM",
            username="caseuser",
            password="Pass123!",
        )
        # Django's normalize_email lowercases the domain part
        assert user.email == "User@example.com"


@pytest.mark.django_db
class TestSuperuserCreation:
    """Tests for superuser creation via UserManager."""

    def test_create_superuser(self):
        """create_superuser must set is_staff=True and is_superuser=True."""
        superuser = User.objects.create_superuser(
            email="admin@example.com",
            username="admin",
            password="AdminPass123!",
        )
        assert superuser.is_staff is True
        assert superuser.is_superuser is True
        assert superuser.is_active is True

    def test_superuser_without_is_staff_raises(self):
        """create_superuser with is_staff=False must raise ValueError."""
        with pytest.raises(ValueError, match="Superuser must have is_staff=True"):
            User.objects.create_superuser(
                email="badadmin@example.com",
                username="badadmin",
                password="Pass123!",
                is_staff=False,
            )

    def test_superuser_without_is_superuser_raises(self):
        """create_superuser with is_superuser=False must raise ValueError."""
        with pytest.raises(ValueError, match="Superuser must have is_superuser=True"):
            User.objects.create_superuser(
                email="badsuper@example.com",
                username="badsuper",
                password="Pass123!",
                is_superuser=False,
            )


@pytest.mark.django_db
class TestUserManagerValidation:
    """Tests for UserManager input validation."""

    def test_create_user_without_email_raises(self):
        """create_user with no email must raise ValueError."""
        with pytest.raises(ValueError, match="The Email field must be set"):
            User.objects.create_user(
                email="",
                username="nomail",
                password="Pass123!",
            )

    def test_create_user_without_username_raises(self):
        """create_user with no username must raise ValueError."""
        with pytest.raises(ValueError, match="The Username field must be set"):
            User.objects.create_user(
                email="nouser@example.com",
                username="",
                password="Pass123!",
            )
