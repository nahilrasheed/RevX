from fastapi import APIRouter, HTTPException, Depends
from database import supabase
from middleware.auth_middleware import get_current_user

router = APIRouter()

@router.post("/update", status_code=200)
async def update_user(
    user = Depends(get_current_user),
):
    pass

