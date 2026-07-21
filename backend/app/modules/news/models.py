from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base, BaseModelMixin
from app.shared.types.content import ContentStatus


class News(Base, BaseModelMixin):
    __tablename__ = "news"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(300), unique=True, index=True, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    excerpt: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    status: Mapped[ContentStatus] = mapped_column(Enum(ContentStatus), default=ContentStatus.DRAFT, nullable=False)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    domain_id: Mapped[int | None] = mapped_column(ForeignKey("domains.id"), nullable=True)
    author_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    featured_image_id: Mapped[int | None] = mapped_column(ForeignKey("media.id"), nullable=True)

    # Note: relationships to domain, author, featured_image, tags will be established when needed
