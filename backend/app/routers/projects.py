from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional

from app.db.session import SessionLocal
from app.api.deps import get_db, require_role, get_current_user
from app.models.project import Project
from app.models.user import User
from app.schemas.models import ProjectResponse, IssueResponse
from pydantic import BaseModel

class MentorResponse(BaseModel):
    id: str
    name: str
    username: str
    avatar_url: Optional[str] = None
    
    class Config:
        from_attributes = True

class ProjectDetailResponse(ProjectResponse):
    issues: List[IssueResponse] = []
    mentors: List[MentorResponse] = []
    
    class Config:
        from_attributes = True

router = APIRouter(prefix="/projects", tags=["projects"])

@router.get("", response_model=List[ProjectResponse])
def get_projects(
    tech_stack: Optional[str] = None,
    difficulty_level: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Project)
    
    if search:
        query = query.filter(or_(
            Project.name.ilike(f"%{search}%"),
            Project.description.ilike(f"%{search}%")
        ))
    if tech_stack:
        # Depending on how it's stored, this could be complex. Using contains for list of strings
        query = query.filter(Project.tech_stack.contains([tech_stack]))
    if difficulty_level:
        query = query.filter(Project.difficulty_level == difficulty_level)
    if status:
        query = query.filter(Project.status == status)
        
    return query.all()

@router.get("/{project_id}", response_model=ProjectDetailResponse)
def get_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project
