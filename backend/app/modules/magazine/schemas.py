from datetime import datetime

from pydantic import BaseModel, Field

from app.shared.types.content import ContentStatus, MagazineType


class MagazineAchievementBase(BaseModel):
    title: str = Field(..., max_length=255)
    description: str | None = None

class MagazineProjectLinkBase(BaseModel):
    title: str = Field(..., max_length=255)
    url: str = Field(..., max_length=500)

class MagazineBase(BaseModel):
    title: str = Field(..., max_length=255)
    description: str | None = None
    magazine_type: MagazineType
    publication_year: int
    cover_image_id: int | None = None
    pdf_file_id: int | None = None

class MagazineCreate(MagazineBase):
    achievements: list[MagazineAchievementBase] | None = []
    project_links: list[MagazineProjectLinkBase] | None = []

class MagazineUpdate(BaseModel):
    title: str | None = Field(None, max_length=255)
    description: str | None = None
    magazine_type: MagazineType | None = None
    publication_year: int | None = None
    cover_image_id: int | None = None
    pdf_file_id: int | None = None

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
    published_at: datetime | None = None
    achievements: list[MagazineAchievementResponse] = []
    project_links: list[MagazineProjectLinkResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
