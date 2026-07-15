import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Tuple
from app.infrastructure.email.client import ResendClient
from app.infrastructure.email.templates import get_verification_html, get_reset_password_html

def generate_secure_token(expires_in_hours: int = 24) -> Tuple[str, str, datetime]:
    """Generates secure raw and hashed tokens with expiry date."""
    raw_token = secrets.token_urlsafe(32)
    hashed_token = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
    expiry_time = datetime.now(timezone.utc) + timedelta(hours=expires_in_hours)
    return raw_token, hashed_token, expiry_time

def hash_token(raw_token: str) -> str:
    """Helper to return SHA256 hashed hex digest of a token."""
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()

class EmailProvider:
    def __init__(self):
        self.client = ResendClient()
        self.from_email = "SIET Portal <onboarding@resend.dev>"

    async def send_verification_email(self, to_email: str, token: str) -> bool:
        """Asynchronously triggers verification email using provider templates."""
        verification_link = f"http://localhost:3000/verify-email?token={token}"
        from app.core.config import settings, Environment
        from app.core.logging import logger
        if settings.ENV in (Environment.development, Environment.testing) and not settings.EMAIL_API_KEY.get_secret_value():
            logger.info(f"[DEV EMAIL] Verification Link for {to_email}: {verification_link}")
            return True
        html_content = get_verification_html(verification_link)
        params = {
            "from": self.from_email,
            "to": [to_email],
            "subject": "Verify Your Email Address",
            "html": html_content
        }
        return self.client.send_email(params)

    async def send_reset_password_email(self, to_email: str, token: str) -> bool:
        """Asynchronously triggers password reset email using provider templates."""
        reset_link = f"http://localhost:3000/reset-password?token={token}"
        html_content = get_reset_password_html(reset_link)
        params = {
            "from": self.from_email,
            "to": [to_email],
            "subject": "Reset Your Password",
            "html": html_content
        }
        return self.client.send_email(params)
