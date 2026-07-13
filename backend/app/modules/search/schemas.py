from typing import List, Optional
from pydantic import BaseModel

class SearchQuery(BaseModel):
    query: str
    limit: int = 20
    offset: int = 0
    domain_id: Optional[int] = None
    tag_id: Optional[int] = None

class SearchResultHit(BaseModel):
    id: str
    title: str
    excerpt: str
    content_kind: str
    slug: str
    url: str

class SearchResponse(BaseModel):
    query: str
    hits: List[SearchResultHit]
    total_hits: int
    processing_time_ms: int
