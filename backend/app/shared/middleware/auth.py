from starlette.types import ASGIApp, Scope, Receive, Send
from app.core.security import decode_token

class AuthenticationMiddleware:
    def __init__(self, app: ASGIApp):
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] not in ("http", "websocket"):
            await self.app(scope, receive, send)
            return

        scope.setdefault("state", {})
        scope["state"]["user"] = None
        scope["state"]["role"] = None

        auth_header = None
        for key, value in scope.get("headers", []):
            if key == b"authorization":
                auth_header = value.decode("utf-8")
                break

        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            payload = decode_token(token)
            if payload and payload.type == "access":
                scope["state"]["user"] = payload.sub
                scope["state"]["role"] = payload.role

        await self.app(scope, receive, send)
