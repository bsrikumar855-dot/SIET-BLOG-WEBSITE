from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.infrastructure.storage.client import R2StorageClient
from app.modules.media.repository import MediaRepository
from app.modules.media.service import MediaService


def get_storage_client() -> R2StorageClient:
    return R2StorageClient()

def get_media_repository(db: AsyncSession = Depends(get_db)) -> MediaRepository:
    return MediaRepository(db)

def get_media_service(
    repository: MediaRepository = Depends(get_media_repository),
    storage_client: R2StorageClient = Depends(get_storage_client)
) -> MediaService:
    return MediaService(repository, storage_client)
