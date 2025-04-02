from pydantic import BaseModel
from typing import Optional, List

class Project(BaseModel):
    title: str
    description: str
    images: Optional[List[str]] = None
    tags: Optional[List[str]] = None

class ProjectCreate(Project):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    images: Optional[List[str]] = None
    tags: Optional[List[str]] = None

class ProjectResponse(Project):
    id: str
    owner_id: str
    created_at: str

class ContributorCreate(BaseModel):
    username: str

class ReviewCreate(BaseModel):
    review: str
    rating: str