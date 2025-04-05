from fastapi import HTTPException
from database import supabase
from typing import Dict, Any, List
from uuid import UUID

async def create_project_service(
        title: str,
        description: str,
        user_id: str,
        images: List[str] = None,
        tags: List[str] = None,
) -> Dict[str, Any]:
    try:
        project_data = {
            "title": title,
            "description": description,
            "owner_id": user_id,
        }

        res = supabase.schema("revx").table("projects").insert(project_data).execute()

        if not res.data:
            raise HTTPException(status_code=500, detail="Failed to create project")
        
        project_id = res.data[0]["id"]
        
        if images:
            image_data_list = []
            for image in images:
                image_data_list.append({
                    "project_id": project_id,
                    "image_link": image,
                })
            
            res_image = supabase.schema("revx").table("project_images").insert(image_data_list).execute()
            
            if not res_image.data:
                raise HTTPException(status_code=500, detail="Failed to add images to project")
        
        if tags:
            tag_data_list = []
            for tag in tags:
                tag_data_list.append({
                    "project_id": project_id,
                    "tag_id": tag,
                })
            
            res_tag = supabase.schema("revx").table("project_R_tag").insert(tag_data_list).execute()
            
            if not res_tag.data:
                raise HTTPException(status_code=500, detail="Failed to add tags to project")
        
        complete_project = await get_project_with_details(str(project_id))
        return complete_project
        
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating project: {str(e)}")
    
async def list_projects_service() -> List[Dict[str, Any]]:
    try:
        result = supabase.schema("revx").rpc('list_projects_with_details', {}).execute()
        
        if not result.data:
            return []
        
        if isinstance(result.data, list) and len(result.data) == 1 and isinstance(result.data[0], list):
            return result.data[0]
        elif isinstance(result.data, list):
            return result.data
        else:
            import json
            if isinstance(result.data, str):
                parsed_data = json.loads(result.data)
                if isinstance(parsed_data, list) and len(parsed_data) == 1 and isinstance(parsed_data[0], list):
                    return parsed_data[0]
                return parsed_data
            else:
                return [result.data]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching projects: {str(e)}")

async def get_project_with_details(project_id: str) -> Dict[str, Any]:
    try:
        result = supabase.schema("revx").rpc('get_project_with_details', {"project_id": int(project_id)}).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Project not found")
        
        return result.data
        
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching project details: {str(e)}")

async def add_contributor_service(
    project_id: str,
    user_id: str,
) -> Dict[str, Any]:
    try:
        contributor_data = {
            "project_id": project_id,
            "user_id": user_id,
            "status": False,
        }

        res = supabase.schema("revx").table("contributors").insert(contributor_data).execute()

        if not res.data:
            raise HTTPException(status_code=500, detail="Failed to add contributor")
        
        return res.data[0]
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding contributor: {str(e)}")
    
async def add_review_service(
    project_id: str,
    user_id: str,
    review: str,
    rating: str
) -> Dict[str, Any]:
    try:
        review_data = {
            "project_id": project_id,
            "user_id": user_id,
            "review": review,
            "rating": rating,
        }

        res = supabase.schema("revx").table("reviews").insert(review_data).execute()

        if not res.data:
            raise HTTPException(status_code=500, detail="Failed to add review")
        
        return res.data[0]
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding review: {str(e)}")
    
async def delete_project_service(
    project_id: str,
) -> Dict[str, Any]:
    try:
        # Direct table operations, no type conversions needed
        
        # 1. Delete reviews
        reviews_result = supabase.schema("revx").table("reviews").delete().eq("project_id", project_id).execute()
        
        # 2. Delete contributors
        contributors_result = supabase.schema("revx").table("contributors").delete().eq("project_id", project_id).execute()
        
        # 3. Delete project images
        images_result = supabase.schema("revx").table("project_images").delete().eq("project_id", project_id).execute()
        
        # 4. Delete project tags relationship
        tags_result = supabase.schema("revx").table("project_R_tag").delete().eq("project_id", project_id).execute()
        
        # 5. Finally delete the project itself
        project_result = supabase.schema("revx").table("projects").delete().eq("id", project_id).execute()
        
        if not project_result.data:
            raise HTTPException(status_code=404, detail="Project not found")
        
        return {
            "status": "success",
            "message": "Project deleted successfully",
            "data": {
                "project_id": project_id,
                "related_data_deleted": {
                    "reviews": len(reviews_result.data) if reviews_result.data else 0,
                    "contributors": len(contributors_result.data) if contributors_result.data else 0,
                    "images": len(images_result.data) if images_result.data else 0, 
                    "tags": len(tags_result.data) if tags_result.data else 0
                }
            }
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting project: {str(e)}")