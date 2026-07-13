from typing import Optional, Tuple, List
from datetime import datetime, timezone
from app.modules.articles.models import Article
from app.modules.articles.schemas import ArticleCreate, ArticleUpdate, ArticlePublish
from app.modules.articles.repository import ArticleRepository
from app.modules.articles.exceptions import ArticleNotFoundException
from app.shared.utils.slugs import generate_slug, ensure_unique_slug
from app.shared.utils.publish import validate_publish_state, validate_status_transition, calculate_reading_time
from app.shared.types.content import ContentStatus
from app.shared.pagination.cursor import CursorPageInfo, encode_cursor, decode_cursor

class ArticleService:
    def __init__(self, repository: ArticleRepository):
        self.repository = repository

    async def get_article(self, article_id: int) -> Article:
        article = await self.repository.get_by_id(article_id)
        if not article:
            raise ArticleNotFoundException()
        return article

    async def get_article_by_slug(self, slug: str) -> Article:
        article = await self.repository.get_by_slug(slug)
        if not article:
            raise ArticleNotFoundException()
        return article

    async def list_articles(
        self, 
        limit: int = 20, 
        cursor: Optional[str] = None, 
        status: Optional[ContentStatus] = None
    ) -> Tuple[List[Article], CursorPageInfo]:
        
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

    async def create_article(self, article_in: ArticleCreate) -> Article:
        slug = generate_slug(article_in.title)
        slug = await ensure_unique_slug(self.repository.db, Article, slug)
        
        reading_time = calculate_reading_time(article_in.content)
        
        article = Article(
            title=article_in.title,
            slug=slug,
            content=article_in.content,
            excerpt=article_in.excerpt,
            reading_time_minutes=reading_time,
            domain_id=article_in.domain_id,
            author_id=article_in.author_id,
            featured_image_id=article_in.featured_image_id,
            status=ContentStatus.DRAFT
        )
        article = await self.repository.create(article)
        await self.repository.db.commit()
        await self.repository.db.refresh(article)
        return article

    async def update_article(self, article_id: int, article_in: ArticleUpdate) -> Article:
        article = await self.get_article(article_id)
        
        update_dict = article_in.model_dump(exclude_unset=True)
        
        if "title" in update_dict and update_dict["title"] != article.title:
            slug = generate_slug(update_dict["title"])
            slug = await ensure_unique_slug(self.repository.db, Article, slug, exclude_id=article_id)
            update_dict["slug"] = slug
            
        if "content" in update_dict:
            update_dict["reading_time_minutes"] = calculate_reading_time(update_dict["content"])
            
        for key, value in update_dict.items():
            setattr(article, key, value)
            
        article = await self.repository.update(article)
        await self.repository.db.commit()
        await self.repository.db.refresh(article)
        return article

    async def publish_article(self, article_id: int, publish_in: ArticlePublish) -> Article:
        article = await self.get_article(article_id)
        
        validate_status_transition(article.status, publish_in.status)
        
        required_fields = {
            "title": article.title,
            "content": article.content,
            "author_id": article.author_id
        }
        validate_publish_state(publish_in.status, required_fields)
        
        update_dict = {"status": publish_in.status}
        if publish_in.status == ContentStatus.PUBLISHED and not article.published_at:
            update_dict["published_at"] = datetime.now(timezone.utc)
            
        for key, value in update_dict.items():
            setattr(article, key, value)
            
        article = await self.repository.update(article)
        await self.repository.db.commit()
        await self.repository.db.refresh(article)
        return article

    async def delete_article(self, article_id: int) -> None:
        article = await self.get_article(article_id)
        await self.repository.delete(article)
        await self.repository.db.commit()
