from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field
from app.shared.types.content import ContentStatus

class ArticleBase(BaseModel):
    title: str = Field(..., max_length=255)
    content: str
    excerpt: Optional[str] = None
    domain_id: Optional[int] = None
    author_id: Optional[int] = None
    featured_image_id: Optional[int] = None

class ArticleCreate(ArticleBase):
    pass

class ArticleUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    content: Optional[str] = None
    excerpt: Optional[str] = None
    domain_id: Optional[int] = None
    author_id: Optional[int] = None
    featured_image_id: Optional[int] = None

class ArticlePublish(BaseModel):
    status: ContentStatus

class ArticleResponse(ArticleBase):
    id: int
    slug: str
    status: ContentStatus
    reading_time_minutes: int
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
