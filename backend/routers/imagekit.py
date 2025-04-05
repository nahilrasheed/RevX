from fastapi import APIRouter
from fastapi.responses import JSONResponse
import time
import hashlib
import hmac
import os

router = APIRouter()

@router.get("/auth")
async def get_auth_params():
    # Get private key from environment variables
    private_key = os.getenv("IMAGEKIT_PRIVATE_KEY")
    
    if not private_key:
        print("ERROR: IMAGEKIT_PRIVATE_KEY not found in environment variables!")
        return JSONResponse(
            status_code=500,
            content={"error": "ImageKit private key not configured"}
        )
    
    # CRITICAL FIX: For server-side signature generation
    # ImageKit expects the string to be in this exact format: token+expire
    timestamp = int(time.time() * 1000)
    token = str(timestamp)
    expire = int(time.time()) + (30 * 60)  # 30 minutes in seconds
    
    # Create the string to sign (token + expire)
    string_to_sign = token + str(expire)
    
    # Generate signature with the correct string
    signature = hmac.new(
        bytes(private_key, 'utf-8'),
        bytes(string_to_sign, 'utf-8'),  # Use the combined string
        hashlib.sha1
    ).hexdigest()
    
    # Print for debugging
    print(f"DEBUG - String to sign: {string_to_sign}")
    print(f"DEBUG - Signature (first 10 chars): {signature[:10]}...")
    
    # Return authentication parameters
    return {
        "token": token,
        "signature": signature,
        "expire": expire
    }