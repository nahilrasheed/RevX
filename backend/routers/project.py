from fastapi import APIRouter, HTTPException, Depends
from database import supabase
from models.project import ProjectCreate, ContributorCreate, ReviewCreate, ProjectUpdate
from middleware.auth_middleware import get_current_user
from services.project_service import (
    create_project_service, 
    add_contributor_service, 
    add_review_service, 
    get_project_with_details, 
    list_projects_service,
    delete_project_service
)

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
            project.images,
            project.tags
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

@router.put("/update/{project_id}", status_code=200)
async def update_project(
    project: ProjectUpdate,
    project_id: str,
    user = Depends(get_current_user)
):
    try:
        user_id = str(user.user.id)

        if not project_id:
            raise HTTPException(status_code=400, detail="Project ID is required")

        # Check if project exists and user is the owner
        project_check = supabase.schema("revx").table("projects").select("*").eq("id", project_id).execute()
        if not project_check.data:
            raise HTTPException(status_code=404, detail="Project not found")
            
        if project_check.data[0]["owner_id"] != user_id:
            raise HTTPException(status_code=403, detail="You are not the owner of this project")
        
        # Create an updates dictionary with only provided fields
        updates = {}
        
        if project.title is not None:
            # Check if the new title already exists (but exclude this project)
            title_check = supabase.schema("revx").table("projects").select("id").eq("title", project.title).execute()
            if title_check.data and str(title_check.data[0]["id"]) != project_id:
                raise HTTPException(status_code=400, detail="Project with this title already exists")
            updates["title"] = project.title
            
        if project.description is not None:
            updates["description"] = project.description

        # Only update if there are changes
        if updates:
            update_result = supabase.schema("revx").table("projects").update(updates).eq("id", project_id).execute()
            if not update_result.data:
                raise HTTPException(status_code=500, detail="Failed to update project")

        # Handle image updates if provided
        if project.images is not None:
            # First, delete existing images
            supabase.schema("revx").table("project_images").delete().eq("project_id", project_id).execute()
            
            # Then add new images if there are any
            if project.images:
                image_data_list = []
                for image in project.images:
                    image_data_list.append({
                        "project_id": project_id,
                        "image_link": image,
                    })
                
                if image_data_list:
                    image_result = supabase.schema("revx").table("project_images").insert(image_data_list).execute()
                    if not image_result.data:
                        raise HTTPException(status_code=500, detail="Failed to update project images")

        # Handle tag updates if provided
        if project.tags is not None:
            supabase.schema("revx").table("project_R_tag").delete().eq("project_id", project_id).execute()
            
            if project.tags:
                tag_data_list = []
                for tag in project.tags:
                    try:
                        # Convert tag to integer to ensure correct type
                        tag_id = int(tag)
                        tag_data_list.append({
                            "project_id": project_id,
                            "tag_id": tag_id,
                        })
                    except (ValueError, TypeError):
                        # Log or handle invalid tag IDs
                        continue
                
                if tag_data_list:
                    tag_result = supabase.schema("revx").table("project_R_tag").insert(tag_data_list).execute()
                    if not tag_result.data:
                        raise HTTPException(status_code=500, detail="Failed to update project tags")

        # Get updated project data - moved outside conditionals to always return updated data
        project_data = await get_project_with_details(project_id)

        return {
            "status": "success",
            "message": "Project updated successfully",
            "data": project_data
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating project: {str(e)}")

@router.get("/list", status_code=200)
async def list_projects():
    try:
        projects = await list_projects_service()
        return {
            "status": "success",
            "data": projects
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching projects: {str(e)}")

@router.get("/get/{project_id}", status_code=200)
async def get_project(project_id: str):
    try:
        if not project_id:
            raise HTTPException(status_code=400, detail="Project ID is required")
        
        project_data = await get_project_with_details(project_id)
        
        return {
            "status": "success",
            "data": project_data
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching project: {str(e)}")

@router.post("/add_contributor/{project_id}", status_code=201)
async def add_contributor(
    project_id: str,
    contributor: ContributorCreate,
    author = Depends(get_current_user)
):
    try:
        if not contributor.username:
            raise HTTPException(status_code=400, detail="Username is required")
        if not project_id:
            raise HTTPException(status_code=400, detail="Project ID is required")
        
        contributor_check = supabase.schema("revx").table("profile").select("*").eq("username", contributor.username).execute()

        if not contributor_check.data:
            raise HTTPException(status_code=400, detail="User not found")
        if contributor_check.data[0]["id"] == author.user.id:
            raise HTTPException(status_code=400, detail="You cannot add yourself as a contributor")

        author_check = supabase.schema("revx").table("projects").select("owner_id").eq("id", project_id).execute()
        if author_check.data[0]["owner_id"] != author.user.id:
            raise HTTPException(status_code=400, detail="You are not the owner of this project")
        
        exists_check = supabase.schema("revx").table("contributors").select("*")\
            .eq("project_id", project_id)\
            .eq("user_id", contributor_check.data[0]["id"])\
            .execute()
        if exists_check.data:
            raise HTTPException(status_code=400, detail="Contributor already exists")
        
        contributor_data = await add_contributor_service(project_id, contributor_check.data[0]["id"])
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
        
        delete_data = supabase.schema("revx").table("contributors").delete().eq("project_id", project_id).eq("id", contributor_id).execute()

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
    
@router.delete("/remove_review/{review_id}", status_code=200)
async def remove_review(
    review_id: str,
    user = Depends(get_current_user)
):
    try:
        if not review_id:
            raise HTTPException(status_code=400, detail="Review ID is required")
        
        # Check if review exists
        review_check = supabase.schema("revx").table("reviews").select("*").eq("id", review_id).execute()
        if not review_check.data:
            raise HTTPException(status_code=404, detail="Review not found")
            
        # Verify the user owns this review - only allow users to delete their own reviews
        if review_check.data[0]["user_id"] != user.user.id:
            raise HTTPException(status_code=403, detail="You can only delete your own reviews")
        
        # Delete the review
        delete_data = supabase.schema("revx").table("reviews").delete().eq("id", review_id).execute()

        return {
            "status": "success",
            "message": "Review removed successfully",
            "data": delete_data.data
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error removing review: {str(e)}")
    
@router.get("/tags", status_code=200)
async def get_tags():
    try:
        tags_result = supabase.schema("revx").table("tags").select("*").execute()
        
        if not tags_result.data:
            return {
                "status": "success",
                "data": []
            }
        
        # Transform to use tag_id for consistency with other endpoints
        transformed_tags = [
            {
                "tag_id": tag["id"],
                "tag_name": tag["tag_name"]
            }
            for tag in tags_result.data
        ]
        
        return {
            "status": "success",
            "data": transformed_tags
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching tags: {str(e)}")
    
@router.delete("/delete/{project_id}", status_code=200)
async def delete_project(
    project_id: str,
    user = Depends(get_current_user)
):
    try:
        if not project_id:
            raise HTTPException(status_code=400, detail="Project ID is required")
        
        # Check if project exists
        project_check = supabase.schema("revx").table("projects").select("*").eq("id", project_id).execute()
        if not project_check.data:
            raise HTTPException(status_code=404, detail="Project not found")
            
        # Verify the user owns this project - only allow users to delete their own projects
        if project_check.data[0]["owner_id"] != user.user.id:
            raise HTTPException(status_code=403, detail="You can only delete your own projects")
        
        res = await delete_project_service(project_id)
        if not res:
            raise HTTPException(status_code=500, detail="Failed to delete project")

        return res
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error deleting project: {str(e)}"
)