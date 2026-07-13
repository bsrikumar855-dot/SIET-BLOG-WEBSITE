from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Text, DateTime, ForeignKey, Enum, Integer, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, BaseModelMixin
from app.shared.types.content import ContentStatus, MagazineType

class Magazine(Base, BaseModelMixin):
    __tablename__ = "magazines"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(300), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    magazine_type: Mapped[MagazineType] = mapped_column(Enum(MagazineType), nullable=False)
    publication_year: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    
    status: Mapped[ContentStatus] = mapped_column(Enum(ContentStatus), default=ContentStatus.DRAFT, nullable=False)
    published_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    cover_image_id: Mapped[Optional[int]] = mapped_column(ForeignKey("media.id"), nullable=True)
    pdf_file_id: Mapped[Optional[int]] = mapped_column(ForeignKey("media.id"), nullable=True)
    
    # Relationships
    achievements: Mapped[List["MagazineAchievement"]] = relationship(back_populates="magazine", cascade="all, delete-orphan")
    project_links: Mapped[List["MagazineProjectLink"]] = relationship(back_populates="magazine", cascade="all, delete-orphan")

class MagazineAchievement(Base, BaseModelMixin):
    __tablename__ = "magazine_achievements"
    
    magazine_id: Mapped[int] = mapped_column(ForeignKey("magazines.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    magazine: Mapped["Magazine"] = relationship(back_populates="achievements")

class MagazineProjectLink(Base, BaseModelMixin):
    __tablename__ = "magazine_project_links"
    
    magazine_id: Mapped[int] = mapped_column(ForeignKey("magazines.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    
    magazine: Mapped["Magazine"] = relationship(back_populates="project_links")
