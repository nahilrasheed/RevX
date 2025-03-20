from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database import supabase

security = HTTPBearer()

async def verify_token(
        credentials: HTTPAuthorizationCredentials = Depends(security)
    ):
    token = credentials.credentials
    try:
        user = supabase.auth.get_user(token)
        return user
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
async def get_current_user(user = Depends(verify_token)):
    return user