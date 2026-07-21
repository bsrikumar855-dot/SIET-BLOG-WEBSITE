from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.modules.internal.service import InternalService


def get_internal_service(db: AsyncSession = Depends(get_db)) -> InternalService:
    """Dependency injection wrapper to return an InternalService instance."""
    return InternalService(db)
