from fastapi import APIRouter, HTTPException, Depends
from middleware.auth_middleware import get_current_user
from models.user import UserProfileUpdate
from services.user_service import update_user_service
from database import supabase

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
        
        projects_result = supabase.schema("revx").table("projects").select("*").eq("owner_id", user_id).execute()
        
        if not projects_result.data:
            return {
                "status": "success",
                "data": []
            }
        
        projects_with_images = []
        
        for project in projects_result.data:
            project_id = project["id"]
            
            images_result = supabase.schema("revx").table("project_images").select("image_link").eq("project_id", project_id).execute()
            
            project_with_images = {**project}
            project_with_images["images"] = [img["image_link"] for img in images_result.data] if images_result.data else []
            
            projects_with_images.append(project_with_images)
        
        return {
            "status": "success",
            "data": projects_with_images
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching projects: {str(e)}")