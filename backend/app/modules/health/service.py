from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.lifespan import meili_client, storage_client


class HealthService:
    @staticmethod
    async def get_general_health() -> dict:
        return {"status": "healthy", "service": "SIET Portal API"}

    @staticmethod
    async def get_db_health(db: AsyncSession) -> dict:
        try:
            await db.execute(text("SELECT 1"))
            return {"status": "healthy", "database": "connected"}
        except Exception as e:
            return {"status": "unhealthy", "database": f"failed: {e}"}

    @staticmethod
    async def get_search_health() -> dict:
        is_up = await meili_client.ping()
        if is_up:
            return {"status": "healthy", "search": "meilisearch connected"}
        return {"status": "unhealthy", "search": "meilisearch failed"}

    @staticmethod
    async def get_storage_health() -> dict:
        is_up = await storage_client.check_health()
        if is_up:
            return {"status": "healthy", "storage": "R2 storage connected"}
        return {"status": "unhealthy", "storage": "R2 storage failed"}
