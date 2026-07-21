from sqlalchemy import Enum, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base, BaseModelMixin
from app.shared.types.content import MediaType


class Media(Base, BaseModelMixin):
    __tablename__ = "media"

    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    file_key: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    media_type: Mapped[MediaType] = mapped_column(Enum(MediaType), nullable=False)
    mime_type: Mapped[str] = mapped_column(String(100), nullable=False)
    size_bytes: Mapped[int] = mapped_column(Integer, nullable=False)
    
    # Thumbnail URL or placeholder string (e.g., base64 tiny placeholder)
    thumbnail_url: Mapped[str] = mapped_column(String(500), nullable=True)
    
    # Pre-calculated public url
    public_url: Mapped[str] = mapped_column(String(500), nullable=False)
    
    # Uploaded by could link to users in future
    uploaded_by_id: Mapped[int] = mapped_column(Integer, nullable=True)
