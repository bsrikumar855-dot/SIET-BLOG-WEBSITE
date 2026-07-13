from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field
from app.shared.types.content import ContentStatus

class NewsBase(BaseModel):
    title: str = Field(..., max_length=255)
    content: str
    excerpt: Optional[str] = None
    domain_id: Optional[int] = None
    featured_image_id: Optional[int] = None

class NewsCreate(NewsBase):
    pass

class NewsUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    content: Optional[str] = None
    excerpt: Optional[str] = None
    domain_id: Optional[int] = None
    featured_image_id: Optional[int] = None

class NewsPublish(BaseModel):
    status: ContentStatus

class NewsResponse(NewsBase):
    id: int
    slug: str
    status: ContentStatus
    published_at: Optional[datetime] = None
    author_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
