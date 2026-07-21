from app.modules.engagement.repository import EngagementRepository
from app.modules.engagement.schemas import EngagementStatus, ToggleResponse
from app.shared.exceptions.custom import ForbiddenException
from app.shared.types.content import ContentKind


class EngagementService:
    def __init__(self, repository: EngagementRepository):
        self.repository = repository

    def _ensure_verified(self, user):
        if getattr(user, 'email_verified', False) is False:
            raise ForbiddenException("Email not verified.")

    async def toggle_like(self, user, content_id: int, content_kind: ContentKind) -> ToggleResponse:
        self._ensure_verified(user)
        
        existing_like = await self.repository.get_like(user.id, content_id, content_kind)
        if existing_like:
            await self.repository.remove_like(existing_like)
            return ToggleResponse(status=False, message="Like removed")
        else:
            await self.repository.add_like(user.id, content_id, content_kind)
            return ToggleResponse(status=True, message="Like added")

    async def toggle_bookmark(self, user, content_id: int, content_kind: ContentKind) -> ToggleResponse:
        self._ensure_verified(user)
        
        existing_bookmark = await self.repository.get_bookmark(user.id, content_id, content_kind)
        if existing_bookmark:
            await self.repository.remove_bookmark(existing_bookmark)
            return ToggleResponse(status=False, message="Bookmark removed")
        else:
            await self.repository.add_bookmark(user.id, content_id, content_kind)
            return ToggleResponse(status=True, message="Bookmark added")

    async def remove_like(self, user, content_id: int, content_kind: ContentKind) -> ToggleResponse:
        self._ensure_verified(user)
        existing_like = await self.repository.get_like(user.id, content_id, content_kind)
        if existing_like:
            await self.repository.remove_like(existing_like)
        return ToggleResponse(status=False, message="Like removed")

    async def remove_bookmark(self, user, content_id: int, content_kind: ContentKind) -> ToggleResponse:
        self._ensure_verified(user)
        existing_bookmark = await self.repository.get_bookmark(user.id, content_id, content_kind)
        if existing_bookmark:
            await self.repository.remove_bookmark(existing_bookmark)
        return ToggleResponse(status=False, message="Bookmark removed")

    async def get_engagement_status(self, user, content_id: int, content_kind: ContentKind) -> EngagementStatus:
        is_liked = False
        is_bookmarked = False
        
        if user:
            is_liked = bool(await self.repository.get_like(user.id, content_id, content_kind))
            is_bookmarked = bool(await self.repository.get_bookmark(user.id, content_id, content_kind))
            
        total_likes = await self.repository.count_likes(content_id, content_kind)
        
        return EngagementStatus(
            content_id=content_id,
            content_kind=content_kind,
            is_liked=is_liked,
            is_bookmarked=is_bookmarked,
            total_likes=total_likes
        )
