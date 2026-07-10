import pytest
from pydantic import ValidationError
from app.core.config import settings, Settings, Environment

def test_app_settings():
    """Verify default setting properties are parsed correctly."""
    assert settings.APP_NAME == "SIET Portal API"
    assert settings.API_PREFIX == "/api/v1"

def test_production_strict_validation():
    """Verify application raises ValidationError when configured insecurely in production."""
    with pytest.raises(ValidationError):
        Settings(ENV=Environment.production, DEBUG=True)

    with pytest.raises(ValidationError):
        Settings(ENV=Environment.production, DEBUG=False, JWT_SECRET="supersecretjwtkey")
