from typing import Optional, List
from pydantic import BaseModel, Field, EmailStr
from app.shared.types.content import ContentStatus, MagazineType

# User CRUD schemas
class AdminUserCreate(BaseModel):
    name: str = Field(..., max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = Field("user", max_length=20)

class AdminUserUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=6)
    role: Optional[str] = Field(None, max_length=20)

# News CRUD schemas
class NewsCreate(BaseModel):
    title: str = Field(..., max_length=255)
    content: str
    excerpt: Optional[str] = None
    status: ContentStatus = ContentStatus.DRAFT
    domain_id: Optional[int] = None
    featured_image_id: Optional[int] = None
    author_id: Optional[int] = None

class NewsUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    content: Optional[str] = None
    excerpt: Optional[str] = None
    status: Optional[ContentStatus] = None
    domain_id: Optional[int] = None
    featured_image_id: Optional[int] = None
    author_id: Optional[int] = None

# Article CRUD schemas
class ArticleCreate(BaseModel):
    title: str = Field(..., max_length=255)
    content: str
    excerpt: Optional[str] = None
    reading_time_minutes: int = Field(5, ge=1)
    status: ContentStatus = ContentStatus.DRAFT
    domain_id: Optional[int] = None
    featured_image_id: Optional[int] = None
    author_id: Optional[int] = None

class ArticleUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    content: Optional[str] = None
    excerpt: Optional[str] = None
    reading_time_minutes: Optional[int] = Field(None, ge=1)
    status: Optional[ContentStatus] = None
    domain_id: Optional[int] = None
    featured_image_id: Optional[int] = None
    author_id: Optional[int] = None

# Magazine CRUD schemas
class MagazineAchievementInput(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None

class MagazineProjectLinkInput(BaseModel):
    title: str = Field(..., max_length=255)
    url: str = Field(..., max_length=500)

class MagazineCreate(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    magazine_type: MagazineType
    publication_year: int
    status: ContentStatus = ContentStatus.DRAFT
    cover_image_id: Optional[int] = None
    pdf_file_id: Optional[int] = None
    achievements: Optional[List[MagazineAchievementInput]] = None
    project_links: Optional[List[MagazineProjectLinkInput]] = None

class MagazineUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    magazine_type: Optional[MagazineType] = None
    publication_year: Optional[int] = None
    status: Optional[ContentStatus] = None
    cover_image_id: Optional[int] = None
    pdf_file_id: Optional[int] = None
    achievements: Optional[List[MagazineAchievementInput]] = None
    project_links: Optional[List[MagazineProjectLinkInput]] = None
