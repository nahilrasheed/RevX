from pydantic import BaseModel
from typing import Optional

class Project(BaseModel):
    title: str
    description: str
    image: Optional[str] = None

class ProjectCreate(Project):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None

class ProjectResponse(Project):
    id: str
    owner_id: str
    created_at: str

class ContributorCreate(BaseModel):
    contributor_id: str

class ReviewCreate(BaseModel):
    review: str
    rating: str