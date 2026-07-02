from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.db.session import SessionLocal
from app.models import User, Project, Issue, PullRequest, Badge, Announcement, user_badge
from app.schemas import UserResponse as UserSchema, ProjectResponse as ProjectSchema, IssueResponse as IssueSchema, PullRequestResponse as PullRequestSchema, AnnouncementResponse as AnnouncementSchema
from pydantic import BaseModel
from typing import List, Optional

class BadgeMinimal(BaseModel):
    id: str
    name: str
    icon: str
    class Config:
        from_attributes = True

class LeaderboardEntry(BaseModel):
    userId: str
    name: str
    username: str
    avatarUrl: Optional[str] = None
    totalPoints: int
    rank: Optional[int] = None
    badges: List[BadgeMinimal] = []

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/stats", response_model=Dict[str, int])
def get_live_stats(db: Session = Depends(get_db)):
    participants = db.query(User).filter(User.role == "participant").count()
    projects = db.query(Project).count()
    prs_merged = db.query(PullRequest).filter(PullRequest.status == "merged").count()
    return {
        "participants": participants,
        "projects": projects,
        "prs_merged": prs_merged
    }

@router.get("/announcements", response_model=List[AnnouncementSchema])
def get_announcements(db: Session = Depends(get_db)):
    return db.query(Announcement).order_by(Announcement.created_at.desc()).all()

@router.get("/projects", response_model=List[ProjectSchema])
def get_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()

@router.get("/projects/{project_id}", response_model=ProjectSchema)
def get_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.get("/leaderboard", response_model=List[LeaderboardEntry])
def get_leaderboard(db: Session = Depends(get_db)):
    users = db.query(User).filter(User.role == "participant").all()
    leaderboard = []
    
    # Calculate points for each user
    for user in users:
        points = sum(pr.points_awarded for pr in user.pull_requests if pr.status == "merged")
        leaderboard.append({
            "userId": user.id,
            "name": user.name,
            "username": user.username,
            "avatarUrl": user.avatar_url,
            "totalPoints": points,
            "badges": user.badges
        })
    
    # Sort and rank
    leaderboard.sort(key=lambda x: x["totalPoints"], reverse=True)
    for rank, entry in enumerate(leaderboard, 1):
        entry["rank"] = rank
        
    return leaderboard

@router.get("/users/{user_id}", response_model=UserSchema)
def get_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
