from sqlalchemy import Enum, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base, BaseModelMixin
from app.shared.types.content import ContentKind


class Like(Base, BaseModelMixin):
    __tablename__ = "likes"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    content_id: Mapped[int] = mapped_column(Integer, nullable=False)
    content_kind: Mapped[ContentKind] = mapped_column(Enum(ContentKind), nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "content_id", "content_kind", name="uq_user_like"),
    )

class Bookmark(Base, BaseModelMixin):
    __tablename__ = "bookmarks"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    content_id: Mapped[int] = mapped_column(Integer, nullable=False)
    content_kind: Mapped[ContentKind] = mapped_column(Enum(ContentKind), nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "content_id", "content_kind", name="uq_user_bookmark"),
    )
