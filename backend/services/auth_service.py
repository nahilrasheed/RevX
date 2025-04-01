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

async def change_password_service(user_id: str, email: str, current_password: str, new_password: str) -> bool:
    try:
        # Verify current password
        try:
            auth_res = supabase.auth.sign_in_with_password({
                "email": email,
                "password": current_password
            })
            
            if not auth_res.user:
                raise HTTPException(status_code=400, detail="Current password is incorrect")
        except Exception as e:
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        
        # Update password using the user session instead of admin API
        try:
            # Using the session from sign-in to update the user's password
            supabase.auth.update_user({"password": new_password})
            return True
        except Exception as e:
            print(f"Password update error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error updating password: {str(e)}")
        
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error changing password: {str(e)}")