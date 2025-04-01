from fastapi import APIRouter, HTTPException, Depends
from middleware.auth_middleware import get_current_user
from models.user import UserProfileUpdate
from services.user_service import update_user_service

router = APIRouter()

@router.put("/update", status_code=200)
async def update_user(
    user: UserProfileUpdate,
    current_user = Depends(get_current_user),
):
    try:
        user_id = str(current_user.user.id)
        user_data = user.model_dump(exclude_unset=True)
        update_data = await update_user_service(
            user_id=user_id,
            **user_data
        )

        if not update_data:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"message": "User updated successfully", "data": update_data}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating user: {str(e)}")