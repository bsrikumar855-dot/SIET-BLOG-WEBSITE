from starlette.datastructures import Headers
from starlette.types import ASGIApp, Receive, Scope, Send

from app.core.config import settings
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

        headers = Headers(scope=scope)
        auth_header = headers.get("authorization")

        token = None
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        elif headers.get("cookie"):
            for chunk in headers["cookie"].split(";"):
                name, _, value = chunk.strip().partition("=")
                if name == settings.ACCESS_COOKIE_NAME:
                    token = value
                    break

        if token:
            payload = decode_token(token)
            if payload and payload.type == "access":
                scope["state"]["user"] = payload.sub
                scope["state"]["role"] = payload.role

        await self.app(scope, receive, send)
