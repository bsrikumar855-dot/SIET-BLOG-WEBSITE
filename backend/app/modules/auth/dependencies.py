# Re-exporting authentication dependencies from shared auth package
from app.shared.auth.dependencies import get_current_user, require_admin, require_verified_email
