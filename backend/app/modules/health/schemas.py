from pydantic import BaseModel

class HealthResponse(BaseModel):
    status: str
    service: str

class DatabaseHealthResponse(BaseModel):
    status: str
    database: str

class SearchHealthResponse(BaseModel):
    status: str
    search: str

class StorageHealthResponse(BaseModel):
    status: str
    storage: str
