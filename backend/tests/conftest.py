import asyncio
import os
import pytest
import pytest_asyncio
from typing import AsyncGenerator
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

# Force testing environment configuration globally for test runs
os.environ["ENV"] = "testing"

from app.main import app
from app.core.database import get_db, async_session_maker

@pytest.fixture(scope="session")
def event_loop():
    """Create session-wide event loop for running async tests."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest_asyncio.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Provides a transactional database session rolled back after test completion."""
    async with async_session_maker() as session:
        await session.begin()
        try:
            yield session
        finally:
            await session.rollback()

@pytest_asyncio.fixture(scope="function")
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """HTTP client yielding requests with overridden DB session injections."""
    async def _override_get_db() -> AsyncGenerator[AsyncSession, None]:
        yield db_session

    app.dependency_overrides[get_db] = _override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()
