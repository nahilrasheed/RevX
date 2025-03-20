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
    
@router.get("/list", status_code=200)
async def list_projects():
    try:
        projects = supabase.schema("revx").table("projects").select("*").execute()
        return {
            "status": "success",
            "data": projects.data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error fetching projects")
    
@router.get("/get/{project_id}", status_code=200)
async def get_project(project_id: str):
    try:
        project = supabase.schema("revx").table("projects").select("*").eq("id", project_id).execute()
        contributors = supabase.schema("revx").table("contributors").select("*").eq("project_id", project_id).execute()
        reviews = supabase.schema("revx").table("reviews").select("*").eq("project_id", project_id).execute()

        data = project.data[0]
        data["contributors"] = contributors.data
        data["reviews"] = reviews.data

        print(data)

        return {
            "status": "success",
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error fetching project")