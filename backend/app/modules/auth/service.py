from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.auth.models import User
from app.modules.auth.repository import UserRepository
from app.modules.auth.schemas import RegisterRequest, LoginRequest, ResetPasswordRequest
from app.shared.exceptions.custom import ConflictException, UnauthorizedException, NotFoundException
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from app.infrastructure.email.provider import EmailProvider, generate_secure_token, hash_token

class AuthService:
    def __init__(self, db: AsyncSession):
        self.repo = UserRepository(db)
        self.email_provider = EmailProvider()

    async def register(self, data: RegisterRequest) -> User:
        if await self.repo.exists(data.email):
            raise ConflictException("Email already registered.")
        
        raw_token, hashed_token, expiry = generate_secure_token(expires_in_hours=24)
        
        user = User(
            name=data.name,
            email=data.email,
            password_hash=hash_password(data.password),
            role="user",
            email_verified=False,
            verification_token_hash=hashed_token,
            verification_token_expiry=expiry
        )
        created_user = await self.repo.create(user)
        
        # Trigger email verification asynchronously/proactively
        await self.email_provider.send_verification_email(user.email, raw_token)
        return created_user

    async def login(self, data: LoginRequest) -> tuple[str, str, User]:
        user = await self.repo.get_by_email(data.email)
        if not user or not verify_password(data.password, user.password_hash):
            raise UnauthorizedException("Invalid email or password.")
        
        access_token = create_access_token(user.id, user.role)
        refresh_token = create_refresh_token(user.id, user.role)
        
        return access_token, refresh_token, user

    async def refresh(self, refresh_token: str) -> str:
        payload = decode_token(refresh_token)
        if not payload or payload.type != "refresh":
            raise UnauthorizedException("Invalid or expired refresh token.")
        
        user = await self.repo.get_by_id(int(payload.sub))
        if not user:
            raise UnauthorizedException("User not found.")
        
        return create_access_token(user.id, user.role)

    async def verify_email(self, token: str) -> None:
        hashed = hash_token(token)
        user = await self.repo.get_by_verification_token(hashed)
        if not user or not user.verification_token_expiry:
            raise UnauthorizedException("Invalid verification token.")
        
        # Check expiry
        if user.verification_token_expiry.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
            raise UnauthorizedException("Verification token has expired.")
        
        user.email_verified = True
        user.verification_token_hash = None
        user.verification_token_expiry = None
        await self.repo.update(user)

    async def resend_verification(self, email: str) -> None:
        user = await self.repo.get_by_email(email)
        if not user:
            raise NotFoundException("User not found.")
        if user.email_verified:
            raise ConflictException("Email is already verified.")
        
        raw_token, hashed_token, expiry = generate_secure_token(expires_in_hours=24)
        user.verification_token_hash = hashed_token
        user.verification_token_expiry = expiry
        await self.repo.update(user)
        await self.email_provider.send_verification_email(user.email, raw_token)

    async def forgot_password(self, email: str) -> None:
        user = await self.repo.get_by_email(email)
        if not user:
            # Silence user existence check for security
            return
        
        raw_token, hashed_token, expiry = generate_secure_token(expires_in_hours=2)
        user.reset_token_hash = hashed_token
        user.reset_token_expiry = expiry
        await self.repo.update(user)
        await self.email_provider.send_reset_password_email(user.email, raw_token)

    async def reset_password(self, data: ResetPasswordRequest) -> None:
        hashed = hash_token(data.token)
        user = await self.repo.get_by_reset_token(hashed)
        if not user or not user.reset_token_expiry:
            raise UnauthorizedException("Invalid reset token.")
        
        if user.reset_token_expiry.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
            raise UnauthorizedException("Reset token has expired.")
        
        user.password_hash = hash_password(data.new_password)
        user.reset_token_hash = None
        user.reset_token_expiry = None
        await self.repo.update(user)
