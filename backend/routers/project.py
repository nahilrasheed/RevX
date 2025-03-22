from fastapi import APIRouter, HTTPException, Depends
from database import supabase
from models.project import ProjectCreate, ContributorCreate, ReviewCreate
from middleware.auth_middleware import get_current_user
from services.project_service import create_project_service, add_contributor_service, add_review_service

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
    
@router.post("/add_contributor/{project_id}", status_code=201)
async def add_contributor(
    project_id: str,
    contributor: ContributorCreate,
    author = Depends(get_current_user)
):
    try:
        if author.user.id == contributor.contributor_id:
            raise HTTPException(status_code=400, detail="You cannot add yourself as a contributor")
        
        exists_check = supabase.schema("revx").table("contributors").select("*")\
            .eq("project_id", project_id)\
            .eq("user_id", contributor.contributor_id)\
            .execute()
        
        if exists_check.data:
            raise HTTPException(status_code=400, detail="Contributor already exists")
        
        contributor_data = await add_contributor_service(project_id, contributor.contributor_id)
        return {
            "status": "success",
            "message": "Contributor added successfully",
            "data": contributor_data
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error adding contributor")
    
@router.post("/add_review/{project_id}", status_code=201)
async def add_review(
    project_id: str,
    Review: ReviewCreate,
    user = Depends(get_current_user)
):  
    try: 
        project_author = supabase.schema("revx").table("projects").select("owner_id").eq("id", project_id).execute()
        if project_author.data[0]["owner_id"] == user.user.id:
            raise HTTPException(status_code=400, detail="You cannot review your own project")
        
        exists_check = supabase.schema("revx").table("reviews").select("*")\
            .eq("project_id", project_id)\
            .eq("user_id", user.user.id)\
            .execute()
        if exists_check.data:
            raise HTTPException(status_code=400, detail="User can only review a project once")
        
        review_data = await add_review_service(
            project_id,
            user.user.id,
            Review.review,
            Review.rating
        )

        return {
            "status": "success",
            "message": "Review added successfully",
            "data": review_data
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error adding review")