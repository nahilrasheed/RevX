from fastapi import HTTPException
from database import supabase
from typing import Dict, Any
from uuid import UUID

async def create_project_service(
        title: str,
        description: str,
        user_id: str,
        image: str = None,
) -> Dict[str, Any]:
    try:
        project_data = {
            "title": title,
            "description": description,
            "image": image,
            "owner_id": user_id,
        }

        res = supabase.schema("revx").table("projects").insert(project_data).execute()

        if not res.data:
            raise HTTPException(status_code=500, detail="Failed to create project")
        
        return res.data[0]
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding contributor: {str(e)}")