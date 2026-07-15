from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.shared.types.content import ContentStatus
from app.modules.news.schemas import NewsCreate, NewsUpdate
from app.modules.articles.schemas import ArticleCreate, ArticleUpdate
from app.modules.magazine.schemas import MagazineCreate, MagazineUpdate
from app.modules.domains.schemas import DomainCreate, DomainUpdate
from app.modules.tags.schemas import TagCreate, TagUpdate

class AdminNewsCreate(NewsCreate):
    status: ContentStatus = ContentStatus.DRAFT

class AdminNewsUpdate(NewsUpdate):
    status: Optional[ContentStatus] = None

class AdminArticleCreate(ArticleCreate):
    status: ContentStatus = ContentStatus.DRAFT

class AdminArticleUpdate(ArticleUpdate):
    status: Optional[ContentStatus] = None

class AdminMagazineCreate(MagazineCreate):
    status: ContentStatus = ContentStatus.DRAFT

class AdminMagazineUpdate(MagazineUpdate):
    status: Optional[ContentStatus] = None

class AdminUserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str
    role: str = "admin"
    email_verified: bool = True

class AdminUserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    email_verified: Optional[bool] = None

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
    recentActivity: List[DashboardActivity]

class AnalyticsResponse(BaseModel):
    views: List[Dict[str, Any]]
    topContent: List[Dict[str, Any]]
    likesOverTime: List[Dict[str, Any]]
