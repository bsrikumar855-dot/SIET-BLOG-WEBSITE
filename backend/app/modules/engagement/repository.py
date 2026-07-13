from typing import Optional
from sqlalchemy import select, func, and_, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.engagement.models import Like, Bookmark
from app.shared.types.content import ContentKind

from app.shared.repository.base import BaseRepository

class EngagementRepository(BaseRepository[Like]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, Like)

    async def get_like(self, user_id: int, content_id: int, content_kind: ContentKind) -> Optional[Like]:
        query = select(Like).where(
            and_(
                Like.user_id == user_id,
                Like.content_id == content_id,
                Like.content_kind == content_kind
            )
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_bookmark(self, user_id: int, content_id: int, content_kind: ContentKind) -> Optional[Bookmark]:
        query = select(Bookmark).where(
            and_(
                Bookmark.user_id == user_id,
                Bookmark.content_id == content_id,
                Bookmark.content_kind == content_kind
            )
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def count_likes(self, content_id: int, content_kind: ContentKind) -> int:
        query = select(func.count()).select_from(Like).where(
            and_(
                Like.content_id == content_id,
                Like.content_kind == content_kind
            )
        )
        result = await self.db.execute(query)
        return result.scalar() or 0

    async def add_like(self, user_id: int, content_id: int, content_kind: ContentKind) -> Like:
        like = Like(user_id=user_id, content_id=content_id, content_kind=content_kind)
        self.db.add(like)
        return like

    async def remove_like(self, like: Like) -> None:
        await self.db.delete(like)

    async def add_bookmark(self, user_id: int, content_id: int, content_kind: ContentKind) -> Bookmark:
        bookmark = Bookmark(user_id=user_id, content_id=content_id, content_kind=content_kind)
        self.db.add(bookmark)
        return bookmark

    async def remove_bookmark(self, bookmark: Bookmark) -> None:
        await self.db.delete(bookmark)
