import os
from functools import lru_cache

import httpx
from fastapi import Header, HTTPException
from supabase import create_client


def get_supabase_url() -> str:
    return (os.getenv("SUPABASE_URL") or "").rstrip("/")


def get_service_role_key() -> str:
    return os.getenv("SUPABASE_SERVICE_ROLE_KEY") or ""


@lru_cache
def get_admin_supabase():
    url = get_supabase_url()
    key = get_service_role_key()
    if not url or not key:
        raise HTTPException(
            status_code=503,
            detail="Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
        )
    return create_client(url, key)


async def get_authenticated_user(authorization: str | None = Header(default=None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required.")

    token = authorization.removeprefix("Bearer ").strip()
    url = get_supabase_url()
    service_key = get_service_role_key()
    if not url or not service_key:
        raise HTTPException(status_code=503, detail="Supabase authentication is not configured.")

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(
                f"{url}/auth/v1/user",
                headers={
                    "Authorization": f"Bearer {token}",
                    "apikey": service_key,
                },
            )
    except httpx.RequestError as exc:
        raise HTTPException(status_code=503, detail="Unable to verify the Supabase session.") from exc

    if response.status_code == 401:
        raise HTTPException(status_code=401, detail="Your session is invalid or has expired.")
    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Unable to authenticate the request.")

    user = response.json()
    if not user.get("id"):
        raise HTTPException(status_code=401, detail="Unable to identify the authenticated user.")
    return user
