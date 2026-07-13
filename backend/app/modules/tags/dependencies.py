from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.modules.tags.repository import TagRepository
from app.modules.tags.service import TagService

def get_tag_repository(db: AsyncSession = Depends(get_db)) -> TagRepository:
    return TagRepository(db)

def get_tag_service(repository: TagRepository = Depends(get_tag_repository)) -> TagService:
    return TagService(repository)
