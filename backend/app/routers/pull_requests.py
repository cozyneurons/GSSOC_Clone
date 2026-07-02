from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
import uuid
from datetime import datetime

from app.db.session import SessionLocal
from app.api.deps import get_db, get_current_user
from app.models.pull_request import PullRequest
from app.models.user import User
from app.models.issue import Issue
from app.schemas.models import PullRequestCreate, PullRequestUpdate, PullRequestResponse

router = APIRouter(prefix="/pull-requests", tags=["pull_requests"])

@router.post("", response_model=PullRequestResponse)
def create_pull_request(
    pr_in: PullRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only participants usually submit PRs, but any authenticated user can technically do it in this clone
    db_pr = PullRequest(
        id=str(uuid.uuid4()),
        issue_id=pr_in.issue_id,
        project_id=pr_in.project_id,
        contributor_id=current_user.id,
        github_pr_url=pr_in.github_pr_url,
        title=pr_in.title,
        status="pending",
        points_awarded=0,
        submitted_at=datetime.utcnow()
    )
    db.add(db_pr)
    db.commit()
    db.refresh(db_pr)
    return db_pr

@router.patch("/{pr_id}", response_model=PullRequestResponse)
def update_pull_request(
    pr_id: str,
    pr_in: PullRequestUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if current_user is mentor or admin (this could be a specific check for project mentor)
    if current_user.role not in ["mentor", "project_admin", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to update PRs")

    pr = db.query(PullRequest).filter(PullRequest.id == pr_id).first()
    if not pr:
        raise HTTPException(status_code=404, detail="Pull Request not found")

    if pr.status == "merged":
        raise HTTPException(status_code=400, detail="Pull Request already merged")

    # Update PR
    pr.status = pr_in.status
    if pr_in.status == "merged":
        pr.merged_by = current_user.id
        pr.merged_at = datetime.utcnow()
        pr.points_awarded = pr_in.points_awarded
        
        # Update contributor's total points and issue status
        contributor = db.query(User).filter(User.id == pr.contributor_id).first()
        if contributor:
            contributor.total_points += pr_in.points_awarded
            
        issue = db.query(Issue).filter(Issue.id == pr.issue_id).first()
        if issue:
            issue.status = "closed"

    db.commit()
    db.refresh(pr)
    return pr
