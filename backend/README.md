# SIET News / Articles / Magazine Portal Backend - Phase-1

This repository contains the backend implementation for the SIET News / Articles / Magazine Portal. It is structured using Clean Architecture and Vertical-Slice Architecture principles.

---

## Tech Stack
- **FastAPI**: Main web framework.
- **SQLAlchemy (Async)**: Asynchronous ORM.
- **Alembic**: Database migrations.
- **PostgreSQL**: Primary SQL Database.
- **Meilisearch**: Async search indexer (placeholder integration).
- **Nginx**: Front-facing reverse proxy.
- **Pydantic v2**: Data validation and settings management.
- **Docker & Docker Compose**: Orchestrated local container runtime.

---

## Project Structure
The project uses a clean Vertical-Slice architecture layout:
```
app/
├── core/             # Application lifecycle, config, DB engine, logging, security
├── shared/           # Common middleware, pagination utility, custom responses, errors, base repository, base validators
├── infrastructure/   # Interface abstractions (email provider using Resend, storage, search)
└── modules/          # Vertical slices (auth, health, internal logic)
    ├── auth/         # Complete Authentication flow (router, service, repository, models, schemas)
    ├── health/       # Health checks for system resources (DB, storage, search)
    └── internal/     # Admin cache revalidation, news fetching, and index rebuilding
```

---

## Architecture & Communication Rules
- **Vertical slices**: Each module boundary contains all layers (Router, Service, Repository, Models, Schemas) necessary to fulfill its domain.
- **Layering constraints**:
  - `Router` calls `Service` only. Router never directly queries the database.
  - `Service` executes domain business logic and calls `Repository` or other domain services.
  - `Repository` executes database query operations. A repository never calls another repository.
  - Cross-module communication always routes through another module's `Service` dependency.

---

## Setup & Running Locally

### 1. Requirements
Ensure you have Docker and Python 3.11+ installed.

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run with Docker Compose
To build and run all services (FastAPI, Postgres, Meilisearch, Nginx):
```bash
docker-compose up --build
```
The application will be served at `http://localhost/` through Nginx. FastAPI interactive docs (Swagger) will be available at `http://localhost/docs`.

### 4. Database Migrations
Migrations run inside/against the DB using Alembic. Apply migrations with:
```bash
# Locally:
pip install -r requirements.txt
alembic upgrade head
```

### 5. Running Tests
Run testing suite using:
```bash
python -m pytest tests -v
```

---

## Authentication Flow
1. **User Registration**: `POST /auth/register`. Hashes the password, generates a secure verification token, saves the user profile, and triggers a verification email.
2. **Email Verification**: `POST /auth/verify-email`. Validates the token and sets `email_verified` status to true.
3. **User Login**: `POST /auth/login`. Authenticates credentials, returns `access_token` and `refresh_token` in the response body, and sets secure `HTTPOnly` cookies in the client.
4. **Token Refresh**: `POST /auth/refresh`. Decodes the refresh token (from query or cookies) and issues a new access token.
5. **Get Profile**: `GET /auth/me`. Injects the current authenticated user context.
6. **User Logout**: `POST /auth/logout`. Clears access and refresh token cookies.
