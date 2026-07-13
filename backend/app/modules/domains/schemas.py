from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field

class DomainBase(BaseModel):
    name: str = Field(..., max_length=100)
    description: Optional[str] = None

class DomainCreate(DomainBase):
    pass

class DomainUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None

class DomainResponse(DomainBase):
    id: int
    slug: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
