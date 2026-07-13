from datetime import datetime
from typing import Optional
from sqlalchemy import String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, BaseModelMixin
from app.shared.types.content import ContentStatus

class News(Base, BaseModelMixin):
    __tablename__ = "news"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(300), unique=True, index=True, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    excerpt: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    status: Mapped[ContentStatus] = mapped_column(Enum(ContentStatus), default=ContentStatus.DRAFT, nullable=False)
    published_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    domain_id: Mapped[Optional[int]] = mapped_column(ForeignKey("domains.id"), nullable=True)
    author_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    featured_image_id: Mapped[Optional[int]] = mapped_column(ForeignKey("media.id"), nullable=True)

    # Note: relationships to domain, author, featured_image, tags will be established when needed
