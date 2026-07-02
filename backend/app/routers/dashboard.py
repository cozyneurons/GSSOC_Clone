from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import SessionLocal
from app.models import User, Project, Issue, PullRequest, Badge
from app.schemas import IssueResponse as IssueSchema, PullRequestResponse as PullRequestSchema, UserResponse as UserSchema

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(x_user_id: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="X-User-Id header missing")
    user = db.query(User).filter(User.id == x_user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid user")
    return user

# Participant Routes
@router.get("/participant/issues", response_model=List[IssueSchema])
def get_participant_issues(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "participant":
        raise HTTPException(status_code=403, detail="Not a participant")
    return db.query(Issue).filter(Issue.assigned_to == current_user.id).all()

@router.get("/participant/prs", response_model=List[PullRequestSchema])
def get_participant_prs(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "participant":
        raise HTTPException(status_code=403, detail="Not a participant")
    return db.query(PullRequest).filter(PullRequest.contributor_id == current_user.id).all()

# Mentor Routes
@router.get("/mentor/prs/pending", response_model=List[PullRequestSchema])
def get_mentor_pending_prs(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "mentor":
        raise HTTPException(status_code=403, detail="Not a mentor")
    
    project_ids = [p.id for p in current_user.mentored_projects]
    return db.query(PullRequest).filter(
        PullRequest.project_id.in_(project_ids),
        PullRequest.status == "open"
    ).all()

# Project Admin Routes
@router.get("/project-admin/projects", response_model=List[dict])
def get_project_admin_projects(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "project_admin":
        raise HTTPException(status_code=403, detail="Not a project admin")
    
    projects = db.query(Project).filter(Project.project_admin_id == current_user.id).all()
    res = []
    for p in projects:
        res.append({
            "id": p.id,
            "name": p.name,
            "issues_count": len(p.issues),
            "mentors_count": len(p.mentors)
        })
    return res

# Global Admin Routes
@router.get("/admin/users", response_model=List[UserSchema])
def get_all_users(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not an admin")
    return db.query(User).all()
