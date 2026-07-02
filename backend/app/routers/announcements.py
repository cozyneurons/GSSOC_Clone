from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List

from app.db.session import SessionLocal
from app.api.deps import get_db
from app.models.announcement import Announcement
from app.schemas.models import AnnouncementResponse

router = APIRouter(prefix="/announcements", tags=["announcements"])

@router.get("", response_model=List[AnnouncementResponse])
def get_announcements(db: Session = Depends(get_db)):
    return db.query(Announcement).order_by(desc(Announcement.created_at)).all()
