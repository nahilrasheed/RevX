from fastapi import HTTPException
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
        profile_data = {
            "id": user_id,
            "username": username,
            "full_name": full_name,
            "bio": bio,
            "avatar": avatar,
        }

        res = supabase.schema("revx").table("profile").insert(profile_data).execute()

        if not res.data:
            raise HTTPException(status_code=500, detail="Failed to create user profile")
        
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating user profile: {str(e)}")