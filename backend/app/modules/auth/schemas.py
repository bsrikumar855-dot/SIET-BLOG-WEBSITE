from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.shared.validators.common import (
    validate_email_format,
    validate_password_strength,
)


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: EmailStr) -> EmailStr:
        validate_email_format(str(v))
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        validate_password_strength(v)
        return v

from pydantic import ConfigDict


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr
    role: str
    email_verified: bool
    created_at: datetime
    updated_at: datetime

class RegisterResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    email_verified: bool

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginUser(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr
    role: str
    email_verified: bool

class LoginResponse(BaseModel):
    access_token: str
    user: LoginUser

class RefreshResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, v: str) -> str:
        validate_password_strength(v)
        return v

class VerifyEmailRequest(BaseModel):
    token: str
