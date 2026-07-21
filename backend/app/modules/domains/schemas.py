from datetime import datetime

from pydantic import BaseModel, Field


class DomainBase(BaseModel):
    name: str = Field(..., max_length=100)
    description: str | None = None

class DomainCreate(DomainBase):
    pass

class DomainUpdate(BaseModel):
    name: str | None = Field(None, max_length=100)
    description: str | None = None

class DomainResponse(DomainBase):
    id: int
    slug: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
