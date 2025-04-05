from fastapi import HTTPException
from database import supabase
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import json

async def get_dashboard_metrics() -> Dict[str, Any]:
    """Get metrics for the admin dashboard"""
    try:
        # Get total counts
        users_count = supabase.schema("revx").table("profile").select("id", count="exact").execute()
        projects_count = supabase.schema("revx").table("projects").select("id", count="exact").execute()
        reviews_count = supabase.schema("revx").table("reviews").select("id", count="exact").execute()
        
        # Get recent counts (last 30 days) using the created_at column
        thirty_days_ago = (datetime.now() - timedelta(days=30)).isoformat()
        
        # Use the created_at column for profiles that you've added
        recent_users = supabase.schema("revx").table("profile").select("id", count="exact")\
            .gte("created_at", thirty_days_ago).execute()
            
        recent_projects = supabase.schema("revx").table("projects").select("id", count="exact")\
            .gte("created_at", thirty_days_ago).execute()
            
        return {
            "total_users": users_count.count if hasattr(users_count, 'count') else 0,
            "total_projects": projects_count.count if hasattr(projects_count, 'count') else 0,
            "total_reviews": reviews_count.count if hasattr(reviews_count, 'count') else 0,
            "recent_users": recent_users.count if hasattr(recent_users, 'count') else 0,
            "recent_projects": recent_projects.count if hasattr(recent_projects, 'count') else 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting metrics: {str(e)}")

async def get_all_users(limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
    """Get all users with pagination"""
    try:
        # Use created_at column for ordering and also select email
        profiles = supabase.schema("revx").table("profile").select("*")\
            .order("created_at", desc=True)\
            .range(offset, offset + limit - 1)\
            .execute()

        # Get user emails from auth.users for the profiles
        users_with_emails = []

        for profile in profiles.data or []:
            # Get the user email from auth.users based on the user ID
            try:
                # Fetch user email using a direct query to the auth.users table
                auth_user = supabase.schema("auth").table("users").select("email").eq("id", profile.get("id")).single().execute()
                email = auth_user.data.get("email") if auth_user.data else None
            except Exception:
                # If fetching from auth fails, email will be null
                email = None

            # Add email to the profile data
            users_with_emails.append({
                **profile,
                "email": email
            })

        return users_with_emails
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching users: {str(e)}")

async def get_all_projects(limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
    """Get all projects with pagination"""
    try:
        # Get projects with just the essential information
        projects = supabase.schema("revx").table("projects").select(
            "id, title, description, owner_id, created_at"
        ).range(offset, offset + limit - 1).execute()
        
        project_list = []
        
        if projects.data:
            for project in projects.data:
                project_id = project.get("id")
                
                # Get project owner username
                owner = supabase.schema("revx").table("profile").select("username")\
                    .eq("id", project.get("owner_id")).single().execute()
                owner_username = owner.data.get("username") if owner.data else "Unknown"
                
                # Get average rating
                reviews = supabase.schema("revx").table("reviews").select("rating")\
                    .eq("project_id", project_id).execute()
                
                avg_rating = 0
                if reviews.data and len(reviews.data) > 0:
                    ratings = [review.get("rating", 0) for review in reviews.data]
                    avg_rating = sum(ratings) / len(ratings)
                
                # Create simplified project data object
                project_data = {
                    "id": project.get("id"),
                    "title": project.get("title"),
                    "owner_id": project.get("owner_id"),
                    "owner_username": owner_username,
                    "created_at": project.get("created_at"),
                    "avg_rating": avg_rating
                }
                
                project_list.append(project_data)
        
        return project_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching projects: {str(e)}")

async def toggle_user_admin_status(user_id: str, is_admin: bool) -> Dict[str, Any]:
    """Toggle a user's admin status"""
    try:
        # Check if user exists
        user_check = supabase.schema("revx").table("profile").select("*").eq("id", user_id).single().execute()
        
        if not user_check.data:
            raise HTTPException(status_code=404, detail="User not found")
            
        # Update admin status
        update_data = supabase.schema("revx").table("profile")\
            .update({"is_admin": is_admin})\
            .eq("id", user_id)\
            .execute()
            
        return update_data.data[0] if update_data.data else {}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating user admin status: {str(e)}")

async def delete_user(user_id: str) -> Dict[str, Any]:
    """Delete a user and all their associated data"""
    try:
        # Check if user exists
        user_check = supabase.schema("revx").table("profile").select("*").eq("id", user_id).single().execute()
        
        if not user_check.data:
            raise HTTPException(status_code=404, detail="User not found")
            
        # 1. Delete reviews by this user
        supabase.schema("revx").table("reviews").delete().eq("user_id", user_id).execute()
        
        # 2. Delete projects created by this user (this will cascade delete project images, tags, etc.)
        projects = supabase.schema("revx").table("projects").select("id").eq("owner_id", user_id).execute()
        
        for project in projects.data or []:
            project_id = project.get("id")
            if project_id:
                # Delete reviews for this project
                supabase.schema("revx").table("reviews").delete().eq("project_id", project_id).execute()
                
                # Delete contributors
                supabase.schema("revx").table("contributors").delete().eq("project_id", project_id).execute()
                
                # Delete project images
                supabase.schema("revx").table("project_images").delete().eq("project_id", project_id).execute()
                
                # Delete project tags
                supabase.schema("revx").table("project_R_tag").delete().eq("project_id", project_id).execute()
                
        # 3. Delete projects 
        supabase.schema("revx").table("projects").delete().eq("owner_id", user_id).execute()
        
        # 4. Delete profile
        profile_delete = supabase.schema("revx").table("profile").delete().eq("id", user_id).execute()
        
        # 5. Delete user from auth
        try:
            supabase.auth.admin.delete_user(user_id)
        except Exception as auth_err:
            # Continue even if auth deletion fails
            print(f"Error deleting user from auth: {str(auth_err)}")
            
        return {"id": user_id, "deleted": True}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting user: {str(e)}")
