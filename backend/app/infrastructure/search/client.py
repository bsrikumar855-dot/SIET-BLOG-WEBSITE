import httpx
from typing import Dict, Any, Optional, List
from app.core.config import settings
from app.core.logging import logger

class MeilisearchClient:
    def __init__(self):
        self.url = settings.MEILI_URL
        self.master_key = settings.MEILI_MASTER_KEY.get_secret_value()
        self.headers = {
            "Authorization": f"Bearer {self.master_key}",
            "Content-Type": "application/json",
        }
        self.timeout = httpx.Timeout(10.0)

    async def ping(self) -> bool:
        """Ping search engine to verify connection."""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(f"{self.url}/health", headers=self.headers)
                response.raise_for_status()
                return response.json().get("status") == "available"
        except Exception as e:
            logger.error(f"Search engine ping failed: {e}")
            return False

    async def index_document(self, index_name: str, document: Dict[str, Any]) -> bool:
        """Index a single document."""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.url}/indexes/{index_name}/documents",
                    json=[document],
                    headers=self.headers
                )
                response.raise_for_status()
                return True
        except Exception as e:
            logger.error(f"Failed to index document in {index_name}: {e}")
            return False

    async def delete_document(self, index_name: str, document_id: str) -> bool:
        """Delete a document by ID."""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.delete(
                    f"{self.url}/indexes/{index_name}/documents/{document_id}",
                    headers=self.headers
                )
                response.raise_for_status()
                return True
        except Exception as e:
            logger.error(f"Failed to delete document {document_id} from {index_name}: {e}")
            return False

    async def search(self, index_name: str, query: str, filters: Optional[str] = None, limit: int = 20, offset: int = 0) -> Dict[str, Any]:
        """Search documents in an index."""
        try:
            payload: Dict[str, Any] = {
                "q": query,
                "limit": limit,
                "offset": offset
            }
            if filters:
                payload["filter"] = filters

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.url}/indexes/{index_name}/search",
                    json=payload,
                    headers=self.headers
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            logger.error(f"Search failed for query '{query}' in {index_name}: {e}")
            return {"hits": [], "query": query, "error": str(e)}
