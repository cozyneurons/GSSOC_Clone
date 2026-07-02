from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import SessionLocal
from app.api.deps import get_db
from app.models.issue import Issue
from app.schemas.models import IssueResponse

router = APIRouter(prefix="/issues", tags=["issues"])

@router.get("", response_model=List[IssueResponse])
def get_issues(
    project_id: Optional[str] = None,
    label: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Issue)
    if project_id:
        query = query.filter(Issue.project_id == project_id)
    if label:
        query = query.filter(Issue.label == label)
    if status:
        query = query.filter(Issue.status == status)
    return query.all()
