from fastapi import APIRouter, HTTPException, Depends
from database import supabase
from models.project import ProjectCreate, ContributorCreate, ReviewCreate, ProjectUpdate
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

        if not project.title:
            raise HTTPException(status_code=400, detail="Project title is required")

        exist_check = supabase.schema("revx").table("projects").select("*").eq("title", project.title).execute()
        if exist_check.data:
            raise HTTPException(status_code=400, detail="Project with this title already exists")
        
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
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error creating project")

@router.get("/my_projects", status_code=200)
async def my_projects(user = Depends(get_current_user)):
    try:
        user_id = str(user.user.id)
        projects = supabase.schema("revx").table("projects").select("*").eq("owner_id", user_id).execute()
        return {
            "status": "success",
            "data": projects.data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error fetching projects")

@router.put("/update/{project_id}", status_code=200)
async def update_project(
    Project: ProjectUpdate,
    project_id: str,
    user = Depends(get_current_user)
):
    try:
        user_id = str(user.user.id)

        if not project_id:
            raise HTTPException(status_code=400, detail="Project ID is required")
        if not Project.title:
            raise HTTPException(status_code=400, detail="Project title cannot be empty")

        project_author = supabase.schema("revx").table("projects").select("owner_id").eq("id", project_id).execute()
        if project_author.data[0]["owner_id"] != user_id:
            raise HTTPException(status_code=400, detail="You are not the owner of this project")
        
        exist_check = supabase.schema("revx").table("projects").select("*").eq("title", Project.title).execute()
        if exist_check.data:
            raise HTTPException(status_code=400, detail="Project with this title already exists")

        update_data = supabase.schema("revx").table("projects").update({
            "title": Project.title,
            "description": Project.description,
            "image": Project.image
        }).eq("id", project_id).execute()

        return {
            "status": "success",
            "message": "Project updated successfully",
            "data": update_data.data
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error updating project")

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
        if not project_id:
            raise HTTPException(status_code=400, detail="Project ID is required")

        project = supabase.schema("revx").table("projects").select("*").eq("id", project_id).execute()
        contributors = supabase.schema("revx").table("contributors").select("*").eq("project_id", project_id).execute()
        reviews = supabase.schema("revx").table("reviews").select("*").eq("project_id", project_id).execute()

        data = project.data[0]
        data["contributors"] = contributors.data
        data["reviews"] = reviews.data

        return {
            "status": "success",
            "data": data
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error fetching project")

@router.post("/add_contributor/{project_id}", status_code=201)
async def add_contributor(
    project_id: str,
    contributor: ContributorCreate,
    author = Depends(get_current_user)
):
    try:
        if not contributor.contributor_id:
            raise HTTPException(status_code=400, detail="Contributor ID is required")
        if not project_id:
            raise HTTPException(status_code=400, detail="Project ID is required")
        if author.user.id == contributor.contributor_id:
            raise HTTPException(status_code=400, detail="You cannot add yourself as a contributor")

        author_check = supabase.schema("revx").table("projects").select("owner_id").eq("id", project_id).execute()
        if author_check.data[0]["owner_id"] != author.user.id:
            raise HTTPException(status_code=400, detail="You are not the owner of this project")

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
    
@router.delete("/remove_contributor/{project_id}/{contributor_id}", status_code=200)
async def remove_contributor(
    project_id: str,
    contributor_id: str,
    user = Depends(get_current_user)
):
    try:
        if not project_id:
            raise HTTPException(status_code=400, detail="Project ID is required")
        if not contributor_id:
            raise HTTPException(status_code=400, detail="Contributor ID is required")
        
        author_check = supabase.schema("revx").table("projects").select("owner_id").eq("id", project_id).execute()
        if author_check.data[0]["owner_id"] != user.user.id:
            raise HTTPException(status_code=400, detail="You are not the owner of this project")
        
        delete_data = supabase.schema("revx").table("contributors").delete().eq("project_id", project_id).eq("user_id", contributor_id).execute()

        return {
            "status": "success",
            "message": "Contributor removed successfully",
            "data": delete_data.data
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error removing contributor"
)

@router.post("/add_review/{project_id}", status_code=201)
async def add_review(
    project_id: str,
    Review: ReviewCreate,
    user = Depends(get_current_user)
):  
    try: 
        if not project_id:
            raise HTTPException(status_code=400, detail="Project ID is required")
        if not Review.rating:
            raise HTTPException(status_code=400, detail="Rating is required")
        if not Review.review:
            raise HTTPException(status_code=400, detail="Review is required")

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