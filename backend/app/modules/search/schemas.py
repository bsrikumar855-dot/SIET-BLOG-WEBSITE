
from pydantic import BaseModel


class SearchQuery(BaseModel):
    query: str
    limit: int = 20
    offset: int = 0
    domain_id: int | None = None
    tag_id: int | None = None

class SearchResultHit(BaseModel):
    id: str
    title: str
    excerpt: str
    content_kind: str
    slug: str
    url: str

class SearchResponse(BaseModel):
    query: str
    hits: list[SearchResultHit]
    total_hits: int
    processing_time_ms: int
