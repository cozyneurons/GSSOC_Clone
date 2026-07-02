import json
import os
import sys
from datetime import datetime

# Add the parent directory to sys.path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.models.domain import User, Project, Issue, PullRequest, Badge, Announcement

def seed_data():
    # In case the tables don't exist, create them
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data")
    
    with open(os.path.join(data_dir, "users.json")) as f:
        users_data = json.load(f)
    
    with open(os.path.join(data_dir, "organizations.json")) as f:
        projects_data = json.load(f)
        
    with open(os.path.join(data_dir, "issues.json")) as f:
        issues_data = json.load(f)
        
    with open(os.path.join(data_dir, "pull_requests.json")) as f:
        prs_data = json.load(f)
        
    with open(os.path.join(data_dir, "badges.json")) as f:
        badges_data = json.load(f)
        
    with open(os.path.join(data_dir, "announcements.json")) as f:
        announcements_data = json.load(f)
        
    print("Seeding Users...")
    for u in users_data:
        db_user = User(
            id=u["id"],
            name=u["name"],
            email=u["email"],
            username=u["username"],
            avatar_url=u["avatarUrl"],
            role=u["role"],
            college=u.get("college"),
            bio=u.get("bio"),
            joined_at=datetime.fromisoformat(u["joinedAt"])
        )
        db.merge(db_user)
    db.commit()

    print("Seeding Badges Definitions...")
    for b in badges_data["definitions"]:
        db_badge = Badge(
            id=b["id"],
            name=b["name"],
            description=b["description"],
            icon=b["icon"]
        )
        db.merge(db_badge)
    db.commit()

    print("Seeding Projects...")
    for p in projects_data:
        db_project = Project(
            id=p["id"],
            name=p["name"],
            description=p["description"],
            tech_stack=p["techStack"],
            difficulty_level=p["difficultyLevel"],
            repo_url=p["repoUrl"],
            tags=p["tags"],
            status=p["status"],
            project_admin_id=p["projectAdminId"]
        )
        db.merge(db_project)
    db.commit()
    
    # Mentor associations
    print("Associating Mentors...")
    for p in projects_data:
        db_project = db.query(Project).filter(Project.id == p["id"]).first()
        if db_project:
            for mentor_id in p.get("mentorIds", []):
                db_mentor = db.query(User).filter(User.id == mentor_id).first()
                if db_mentor and db_mentor not in db_project.mentors:
                    db_project.mentors.append(db_mentor)
    db.commit()

    print("Seeding Issues...")
    for i in issues_data:
        db_issue = Issue(
            id=i["id"],
            project_id=i["projectId"],
            title=i["title"],
            description=i["description"],
            label=i["label"],
            points=i["points"],
            status=i["status"],
            assigned_to=i.get("assignedTo"),
            created_at=datetime.fromisoformat(i["createdAt"])
        )
        db.merge(db_issue)
    db.commit()

    print("Seeding Pull Requests...")
    for pr in prs_data:
        db_pr = PullRequest(
            id=pr["id"],
            issue_id=pr["issueId"],
            project_id=pr["projectId"],
            contributor_id=pr["contributorId"],
            github_pr_url=pr["githubPrUrl"],
            title=pr["title"],
            status=pr["status"],
            points_awarded=pr["pointsAwarded"],
            merged_by=pr.get("mergedBy"),
            submitted_at=datetime.fromisoformat(pr["submittedAt"]),
            merged_at=datetime.fromisoformat(pr["mergedAt"]) if pr.get("mergedAt") else None
        )
        db.merge(db_pr)
    db.commit()
    
    print("Seeding User Badges...")
    for ub in badges_data["userBadges"]:
        db_user = db.query(User).filter(User.id == ub["userId"]).first()
        db_badge = db.query(Badge).filter(Badge.id == ub["badgeId"]).first()
        if db_user and db_badge and db_badge not in db_user.badges:
            db_user.badges.append(db_badge)
            # Cannot easily set awarded_at via secondary in this simple loop without insert, but append works for base relations
    db.commit()

    print("Seeding Announcements...")
    for a in announcements_data:
        db_ann = Announcement(
            id=a["id"],
            title=a["title"],
            content=a["content"],
            author_id=a["authorId"],
            created_at=datetime.fromisoformat(a["createdAt"])
        )
        db.merge(db_ann)
    db.commit()

    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_data()
