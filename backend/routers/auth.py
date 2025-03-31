from fastapi import APIRouter, HTTPException, Depends
from database import supabase
from models.user import UserCreate, UserLogin
from services.auth_service import create_user_profile
from middleware.auth_middleware import get_current_user
import base64

router = APIRouter()

@router.post("/register", status_code=201)
async def register_user(user: UserCreate):
    try:
        if not user.email:
            raise HTTPException(status_code=400, detail="Email is required")
        if not user.password:
            raise HTTPException(status_code=400, detail="Password is required")
        if not user.username:
            raise HTTPException(status_code=400, detail="Username is required")
        if not user.full_name:
            raise HTTPException(status_code=400, detail="Full name is required")

        username_exist_check = supabase.schema("revx").table("profile").select("username").eq("username", user.username).execute()
        if username_exist_check.data:
            raise HTTPException(status_code=400, detail="User with this username already exists")

        auth_res = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password
        })

        if auth_res.user is None:
            raise HTTPException(status_code=400, detail="Registration failed")
        
        try:
            if user.avatar:
                avatar_data = base64.b64decode(user.avatar)
            else:
                avatar_data = None

            profile = await create_user_profile(
                auth_res.user.id,
                user.username,
                user.full_name,
                user.bio,
                avatar_data
            )

            profile_data = {**profile, "email": user.email}

            return {
                "status": "success",
                "message": "User registered successfully",
                "data": profile_data,
                "auth_token": auth_res.session.access_token,
            }
        except Exception as profile_err:
            supabase.auth.admin.delete_user(auth_res.user.id)
            raise HTTPException(
                status_code=400,
                detail=f"Error creating user profile: {str(profile_err)}"
            )
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.post("/login", status_code=200)
async def login_user(user: UserLogin):
    try:
        if not user.email:
            raise HTTPException(status_code=400, detail="Email is required")
        if not user.password:
            raise HTTPException(status_code=400, detail="Password is required")

        auth_res = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })

        if auth_res.user is None:
            raise HTTPException(status_code=400, detail="Invalid email or password")
        
        try:
            profile = supabase.schema("revx").table("profile").select("*").eq("id", auth_res.user.id).single().execute()

            if not profile.data:
                raise HTTPException(
                    status_code=400,
                    detail="Profile not found for the user"
                )
            
            profile_data = {
                **profile.data,
                "email": auth_res.user.email,
            }

            return {
                "status": "success",
                "message": "User logged in successfully",
                "data": profile_data,
                "auth_token": auth_res.session.access_token,
            }
        except Exception as profile_err:
            raise HTTPException(
                status_code=400,
                detail=f"Error fetching user profile: {str(profile_err)}"
            )
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/logout", status_code=200)
async def logout_user(current_user = Depends(get_current_user)):
    try:
        auth_res = supabase.auth.sign_out()

        return {
            "status": "success",
            "message": "User logged out successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error logging out user: {str(e)}"
        )