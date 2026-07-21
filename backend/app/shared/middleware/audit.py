import time

from starlette.types import ASGIApp, Receive, Scope, Send

from app.core.logging import logger


class AuditMiddleware:
    def __init__(self, app: ASGIApp):
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        start_time = time.time()
        status_code = [500]

        async def send_wrapper(message) -> None:
            if message["type"] == "http.response.start":
                status_code[0] = message.get("status", 200)
            await send(message)

        try:
            await self.app(scope, receive, send_wrapper)
        finally:
            duration = time.time() - start_time
            state = scope.get("state", {})
            user = state.get("user") or "anonymous"
            role = state.get("role") or "none"
            method = scope.get("method", "UNKNOWN")
            path = scope.get("path", "UNKNOWN")
            client = scope.get("client")
            ip = client[0] if client else "unknown"

            logger.info(
                f"Audit Log: method={method} path={path} "
                f"status={status_code[0]} duration={duration:.4f}s "
                f"user={user} role={role} ip={ip}"
            )
