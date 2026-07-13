from app.infrastructure.search.client import MeilisearchClient
from app.modules.search.service import SearchService

def get_search_client() -> MeilisearchClient:
    return MeilisearchClient()

def get_search_service() -> SearchService:
    client = get_search_client()
    return SearchService(client)
