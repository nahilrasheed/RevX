from fastapi import HTTPException
from database import supabase
from typing import Dict, Any, List
from uuid import UUID

async def create_project_service(
        title: str,
        description: str,
        user_id: str,
        images: List[str] = None,
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
        
        if images:
            image_data_list = []
            for image in images:
                image_data_list.append({
                    "project_id": res.data[0]["id"],
                    "image_link": image,
                })
            
            res_image = supabase.schema("revx").table("project_images").insert(image_data_list).execute()
            
            if not res_image.data:
                raise HTTPException(status_code=500, detail="Failed to add images to project")
        
            res.data[0]["images"] = [img["image_link"] for img in res_image.data]
        return res.data[0]
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating project hello: {str(e)}")

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