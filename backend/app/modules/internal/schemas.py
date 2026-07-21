from pydantic import BaseModel


class InternalActionResponse(BaseModel):
    status: str
    message: str
