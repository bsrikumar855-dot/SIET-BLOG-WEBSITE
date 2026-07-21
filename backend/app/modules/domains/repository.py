
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.domains.models import Domain
from app.shared.repository.base import BaseRepository


class DomainRepository(BaseRepository[Domain]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, Domain)

    async def get_by_slug(self, slug: str) -> Domain | None:
        result = await self.db.execute(select(Domain).where(Domain.slug == slug))
        return result.scalars().first()

    async def get_all(self, skip: int = 0, limit: int = 100) -> list[Domain]:
        result = await self.db.execute(select(Domain).offset(skip).limit(limit))
        return list(result.scalars().all())
