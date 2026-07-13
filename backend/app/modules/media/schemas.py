from typing import Optional
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
    thumbnail_url: Optional[str] = None
    uploaded_by_id: Optional[int] = None

class MediaResponse(MediaBase):
    id: int
    file_key: str
    public_url: str
    thumbnail_url: Optional[str] = None
    uploaded_by_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
