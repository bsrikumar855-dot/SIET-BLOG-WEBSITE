
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.modules.magazine.models import (
    Magazine,
)
from app.shared.repository.base import BaseRepository
from app.shared.types.content import ContentStatus


class MagazineRepository(BaseRepository[Magazine]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, Magazine)

    async def get_by_id(self, magazine_id: int) -> Magazine | None:
        query = select(Magazine).options(
            selectinload(Magazine.achievements),
            selectinload(Magazine.project_links)
        ).where(Magazine.id == magazine_id)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_by_slug(self, slug: str) -> Magazine | None:
        query = select(Magazine).options(
            selectinload(Magazine.achievements),
            selectinload(Magazine.project_links)
        ).where(Magazine.slug == slug)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_paginated(
        self, 
        limit: int = 20, 
        cursor_id: int | None = None, 
        status: ContentStatus | None = None,
        year: int | None = None
    ) -> list[Magazine]:
        query = select(Magazine).options(
            selectinload(Magazine.achievements),
            selectinload(Magazine.project_links)
        )
        
        if status:
            query = query.where(Magazine.status == status)
            
        if year:
            query = query.where(Magazine.publication_year == year)
            
        if cursor_id is not None:
            query = query.where(Magazine.id < cursor_id)
            
        query = query.order_by(desc(Magazine.id)).limit(limit + 1)
        
        result = await self.db.execute(query)
        return list(result.scalars().all())
