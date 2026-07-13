from typing import Optional, List
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.magazine.models import Magazine, MagazineAchievement, MagazineProjectLink
from app.shared.types.content import ContentStatus

from app.shared.repository.base import BaseRepository

class MagazineRepository(BaseRepository[Magazine]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, Magazine)

    async def get_by_id(self, magazine_id: int) -> Optional[Magazine]:
        query = select(Magazine).options(
            selectinload(Magazine.achievements),
            selectinload(Magazine.project_links)
        ).where(Magazine.id == magazine_id)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_by_slug(self, slug: str) -> Optional[Magazine]:
        query = select(Magazine).options(
            selectinload(Magazine.achievements),
            selectinload(Magazine.project_links)
        ).where(Magazine.slug == slug)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_paginated(
        self, 
        limit: int = 20, 
        cursor_id: Optional[int] = None, 
        status: Optional[ContentStatus] = None,
        year: Optional[int] = None
    ) -> List[Magazine]:
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
