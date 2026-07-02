from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class PullRequest(Base):
    __tablename__ = "pull_request"
    id = Column(String, primary_key=True, index=True)
    issue_id = Column(String, ForeignKey("issue.id"))
    project_id = Column(String, ForeignKey("project.id"))
    contributor_id = Column(String, ForeignKey("user.id"))
    github_pr_url = Column(String)
    title = Column(String)
    status = Column(String)
    points_awarded = Column(Integer, default=0)
    merged_by = Column(String, ForeignKey("user.id"), nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    merged_at = Column(DateTime, nullable=True)
    
    issue = relationship("Issue", back_populates="pull_requests")
    project = relationship("Project", back_populates="pull_requests")
    contributor = relationship("User", foreign_keys=[contributor_id], back_populates="pull_requests")
    merger = relationship("User", foreign_keys=[merged_by], back_populates="merged_prs")
