import os

backend_dir = r"c:\Users\ankit\OneDrive\Desktop\GSSOC\backend\app"
frontend_dir = r"c:\Users\ankit\OneDrive\Desktop\GSSOC\frontend\src\types"

# 1. Models
os.makedirs(os.path.join(backend_dir, "models"), exist_ok=True)
models_init = """from .user import User
from .project import Project, project_mentor
from .issue import Issue
from .pull_request import PullRequest
from .badge import Badge, user_badge
from .announcement import Announcement
"""
with open(os.path.join(backend_dir, "models", "__init__.py"), "w") as f: f.write(models_init)

model_user = """from sqlalchemy import Column, String, Text, DateTime
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
    joined_at = Column(DateTime, default=datetime.utcnow)
    
    managed_projects = relationship("Project", back_populates="admin")
    mentored_projects = relationship("Project", secondary="project_mentor", back_populates="mentors")
    assigned_issues = relationship("Issue", back_populates="assignee")
    pull_requests = relationship("PullRequest", foreign_keys="PullRequest.contributor_id", back_populates="contributor")
    merged_prs = relationship("PullRequest", foreign_keys="PullRequest.merged_by", back_populates="merger")
    badges = relationship("Badge", secondary="user_badge", back_populates="users")
    announcements = relationship("Announcement", back_populates="author")
"""
with open(os.path.join(backend_dir, "models", "user.py"), "w") as f: f.write(model_user)

model_project = """from sqlalchemy import Column, String, Text, ARRAY, ForeignKey, Table
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
"""
with open(os.path.join(backend_dir, "models", "project.py"), "w") as f: f.write(model_project)

model_issue = """from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey
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
"""
with open(os.path.join(backend_dir, "models", "issue.py"), "w") as f: f.write(model_issue)

model_pr = """from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
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
"""
with open(os.path.join(backend_dir, "models", "pull_request.py"), "w") as f: f.write(model_pr)

model_badge = """from sqlalchemy import Column, String, Table, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

user_badge = Table(
    'user_badge',
    Base.metadata,
    Column('user_id', String, ForeignKey('user.id'), primary_key=True),
    Column('badge_id', String, ForeignKey('badge.id'), primary_key=True),
    Column('awarded_at', DateTime, default=datetime.utcnow)
)

class Badge(Base):
    __tablename__ = "badge"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    icon = Column(String)
    
    users = relationship("User", secondary=user_badge, back_populates="badges")
"""
with open(os.path.join(backend_dir, "models", "badge.py"), "w") as f: f.write(model_badge)

model_ann = """from sqlalchemy import Column, String, Text, DateTime, ForeignKey
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
"""
with open(os.path.join(backend_dir, "models", "announcement.py"), "w") as f: f.write(model_ann)

import shutil
if os.path.exists(os.path.join(backend_dir, "models", "domain.py")):
    os.remove(os.path.join(backend_dir, "models", "domain.py"))

# 2. Frontend Types
os.makedirs(frontend_dir, exist_ok=True)
types_index = """export * from './user';
export * from './project';
export * from './issue';
export * from './pullRequest';
export * from './badge';
export * from './announcement';
"""
with open(os.path.join(frontend_dir, "index.ts"), "w") as f: f.write(types_index)

type_user = """export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatarUrl: string;
  role: string;
  college?: string;
  bio?: string;
  joinedAt: string;
}
"""
with open(os.path.join(frontend_dir, "user.ts"), "w") as f: f.write(type_user)

type_project = """export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  difficultyLevel: string;
  repoUrl: string;
  tags: string[];
  status: string;
  projectAdminId: string;
}
"""
with open(os.path.join(frontend_dir, "project.ts"), "w") as f: f.write(type_project)

type_issue = """export interface Issue {
  id: string;
  projectId: string;
  title: string;
  description: string;
  label: string;
  points: number;
  status: string;
  assignedTo?: string;
  createdAt: string;
}
"""
with open(os.path.join(frontend_dir, "issue.ts"), "w") as f: f.write(type_issue)

type_pr = """export interface PullRequest {
  id: string;
  issueId: string;
  projectId: string;
  contributorId: string;
  githubPrUrl: string;
  title: string;
  status: string;
  pointsAwarded: number;
  mergedBy?: string;
  submittedAt: string;
  mergedAt?: string;
}
"""
with open(os.path.join(frontend_dir, "pullRequest.ts"), "w") as f: f.write(type_pr)

type_badge = """export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}
"""
with open(os.path.join(frontend_dir, "badge.ts"), "w") as f: f.write(type_badge)

type_ann = """export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
}
"""
with open(os.path.join(frontend_dir, "announcement.ts"), "w") as f: f.write(type_ann)

print("Split models and types successfully.")
