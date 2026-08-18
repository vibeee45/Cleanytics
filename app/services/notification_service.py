import logging

logger = logging.getLogger("cleanytics.notifications")


class NotificationService:
    @staticmethod
    async def send_password_reset_email(email: str, token: str) -> None:
        """Stub notification service method for password reset emails."""
        logger.info(f"[STUB EMAIL] Password reset token for {email}: {token}")
        print(f"=== [STUB EMAIL] To: {email} | Password Reset Token: {token} ===")


notification_service = NotificationService()
