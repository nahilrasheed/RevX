from fastapi import HTTPException
from database import supabase
from typing import Dict, Any, Optional
from pydantic import EmailStr

async def update_user_service(
    user_id: str,
    current_email: EmailStr,
    email: Optional[str] = None,
    password: Optional[str] = None,
    username: Optional[str] = None,
    full_name: Optional[str] = None,
    bio: Optional[str] = None,
    avatar: Optional[str] = None,
) -> Dict[str, Any]:
    try:
        current_profile = supabase.schema("revx").table("profile").select("*").eq("id", user_id).execute()

        if not current_profile.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Update profile in database
        profile_updates = {}
        if username is not None:
            username_check = supabase.schema("revx").table("profile").select("id").eq("username", username).execute()
            if username_check.data and str(username_check.data[0]["id"]) != user_id:
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

        # Update auth information if needed
        auth_update = {}   
        if email is not None:
            auth_update["email"] = email
        if password is not None:
            auth_update["password"] = password
        if auth_update:
            supabase.auth.update_user(auth_update)

        # Get updated profile
        updated_profile = supabase.schema("revx").table("profile").select("*").eq("id", user_id).single().execute()

        if not updated_profile.data:
            raise HTTPException(status_code=404, detail="User not found after update")
        
        # Create a clean response dictionary
        result = dict(updated_profile.data)
        
        # Add the email to the response (either updated or current)
        result["email"] = email if email is not None else current_email
        
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating user: {str(e)}")