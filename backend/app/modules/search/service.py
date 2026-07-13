from typing import Any
from app.infrastructure.search.client import MeilisearchClient
from app.modules.search.schemas import SearchQuery, SearchResponse, SearchResultHit

class SearchService:
    def __init__(self, search_client: MeilisearchClient):
        self.search_client = search_client
        self.index_name = "siet_content"

    async def search(self, payload: SearchQuery) -> SearchResponse:
        filters = []
        if payload.domain_id:
            filters.append(f"domain_id = {payload.domain_id}")
        if payload.tag_id:
            filters.append(f"tag_ids = {payload.tag_id}")
            
        filter_str = " AND ".join(filters) if filters else None

        raw_result = await self.search_client.search(
            index_name=self.index_name,
            query=payload.query,
            filters=filter_str,
            limit=payload.limit,
            offset=payload.offset
        )

        hits = []
        for hit in raw_result.get("hits", []):
            hits.append(
                SearchResultHit(
                    id=str(hit.get("id")),
                    title=hit.get("title", ""),
                    excerpt=hit.get("excerpt", ""),
                    content_kind=hit.get("content_kind", "unknown"),
                    slug=hit.get("slug", ""),
                    url=hit.get("url", "")
                )
            )

        return SearchResponse(
            query=payload.query,
            hits=hits,
            total_hits=raw_result.get("estimatedTotalHits", len(hits)),
            processing_time_ms=raw_result.get("processingTimeMs", 0)
        )
