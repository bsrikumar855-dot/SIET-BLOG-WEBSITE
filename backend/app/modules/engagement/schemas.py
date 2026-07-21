
from pydantic import BaseModel

from app.shared.types.content import ContentKind


class EngagementToggle(BaseModel):
    content_id: int
    content_kind: ContentKind

class EngagementStatus(BaseModel):
    content_id: int
    content_kind: ContentKind
    is_liked: bool
    is_bookmarked: bool
    total_likes: int | None = None

class ToggleResponse(BaseModel):
    status: bool
    message: str
