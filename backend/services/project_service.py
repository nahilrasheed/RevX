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

        print("project_data, hello", project_data)

        res = supabase.schema("revx").table("projects").insert(project_data).execute()
        print("res", res)

        if not res.data:
            raise HTTPException(status_code=500, detail="Failed to create project")
        
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating project hello: {str(e)}")
        