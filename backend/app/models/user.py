from sqlalchemy import Column, String, Text, DateTime, Integer
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class User(Base):
    __tablename__ = "user"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    avatar_url = Column(String)
    role = Column(String, nullable=False)
    college = Column(String)
    bio = Column(Text)
    hashed_password = Column(String, nullable=True)
    total_points = Column(Integer, default=0)
    joined_at = Column(DateTime, default=datetime.utcnow)
    
    managed_projects = relationship("Project", back_populates="admin")
    mentored_projects = relationship("Project", secondary="project_mentor", back_populates="mentors")
    assigned_issues = relationship("Issue", back_populates="assignee")
    pull_requests = relationship("PullRequest", foreign_keys="PullRequest.contributor_id", back_populates="contributor")
    merged_prs = relationship("PullRequest", foreign_keys="PullRequest.merged_by", back_populates="merger")
    badges = relationship("Badge", secondary="user_badge", back_populates="users")
    announcements = relationship("Announcement", back_populates="author")
