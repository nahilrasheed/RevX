from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class User(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=20)

class UserCreate(User):
    full_name: str
    password: str = Field(..., min_length=8)
    bio: Optional[str] = None
    avatar: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfile(User):
    id: str
    full_name: str
    bio: Optional[str] = None
    avatar: Optional[str] = None

class UserProfileUpdate(User):
    username: Optional[str] = None
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None

