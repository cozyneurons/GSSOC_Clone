from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List

from app.db.session import SessionLocal
from app.api.deps import get_db
from app.models.user import User
from app.schemas.user import UserResponse

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])

@router.get("", response_model=List[UserResponse])
def get_leaderboard(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    users = db.query(User).order_by(desc(User.total_points)).offset(skip).limit(limit).all()
    return users
