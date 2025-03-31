from fastapi import HTTPException
from database import supabase
from typing import Dict, Any, Optional

async def update_user_service(
    user_id: str,
    email: Optional[str] = None,
    password: Optional[str] = None,
    username: Optional[str] = None,
    full_name: Optional[str] = None,
    bio: Optional[str] = None,
    avatar: Optional[str] = None
) -> Dict[str, Any]:
    try:
        current_profile = supabase.schema("revx").table("profile").select("*").eq("id", user_id).execute()

        if not current_profile.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        profile_updates = {}

        if username is not None:
            username_check = supabase.schema("revx").table("profile").select("id").eq("username", username).execute()
            if username_check.data:
                raise HTTPException(status_code=400, detail="Username already taken")
            
            profile_updates["username"] = username

        if full_name is not None:
            profile_updates["full_name"] = full_name

        if bio is not None:
            profile_updates["bio"] = bio

        if avatar is not None:
            profile_updates["avatar"] = avatar

        if profile_updates:
            supabase.schema("revx").table("profile").update(profile_updates).eq("id", user_id).execute()

        auth_update = {}   
        if email is not None:
            auth_update["email"] = email
        if password is not None:
            auth_update["password"] = password
        if auth_update:
            supabase.auth.update_user(auth_update)

        updated_profile = supabase.schema("revx").table("profile").select("*").eq("id", user_id).execute()

        if not updated_profile.data:
            raise HTTPException(status_code=404, detail="User not found after update")
        
        return updated_profile.data[0]
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating user: {str(e)}")