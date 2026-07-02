from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProjectBase(BaseModel):
    name: str
    description: str
    tech_stack: List[str]
    difficulty_level: str
    repo_url: str
    tags: List[str]
    status: str

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: str
    project_admin_id: str
    
    class Config:
        from_attributes = True

class IssueBase(BaseModel):
    title: str
    description: str
    label: str
    points: int
    status: str

class IssueCreate(IssueBase):
    pass

class IssueResponse(IssueBase):
    id: str
    project_id: str
    assigned_to: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class PullRequestBase(BaseModel):
    github_pr_url: str
    title: str

class PullRequestCreate(PullRequestBase):
    issue_id: str
    project_id: str

class PullRequestUpdate(BaseModel):
    status: str
    points_awarded: int

class PullRequestResponse(PullRequestBase):
    id: str
    issue_id: str
    project_id: str
    contributor_id: str
    status: str
    points_awarded: int
    merged_by: Optional[str] = None
    submitted_at: datetime
    merged_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class BadgeResponse(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    
    class Config:
        from_attributes = True

class AnnouncementResponse(BaseModel):
    id: str
    title: str
    content: str
    author_id: str
    created_at: datetime

    class Config:
        from_attributes = True
