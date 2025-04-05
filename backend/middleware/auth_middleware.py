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

async def get_admin_user(user = Depends(get_current_user)):
    try:
        user_id = str(user.user.id)
        profile = supabase.schema("revx").table("profile").select("is_admin").eq("id", user_id).single().execute()
        
        if not profile.data or not profile.data.get("is_admin"):
            raise HTTPException(
                status_code=403,
                detail="Admin access required",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error verifying admin status: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )