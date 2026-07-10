import bcrypt
from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import jwt, JWTError
from pydantic import BaseModel
from app.core.config import settings

class TokenPayload(BaseModel):
    sub: str  # User ID
    role: str
    exp: datetime
    type: str  # "access" or "refresh"

def hash_password(password: str) -> str:
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    plain_bytes = plain_password.encode("utf-8")
    hashed_bytes = hashed_password.encode("utf-8")
    try:
        return bcrypt.checkpw(plain_bytes, hashed_bytes)
    except Exception:
        return False

def create_token(data: dict, expires_delta: timedelta, token_type: str) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": int(expire.timestamp()), "type": token_type})
    return jwt.encode(to_encode, settings.JWT_SECRET.get_secret_value(), algorithm=settings.JWT_ALGORITHM)

def create_access_token(user_id: str, role: str) -> str:
    return create_token(
        data={"sub": str(user_id), "role": role},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        token_type="access"
    )

def create_refresh_token(user_id: str, role: str) -> str:
    return create_token(
        data={"sub": str(user_id), "role": role},
        expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        token_type="refresh"
    )

def decode_token(token: str) -> Optional[TokenPayload]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET.get_secret_value(), algorithms=[settings.JWT_ALGORITHM])
        # jwt.decode exp can return epoch int, so Pydantic parses standard timestamp to datetime
        return TokenPayload(**payload)
    except (JWTError, Exception):
        return None
