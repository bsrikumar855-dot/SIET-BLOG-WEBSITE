from app.modules.auth.models import User
from app.shared.exceptions.custom import ForbiddenException

def check_admin(user: User) -> None:
    """Ensure the user has admin role access permissions."""
    if user.role != "admin":
        raise ForbiddenException("Administrator access required.")

def check_verified(user: User) -> None:
    """Ensure the user's email has been verified."""
    if not user.email_verified:
        raise ForbiddenException("Email verification is required.")
