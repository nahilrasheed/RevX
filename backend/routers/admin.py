from fastapi import APIRouter, HTTPException, Depends, Query
from database import supabase
from models.user import AdminUserUpdate, DashboardMetrics
from services.admin_service import (
    get_dashboard_metrics, 
    get_all_users, 
    get_all_projects, 
    toggle_user_admin_status,
    delete_user
)
from middleware.auth_middleware import get_admin_user
from typing import List, Dict, Any, Optional

router = APIRouter()

@router.get("/metrics", status_code=200, response_model=DashboardMetrics)
async def dashboard_metrics(user = Depends(get_admin_user)):
    """Get metrics for the admin dashboard"""
    try:
        metrics = await get_dashboard_metrics()
        return metrics
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting metrics: {str(e)}")

@router.get("/users", status_code=200)
async def list_users(
    user = Depends(get_admin_user),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """Get all users with pagination"""
    try:
        users = await get_all_users(limit, offset)
        return {
            "status": "success",
            "count": len(users),
            "data": users
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching users: {str(e)}")

@router.get("/projects", status_code=200)
async def list_projects(
    user = Depends(get_admin_user),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """Get all projects with pagination"""
    try:
        projects = await get_all_projects(limit, offset)
        return {
            "status": "success",
            "count": len(projects),
            "data": projects
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching projects: {str(e)}")

@router.put("/users/{user_id}/admin", status_code=200)
async def update_user_admin_status(
    user_id: str,
    admin_update: AdminUserUpdate,
    user = Depends(get_admin_user)
):
    """Update a user's admin status"""
    try:
        updated_user = await toggle_user_admin_status(user_id, admin_update.is_admin)
        return {
            "status": "success",
            "message": f"User admin status updated to {admin_update.is_admin}",
            "data": updated_user
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating user admin status: {str(e)}")

@router.delete("/users/{user_id}", status_code=200)
async def admin_delete_user(
    user_id: str,
    user = Depends(get_admin_user)
):
    """Delete a user and all their associated data"""
    try:
        result = await delete_user(user_id)
        return {
            "status": "success",
            "message": "User deleted successfully",
            "data": result
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting user: {str(e)}")

@router.delete("/projects/{project_id}", status_code=200)
async def admin_delete_project(
    project_id: str,
    user = Depends(get_admin_user)
):
    """Delete a project as an admin (bypass owner check)"""
    try:
        from services.project_service import delete_project_service
        
        # Check if project exists
        project_check = supabase.schema("revx").table("projects").select("*").eq("id", project_id).execute()
        if not project_check.data:
            raise HTTPException(status_code=404, detail="Project not found")
            
        # Delete project
        res = await delete_project_service(project_id)
        if not res:
            raise HTTPException(status_code=500, detail="Failed to delete project")

        return {
            "status": "success",
            "message": "Project deleted successfully",
            "data": res
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting project: {str(e)}")