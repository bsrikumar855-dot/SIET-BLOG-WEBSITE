from datetime import datetime

from pydantic import BaseModel, Field

from app.shared.types.content import ContentStatus


class NewsBase(BaseModel):
    title: str = Field(..., max_length=255)
    content: str
    excerpt: str | None = None
    domain_id: int | None = None
    featured_image_id: int | None = None

class NewsCreate(NewsBase):
    pass

class NewsUpdate(BaseModel):
    title: str | None = Field(None, max_length=255)
    content: str | None = None
    excerpt: str | None = None
    domain_id: int | None = None
    featured_image_id: int | None = None

class NewsPublish(BaseModel):
    status: ContentStatus

class NewsResponse(NewsBase):
    id: int
    slug: str
    status: ContentStatus
    published_at: datetime | None = None
    author_id: int | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
