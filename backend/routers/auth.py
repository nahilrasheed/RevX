from fastapi import APIRouter, HTTPException, Depends
from database import supabase
from models.user import UserCreate, UserLogin
from services.auth_service import create_user_profile, get_user_profile

router = APIRouter()

@router.post("/register", status_code=201)
async def register_user(user: UserCreate):
    try:
        auth_res = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password
        })

        if auth_res.user is None:
            raise HTTPException(status_code=400, detail="Registration failed")
        
        profile = await create_user_profile(
            auth_res.user.id,
            user.username,
            user.full_name,
            user.bio,
            user.avatar
        )

        profile_data = {**profile, "email": user.email}

        return {
            "status": "success",
            "message": "User registered successfully",
            "data": profile_data,
            "auth_token": auth_res.session.access_token,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.post("/login", status_code=200)
async def login_user(user: UserLogin):
    try:
        auth_res = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })

        if auth_res.user is None:
            raise HTTPException(status_code=400, detail="Invalid email or password")
        
        try:
            profile = supabase.table("revx.profile").select("*").eq("id", auth_res.user.id).single().execute()

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
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.post("/logout", status_code=200)
async def logout_user(
        curr_user = Depends(get_user_profile)
    ):
    try:
        supabase.auth.sign_out(curr_user["access_token"])
        return {
            "status": "success",
            "message": "User logged out successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error logging out user: {str(e)}"
        )
