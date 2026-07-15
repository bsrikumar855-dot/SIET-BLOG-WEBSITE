import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.core.logging import logger
from app.core.jobs import BackgroundJobRunner
from app.infrastructure.search.client import MeilisearchClient
from app.infrastructure.storage.client import R2StorageClient

meili_client = MeilisearchClient()
storage_client = R2StorageClient()

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Application startup...")
    # Fire and forget background polling
    task = asyncio.create_task(BackgroundJobRunner.sync_search_index())
    yield
    logger.info("Application shutdown...")
    task.cancel()
