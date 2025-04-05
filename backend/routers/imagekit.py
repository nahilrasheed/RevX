import uuid
import time
import hashlib
import hmac
import os
from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/auth")
async def get_auth_params():
    private_key = os.getenv("IMAGEKIT_PRIVATE_KEY")
    if not private_key:
        return JSONResponse(
            status_code=500,
            content={"error": "ImageKit private key not configured"}
        )

    # 1. Generate a random token with UUID
    token = str(uuid.uuid4())  # Instead of int(time.time() * 1000)

    # 2. Calculate an expiry time in seconds (e.g. 30 mins from now)
    expire = int(time.time()) + (30 * 60)

    # 3. Create the string to sign: token + expire
    string_to_sign = token + str(expire)

    # 4. Hash the string with your private key
    signature = hmac.new(
        bytes(private_key, 'utf-8'),
        bytes(string_to_sign, 'utf-8'),
        hashlib.sha1
    ).hexdigest()

    return {
        "token": token,
        "signature": signature,
        "expire": expire
    }