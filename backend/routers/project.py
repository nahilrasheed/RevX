from fastapi import APIRouter, HTTPException, Depends
from database import supabase
from models.project import ProjectCreate
from middleware.auth_middleware import get_current_user
from services.project_service import create_project_service

router = APIRouter()

@router.post("/create", status_code=201)
async def create_project(
    project: ProjectCreate,
    user = Depends(get_current_user)
):
    try:
        user_id = str(user.user.id)
        project_data = await create_project_service(
            project.title,
            project.description,
            user_id,
            project.image
        )

        return {
            "status": "success",
            "message": "Project created successfully",
            "data": project_data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error creating project")