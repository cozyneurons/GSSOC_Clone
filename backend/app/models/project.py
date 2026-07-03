from sqlalchemy import Column, String, Text, JSON, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.db.base_class import Base

project_mentor = Table(
    'project_mentor',
    Base.metadata,
    Column('project_id', String, ForeignKey('project.id'), primary_key=True),
    Column('mentor_id', String, ForeignKey('user.id'), primary_key=True)
)

class Project(Base):
    __tablename__ = "project"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    tech_stack = Column(JSON)
    difficulty_level = Column(String)
    repo_url = Column(String)
    tags = Column(JSON)
    status = Column(String)
    project_admin_id = Column(String, ForeignKey("user.id"))
    
    admin = relationship("User", back_populates="managed_projects")
    mentors = relationship("User", secondary=project_mentor, back_populates="mentored_projects")
    issues = relationship("Issue", back_populates="project")
    pull_requests = relationship("PullRequest", back_populates="project")
