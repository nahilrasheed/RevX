from fastapi import APIRouter, HTTPException
from database import supabase
from models.user import UserCreate
from services.auth_service import create_user_profile

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
            "auth_token": auth_res.access_token,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
