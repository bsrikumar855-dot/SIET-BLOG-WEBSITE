from app.modules.health.service import HealthService


def get_health_service() -> HealthService:
    """Dependency injection wrapper to return a HealthService instance."""
    return HealthService()
