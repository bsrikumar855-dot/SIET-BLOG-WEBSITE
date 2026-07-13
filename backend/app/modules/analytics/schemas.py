from typing import Optional, List
from datetime import date
from pydantic import BaseModel
from app.shared.types.content import ContentKind

class RecordViewRequest(BaseModel):
    content_id: int
    content_kind: ContentKind

class TrendingItemResponse(BaseModel):
    content_id: int
    content_kind: ContentKind
    score: float
    
class DashboardMetricsResponse(BaseModel):
    total_views: int
    total_likes: int
    total_bookmarks: int
    top_content: List[TrendingItemResponse]
