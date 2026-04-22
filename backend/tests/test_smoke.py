def test_django_settings_load():
    from django.conf import settings

    assert settings.SECRET_KEY is not None
    assert settings.INSTALLED_APPS is not None
    assert "rest_framework" in settings.INSTALLED_APPS
    assert "corsheaders" in settings.INSTALLED_APPS


def test_timestamped_model_is_abstract():
    from common.models import TimeStampedModel

    assert TimeStampedModel._meta.abstract is True
