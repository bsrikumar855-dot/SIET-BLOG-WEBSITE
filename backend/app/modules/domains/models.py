from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, BaseModelMixin

class Domain(Base, BaseModelMixin):
    __tablename__ = "domains"

    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(150), unique=True, index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)

    # Relationships to be added later when other modules are implemented
    # articles = relationship("Article", back_populates="domain")
    # news = relationship("News", back_populates="domain")
