from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class Issue(Base):
    __tablename__ = "issue"
    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("project.id"))
    title = Column(String)
    description = Column(Text)
    label = Column(String)
    points = Column(Integer)
    status = Column(String)
    assigned_to = Column(String, ForeignKey("user.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    project = relationship("Project", back_populates="issues")
    assignee = relationship("User", back_populates="assigned_issues")
    pull_requests = relationship("PullRequest", back_populates="issue")
