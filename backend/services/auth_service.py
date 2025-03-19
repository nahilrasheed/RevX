from fastapi import HTTPException, Header
from database import supabase
from typing import Dict, Any

async def create_user_profile(
        user_id: str,
        username: str,
        full_name: str,
        bio: str = None,
        avatar: str = None,
    ) -> Dict[str, Any]:

    try:    
        print("user_id", user_id)
        profile_data = {
            "id": user_id,
            "username": username,
            "full_name": full_name,
            "bio": bio,
            "avatar": avatar,
        }

        print("profile_data", profile_data)

        res = supabase.schema("revx").table("profile").insert(profile_data).execute()

        if not res.data:
            raise HTTPException(status_code=500, detail="Failed to create user profile")
        
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating user profile: {str(e)}")
    
async def get_user_profile(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Unauthorized"
        )
    
    token = authorization.replace("Bearer ", "")

    try:
        user = supabase.auth.get_user(token)
        return user
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )