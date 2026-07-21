from sqlalchemy import Date, Enum, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base, BaseModelMixin
from app.shared.types.content import ContentKind


class PageView(Base, BaseModelMixin):
    __tablename__ = "page_views"

    content_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    content_kind: Mapped[ContentKind] = mapped_column(Enum(ContentKind), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

class TrendingMetric(Base, BaseModelMixin):
    __tablename__ = "trending_metrics"

    content_id: Mapped[int] = mapped_column(Integer, nullable=False)
    content_kind: Mapped[ContentKind] = mapped_column(Enum(ContentKind), nullable=False)
    score: Mapped[float] = mapped_column(Integer, default=0.0)
    calculated_date: Mapped[Date] = mapped_column(Date, nullable=False, index=True)
