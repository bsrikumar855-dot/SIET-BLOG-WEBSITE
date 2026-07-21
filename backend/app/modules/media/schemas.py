from datetime import datetime

from pydantic import BaseModel, Field

from app.shared.types.content import MediaType


class MediaBase(BaseModel):
    filename: str = Field(..., max_length=255)
    media_type: MediaType
    mime_type: str
    size_bytes: int

class MediaCreate(MediaBase):
    file_key: str
    public_url: str
    thumbnail_url: str | None = None
    uploaded_by_id: int | None = None

class MediaResponse(MediaBase):
    id: int
    file_key: str
    public_url: str
    thumbnail_url: str | None = None
    uploaded_by_id: int | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
