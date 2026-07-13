from typing import Optional, Tuple, List
from datetime import datetime, timezone
from app.modules.magazine.models import Magazine, MagazineAchievement, MagazineProjectLink
from app.modules.magazine.schemas import MagazineCreate, MagazineUpdate, MagazinePublish
from app.modules.magazine.repository import MagazineRepository
from app.modules.magazine.exceptions import MagazineNotFoundException
from app.shared.utils.slugs import generate_slug, ensure_unique_slug
from app.shared.utils.publish import validate_publish_state, validate_status_transition
from app.shared.types.content import ContentStatus
from app.shared.pagination.cursor import CursorPageInfo, encode_cursor, decode_cursor

class MagazineService:
    def __init__(self, repository: MagazineRepository):
        self.repository = repository

    async def get_magazine(self, magazine_id: int) -> Magazine:
        magazine = await self.repository.get_by_id(magazine_id)
        if not magazine:
            raise MagazineNotFoundException()
        return magazine

    async def get_magazine_by_slug(self, slug: str) -> Magazine:
        magazine = await self.repository.get_by_slug(slug)
        if not magazine:
            raise MagazineNotFoundException()
        return magazine

    async def list_magazines(
        self, 
        limit: int = 20, 
        cursor: Optional[str] = None, 
        status: Optional[ContentStatus] = None,
        year: Optional[int] = None
    ) -> Tuple[List[Magazine], CursorPageInfo]:
        
        cursor_data = decode_cursor(cursor)
        cursor_id = cursor_data.get("id") if cursor_data else None
        
        items = await self.repository.get_paginated(limit=limit, cursor_id=cursor_id, status=status, year=year)
        
        has_next = len(items) > limit
        if has_next:
            items = items[:-1]
            last_item = items[-1]
            next_cursor = encode_cursor({"id": last_item.id})
        else:
            next_cursor = None
            
        page_info = CursorPageInfo(next_cursor=next_cursor, has_next=has_next)
        return items, page_info

    async def create_magazine(self, magazine_in: MagazineCreate) -> Magazine:
        slug = generate_slug(magazine_in.title)
        slug = await ensure_unique_slug(self.repository.db, Magazine, slug)
        
        magazine = Magazine(
            title=magazine_in.title,
            slug=slug,
            description=magazine_in.description,
            magazine_type=magazine_in.magazine_type,
            publication_year=magazine_in.publication_year,
            cover_image_id=magazine_in.cover_image_id,
            pdf_file_id=magazine_in.pdf_file_id,
            status=ContentStatus.DRAFT
        )
        
        if magazine_in.achievements:
            magazine.achievements = [
                MagazineAchievement(title=a.title, description=a.description)
                for a in magazine_in.achievements
            ]
            
        if magazine_in.project_links:
            magazine.project_links = [
                MagazineProjectLink(title=p.title, url=p.url)
                for p in magazine_in.project_links
            ]
            
        magazine = await self.repository.create(magazine)
        await self.repository.db.commit()
        await self.repository.db.refresh(magazine)
        return magazine

    async def update_magazine(self, magazine_id: int, magazine_in: MagazineUpdate) -> Magazine:
        magazine = await self.get_magazine(magazine_id)
        
        update_dict = magazine_in.model_dump(exclude_unset=True)
        
        if "title" in update_dict and update_dict["title"] != magazine.title:
            slug = generate_slug(update_dict["title"])
            slug = await ensure_unique_slug(self.repository.db, Magazine, slug, exclude_id=magazine_id)
            update_dict["slug"] = slug
            
        for key, value in update_dict.items():
            setattr(magazine, key, value)
            
        magazine = await self.repository.update(magazine)
        await self.repository.db.commit()
        await self.repository.db.refresh(magazine)
        return magazine

    async def publish_magazine(self, magazine_id: int, publish_in: MagazinePublish) -> Magazine:
        magazine = await self.get_magazine(magazine_id)
        
        validate_status_transition(magazine.status, publish_in.status)
        
        required_fields = {
            "title": magazine.title,
            "magazine_type": magazine.magazine_type,
            "publication_year": magazine.publication_year,
            "pdf_file_id": magazine.pdf_file_id
        }
        validate_publish_state(publish_in.status, required_fields)
        
        update_dict = {"status": publish_in.status}
        if publish_in.status == ContentStatus.PUBLISHED and not magazine.published_at:
            update_dict["published_at"] = datetime.now(timezone.utc)
            
        for key, value in update_dict.items():
            setattr(magazine, key, value)
            
        magazine = await self.repository.update(magazine)
        await self.repository.db.commit()
        await self.repository.db.refresh(magazine)
        return magazine

    async def delete_magazine(self, magazine_id: int) -> None:
        magazine = await self.get_magazine(magazine_id)
        await self.repository.delete(magazine)
        await self.repository.db.commit()
