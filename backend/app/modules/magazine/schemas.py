from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field
from app.shared.types.content import ContentStatus, MagazineType

class MagazineAchievementBase(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None

class MagazineProjectLinkBase(BaseModel):
    title: str = Field(..., max_length=255)
    url: str = Field(..., max_length=500)

class MagazineBase(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    magazine_type: MagazineType
    publication_year: int
    cover_image_id: Optional[int] = None
    pdf_file_id: Optional[int] = None

class MagazineCreate(MagazineBase):
    achievements: Optional[List[MagazineAchievementBase]] = []
    project_links: Optional[List[MagazineProjectLinkBase]] = []

class MagazineUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    magazine_type: Optional[MagazineType] = None
    publication_year: Optional[int] = None
    cover_image_id: Optional[int] = None
    pdf_file_id: Optional[int] = None

class MagazinePublish(BaseModel):
    status: ContentStatus

class MagazineAchievementResponse(MagazineAchievementBase):
    id: int
    class Config:
        from_attributes = True

class MagazineProjectLinkResponse(MagazineProjectLinkBase):
    id: int
    class Config:
        from_attributes = True

class MagazineResponse(MagazineBase):
    id: int
    slug: str
    status: ContentStatus
    published_at: Optional[datetime] = None
    achievements: List[MagazineAchievementResponse] = []
    project_links: List[MagazineProjectLinkResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
