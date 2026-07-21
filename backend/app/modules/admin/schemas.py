from datetime import datetime
from typing import Any

from pydantic import BaseModel, EmailStr, Field

from app.modules.articles.schemas import ArticleCreate, ArticleUpdate
from app.modules.magazine.schemas import MagazineCreate, MagazineUpdate
from app.modules.news.schemas import NewsCreate, NewsUpdate
from app.shared.types.content import ContentStatus


class AdminNewsCreate(NewsCreate):
    status: ContentStatus = ContentStatus.DRAFT

class AdminNewsUpdate(NewsUpdate):
    status: ContentStatus | None = None

class AdminArticleCreate(ArticleCreate):
    status: ContentStatus = ContentStatus.DRAFT

class AdminArticleUpdate(ArticleUpdate):
    status: ContentStatus | None = None

class AdminMagazineCreate(MagazineCreate):
    status: ContentStatus = ContentStatus.DRAFT

class AdminMagazineUpdate(MagazineUpdate):
    status: ContentStatus | None = None

class AdminUserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str
    role: str = "admin"
    email_verified: bool = True

class AdminUserUpdate(BaseModel):
    name: str | None = Field(None, min_length=2, max_length=100)
    email: EmailStr | None = None
    role: str | None = None
    email_verified: bool | None = None

class DashboardTotals(BaseModel):
    users: int
    news: int
    articles: int
    magazines: int

class DashboardActivity(BaseModel):
    id: int
    type: str
    title: str
    created_at: datetime

class DashboardResponse(BaseModel):
    totals: DashboardTotals
    recentActivity: list[DashboardActivity]

class AnalyticsResponse(BaseModel):
    views: list[dict[str, Any]]
    topContent: list[dict[str, Any]]
    likesOverTime: list[dict[str, Any]]
