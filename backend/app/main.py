from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.lifespan import lifespan
from app.shared.middleware.request_id import RequestIDMiddleware
from app.shared.middleware.auth import AuthenticationMiddleware
from app.shared.middleware.audit import AuditMiddleware
from app.shared.exceptions.handlers import register_exception_handlers
from app.modules.auth.router import router as auth_router
from app.modules.health.router import router as health_router
from app.modules.internal.router import router as internal_router

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for SIET News, Articles, and Magazine Portal.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Middleware registry (FastAPI runs middlewares top-to-bottom for request, bottom-to-top for response)
app.add_middleware(AuditMiddleware)
app.add_middleware(AuthenticationMiddleware)
app.add_middleware(RequestIDMiddleware)

# Configure CORS
origins = settings.ALLOWED_ORIGINS
if isinstance(origins, str):
    origins = [o.strip() for o in origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register custom exception mappings
register_exception_handlers(app)

# Mount slice routers under API prefix
app.include_router(auth_router, prefix=settings.API_PREFIX)
app.include_router(health_router, prefix=settings.API_PREFIX)
app.include_router(internal_router, prefix=settings.API_PREFIX)
