from app.modules.internal.service import InternalService

def get_internal_service() -> InternalService:
    """Dependency injection wrapper to return an InternalService instance."""
    return InternalService()
