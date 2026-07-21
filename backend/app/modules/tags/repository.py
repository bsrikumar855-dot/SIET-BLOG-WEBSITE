
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.tags.models import Tag
from app.shared.repository.base import BaseRepository


class TagRepository(BaseRepository[Tag]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, Tag)

    async def get_by_slug(self, slug: str) -> Tag | None:
        result = await self.db.execute(select(Tag).where(Tag.slug == slug))
        return result.scalars().first()

    async def get_all(self, skip: int = 0, limit: int = 100) -> list[Tag]:
        result = await self.db.execute(select(Tag).offset(skip).limit(limit))
        return list(result.scalars().all())
