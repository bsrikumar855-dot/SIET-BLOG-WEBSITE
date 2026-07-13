from datetime import datetime, timezone
from typing import AsyncGenerator
from sqlalchemy import DateTime
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.pool import NullPool
from app.core.config import settings, Environment

# Environment-aware engine configuration
if settings.ENV == Environment.testing:
    engine_kwargs = {"poolclass": NullPool}
else:
    engine_kwargs = {
        "pool_size": settings.POSTGRES_POOL_SIZE,
        "max_overflow": settings.POSTGRES_MAX_OVERFLOW,
        "pool_recycle": 3600,
        "pool_pre_ping": True,
    }

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True,
    **engine_kwargs
)

async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

class Base(DeclarativeBase):
    pass

class BaseModelMixin:
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), 
        nullable=True
    )
    version: Mapped[int] = mapped_column(
        default=1,
        server_default="1",
        nullable=False
    )

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()
