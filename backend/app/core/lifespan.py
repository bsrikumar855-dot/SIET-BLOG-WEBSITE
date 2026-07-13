from contextlib import asynccontextmanager
from fastapi import FastAPI
from sqlalchemy import text
from app.core.database import engine
from app.core.logging import logger
from app.core.config import settings

from app.infrastructure.search.client import MeilisearchClient
from app.infrastructure.storage.client import R2StorageClient

meili_client = MeilisearchClient()
storage_client = R2StorageClient()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup Actions
    logger.info("Starting up SIET Portal Backend...")
    
    # Verify Database connection on start
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        logger.info("Successfully connected to database.")
    except Exception as e:
        logger.error(f"Database connection verification failed: {e}")

    yield
    
    # Shutdown Actions
    logger.info("Shutting down SIET Portal Backend...")
    await engine.dispose()
    logger.info("Database connection pool disposed.")
