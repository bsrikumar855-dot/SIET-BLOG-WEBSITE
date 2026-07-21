from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base, BaseModelMixin


class Tag(Base, BaseModelMixin):
    __tablename__ = "tags"

    name: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(75), unique=True, index=True, nullable=False)

    # Relationships to be added when content modules are implemented (e.g. Many-to-Many)
