import resend
from app.core.config import settings
from app.core.logging import logger

class ResendClient:
    def __init__(self):
        api_key = settings.EMAIL_API_KEY.get_secret_value()
        if api_key:
            resend.api_key = api_key
        self.enabled = bool(api_key)

    def send_email(self, params: dict) -> bool:
        if not self.enabled:
            logger.info(f"[Email Client Disabled] Dry run email to {params.get('to')}")
            return True
        try:
            resend.Emails.send(params)
            return True
        except Exception as e:
            logger.error(f"Failed to send email via Resend: {e}")
            return False
