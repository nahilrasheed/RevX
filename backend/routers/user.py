from fastapi import APIRouter, HTTPException, Depends
from middleware.auth_middleware import get_current_user
from models.user import UserProfileUpdate
from services.user_service import update_user_service
from database import supabase
import json

router = APIRouter()

@router.put("/update", status_code=200)
async def update_user(
    user: UserProfileUpdate,
    current_user = Depends(get_current_user),
):
    try:
        user_id = str(current_user.user.id)
        user_data = user.model_dump(exclude_unset=True)
        update_data = await update_user_service(
            user_id=user_id,
            current_email=current_user.user.email,
            **user_data
        )

        if not update_data:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"message": "User updated successfully", "data": update_data}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating user: {str(e)}")
    

@router.get("/my_projects", status_code=200)
async def my_projects(user = Depends(get_current_user)):
    try:
        user_id = str(user.user.id)
        
        result = supabase.rpc('get_user_projects_with_images', {"user_id": user_id}).execute()
        
        projects_list = [json.loads(p) if isinstance(p, str) else p for p in result.data] if result.data else []
        
        return {
            "status": "success",
            "data": projects_list
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching projects: {str(e)}")
    
@router.get("/my_reviews", status_code=200)
async def my_reviews(user = Depends(get_current_user)):
    try:
        user_id = str(user.user.id)
        
        result = supabase.schema("revx").rpc('get_user_reviews', {"user_id": user_id}).execute()
        
        reviews_list = [json.loads(r) if isinstance(r, str) else r for r in result.data] if result.data else []
        
        return {
            "status": "success",
            "data": reviews_list
        }
    except Exception as e:
        import traceback
        print(f"Error fetching reviews: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=400, detail=f"Error fetching reviews: {str(e)}")