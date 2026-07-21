from datetime import datetime

from pydantic import BaseModel, Field

from app.shared.types.content import ContentStatus


class ArticleBase(BaseModel):
    title: str = Field(..., max_length=255)
    content: str
    excerpt: str | None = None
    domain_id: int | None = None
    author_id: int | None = None
    featured_image_id: int | None = None

class ArticleCreate(ArticleBase):
    pass

class ArticleUpdate(BaseModel):
    title: str | None = Field(None, max_length=255)
    content: str | None = None
    excerpt: str | None = None
    domain_id: int | None = None
    author_id: int | None = None
    featured_image_id: int | None = None

class ArticlePublish(BaseModel):
    status: ContentStatus

class ArticleResponse(ArticleBase):
    id: int
    slug: str
    status: ContentStatus
    reading_time_minutes: int
    published_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
