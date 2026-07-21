# Re-exporting authentication dependencies from shared auth package
from app.shared.auth.dependencies import (
    get_current_user as get_current_user,
)
from app.shared.auth.dependencies import (
    require_admin as require_admin,
)
from app.shared.auth.dependencies import (
    require_verified_email as require_verified_email,
)
