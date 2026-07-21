
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.media.models import Media
from app.shared.repository.base import BaseRepository


class MediaRepository(BaseRepository[Media]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, Media)

    async def get_by_key(self, file_key: str) -> Media | None:
        result = await self.db.execute(select(Media).where(Media.file_key == file_key))
        return result.scalars().first()

    async def get_all(self, skip: int = 0, limit: int = 100) -> list[Media]:
        result = await self.db.execute(select(Media).offset(skip).limit(limit))
        return list(result.scalars().all())
