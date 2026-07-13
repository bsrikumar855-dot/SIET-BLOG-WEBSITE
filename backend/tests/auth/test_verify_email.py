import pytest
import random
from unittest.mock import patch
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

@pytest.mark.asyncio
async def test_email_verification_flow(client: AsyncClient, db_session: AsyncSession):
    """Verify registration, token extraction, and successful email verification endpoint execution."""
    email = f"testverify_{random.randint(1000, 9999)}@siet.in"
    register_payload = {
        "name": "Verify User",
        "email": email,
        "password": "Password123"
    }

    captured_tokens = []
    async def mock_send(self, to_email: str, token: str) -> bool:
        captured_tokens.append(token)
        return True

    with patch("app.infrastructure.email.provider.EmailProvider.send_verification_email", new=mock_send):
        res = await client.post("/api/v1/auth/register", json=register_payload)
        assert res.status_code == 201

    assert len(captured_tokens) == 1
    raw_token = captured_tokens[0]

    # Verify email
    verify_payload = {"token": raw_token}
    res = await client.post("/api/v1/auth/verify-email", json=verify_payload)
    assert res.status_code == 200
    assert res.json()["success"] is True
    assert res.json()["data"] == "Email verified successfully."

    # Login and check user state is verified
    login_payload = {
        "email": email,
        "password": "Password123"
    }
    res = await client.post("/api/v1/auth/login", json=login_payload)
    assert res.json()["data"]["user"]["email_verified"] is True
