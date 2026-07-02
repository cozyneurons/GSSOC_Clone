from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.session import SessionLocal
from app.api.deps import get_db
from app.models.badge import Badge
from app.schemas.models import BadgeResponse

router = APIRouter(prefix="/badges", tags=["badges"])

@router.get("", response_model=List[BadgeResponse])
def get_badges(db: Session = Depends(get_db)):
    return db.query(Badge).all()
