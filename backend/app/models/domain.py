from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Table, ARRAY
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

# Many-to-Many association tables
project_mentor = Table(
    'project_mentor',
    Base.metadata,
    Column('project_id', String, ForeignKey('project.id'), primary_key=True),
    Column('mentor_id', String, ForeignKey('user.id'), primary_key=True)
)

user_badge = Table(
    'user_badge',
    Base.metadata,
    Column('user_id', String, ForeignKey('user.id'), primary_key=True),
    Column('badge_id', String, ForeignKey('badge.id'), primary_key=True),
    Column('awarded_at', DateTime, default=datetime.utcnow)
)

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
    joined_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    managed_projects = relationship("Project", back_populates="admin")
    mentored_projects = relationship("Project", secondary=project_mentor, back_populates="mentors")
    assigned_issues = relationship("Issue", back_populates="assignee")
    pull_requests = relationship("PullRequest", foreign_keys="PullRequest.contributor_id", back_populates="contributor")
    merged_prs = relationship("PullRequest", foreign_keys="PullRequest.merged_by", back_populates="merger")
    badges = relationship("Badge", secondary=user_badge, back_populates="users")
    announcements = relationship("Announcement", back_populates="author")

class Project(Base):
    __tablename__ = "project"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    tech_stack = Column(ARRAY(String))
    difficulty_level = Column(String)
    repo_url = Column(String)
    tags = Column(ARRAY(String))
    status = Column(String)
    
    project_admin_id = Column(String, ForeignKey("user.id"))
    
    admin = relationship("User", back_populates="managed_projects")
    mentors = relationship("User", secondary=project_mentor, back_populates="mentored_projects")
    issues = relationship("Issue", back_populates="project")
    pull_requests = relationship("PullRequest", back_populates="project")

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

class Badge(Base):
    __tablename__ = "badge"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    icon = Column(String)
    
    users = relationship("User", secondary=user_badge, back_populates="badges")

class Announcement(Base):
    __tablename__ = "announcement"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    content = Column(Text)
    author_id = Column(String, ForeignKey("user.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    author = relationship("User", back_populates="announcements")
