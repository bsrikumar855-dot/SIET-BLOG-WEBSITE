from typing import Optional, Tuple, List
from datetime import datetime, timezone
from app.modules.news.models import News
from app.modules.news.schemas import NewsCreate, NewsUpdate, NewsPublish
from app.modules.news.repository import NewsRepository
from app.modules.news.exceptions import NewsNotFoundException
from app.shared.utils.slugs import generate_slug, ensure_unique_slug
from app.shared.utils.publish import validate_publish_state, validate_status_transition
from app.shared.types.content import ContentStatus
from app.shared.pagination.cursor import CursorPageInfo, encode_cursor, decode_cursor

class NewsService:
    def __init__(self, repository: NewsRepository):
        self.repository = repository

    async def get_news(self, news_id: int) -> News:
        news = await self.repository.get_by_id(news_id)
        if not news:
            raise NewsNotFoundException()
        return news

    async def get_news_by_slug(self, slug: str) -> News:
        news = await self.repository.get_by_slug(slug)
        if not news:
            raise NewsNotFoundException()
        return news

    async def list_news(
        self, 
        limit: int = 20, 
        cursor: Optional[str] = None, 
        status: Optional[ContentStatus] = None
    ) -> Tuple[List[News], CursorPageInfo]:
        
        cursor_data = decode_cursor(cursor)
        cursor_id = cursor_data.get("id") if cursor_data else None
        
        items = await self.repository.get_paginated(limit=limit, cursor_id=cursor_id, status=status)
        
        has_next = len(items) > limit
        if has_next:
            items = items[:-1]
            last_item = items[-1]
            next_cursor = encode_cursor({"id": last_item.id})
        else:
            next_cursor = None
            
        page_info = CursorPageInfo(next_cursor=next_cursor, has_next=has_next)
        return items, page_info

    async def create_news(self, news_in: NewsCreate) -> News:
        slug = generate_slug(news_in.title)
        slug = await ensure_unique_slug(self.repository.db, News, slug)
        
        news = News(
            title=news_in.title,
            slug=slug,
            content=news_in.content,
            excerpt=news_in.excerpt,
            domain_id=news_in.domain_id,
            featured_image_id=news_in.featured_image_id,
            status=ContentStatus.DRAFT
        )
        news = await self.repository.create(news)
        await self.repository.db.commit()
        await self.repository.db.refresh(news)
        return news

    async def update_news(self, news_id: int, news_in: NewsUpdate) -> News:
        news = await self.get_news(news_id)
        
        update_dict = news_in.model_dump(exclude_unset=True)
        
        if "title" in update_dict and update_dict["title"] != news.title:
            slug = generate_slug(update_dict["title"])
            slug = await ensure_unique_slug(self.repository.db, News, slug, exclude_id=news_id)
            update_dict["slug"] = slug
            
        for key, value in update_dict.items():
            setattr(news, key, value)
        
        news = await self.repository.update(news)
        await self.repository.db.commit()
        await self.repository.db.refresh(news)
        return news

    async def publish_news(self, news_id: int, publish_in: NewsPublish) -> News:
        news = await self.get_news(news_id)
        
        validate_status_transition(news.status, publish_in.status)
        
        required_fields = {
            "title": news.title,
            "content": news.content
        }
        validate_publish_state(publish_in.status, required_fields)
        
        update_dict = {"status": publish_in.status}
        if publish_in.status == ContentStatus.PUBLISHED and not news.published_at:
            update_dict["published_at"] = datetime.now(timezone.utc)
            
        for key, value in update_dict.items():
            setattr(news, key, value)
            
        news = await self.repository.update(news)
        await self.repository.db.commit()
        await self.repository.db.refresh(news)
        return news

    async def delete_news(self, news_id: int) -> None:
        news = await self.get_news(news_id)
        await self.repository.delete(news)
        await self.repository.db.commit()
