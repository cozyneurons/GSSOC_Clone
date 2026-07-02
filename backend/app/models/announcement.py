from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class Announcement(Base):
    __tablename__ = "announcement"
    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    content = Column(Text)
    author_id = Column(String, ForeignKey("user.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    author = relationship("User", back_populates="announcements")
