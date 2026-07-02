import json
import random
from datetime import datetime, timedelta
import uuid

def generate_id():
    return str(uuid.uuid4())

def random_date(start_days_ago=30, end_days_ago=0):
    start = datetime.now() - timedelta(days=start_days_ago)
    end = datetime.now() - timedelta(days=end_days_ago)
    return start + (end - start) * random.random()

# Users
users = []
participants = []
mentors = []
project_admins = []
admins = []

def create_user(role, i):
    user_id = generate_id()
    name = f"{role.capitalize()} {i}"
    user = {
        "id": user_id,
        "name": name,
        "email": f"{role}{i}@example.com",
        "username": f"{role}{i}",
        "avatarUrl": f"https://api.dicebear.com/7.x/avataaars/svg?seed={role}{i}",
        "role": role,
        "college": f"College {random.randint(1, 10)}",
        "bio": f"I am a {role} at GSSOC.",
        "joinedAt": random_date(60, 30).isoformat()
    }
    users.append(user)
    if role == "participant": participants.append(user_id)
    elif role == "mentor": mentors.append(user_id)
    elif role == "project_admin": project_admins.append(user_id)
    elif role == "admin": admins.append(user_id)

for i in range(1, 41): create_user("participant", i)
for i in range(1, 9): create_user("mentor", i)
for i in range(1, 6): create_user("project_admin", i)
for i in range(1, 3): create_user("admin", i)

# Organizations/Projects
projects = []
tech_stacks = ["React", "Python", "Node.js", "Django", "Next.js", "FastAPI", "PostgreSQL", "MongoDB"]
for i in range(1, 16):
    project_id = generate_id()
    project = {
        "id": project_id,
        "name": f"Project {i}",
        "description": f"An awesome open source project {i}",
        "techStack": random.sample(tech_stacks, k=random.randint(2, 4)),
        "difficultyLevel": random.choice(["Beginner", "Intermediate", "Advanced"]),
        "repoUrl": f"https://github.com/gssoc/project-{i}",
        "tags": ["web", "backend", "frontend"][:random.randint(1, 3)],
        "projectAdminId": random.choice(project_admins),
        "mentorIds": random.sample(mentors, k=random.randint(1, 3)),
        "status": "active"
    }
    projects.append(project)

# Issues
issues = []
labels = ["level1", "level2", "level3"]
points_map = {"level1": 10, "level2": 25, "level3": 45}
for i in range(1, 81):
    label = random.choice(labels)
    issue_id = generate_id()
    issue = {
        "id": issue_id,
        "projectId": random.choice(projects)["id"],
        "title": f"Issue {i}: Fix a bug or add a feature",
        "description": f"Description for issue {i}",
        "label": label,
        "points": points_map[label],
        "status": random.choice(["open", "assigned", "closed"]),
        "assignedTo": random.choice(participants) if random.random() > 0.5 else None,
        "createdAt": random_date(30, 10).isoformat()
    }
    issues.append(issue)

# Pull Requests
pull_requests = []
statuses = ["open", "merged", "rejected"]
for i in range(1, 121):
    issue = random.choice(issues)
    status = random.choice(statuses)
    submitted_at = random_date(10, 2)
    merged_at = (submitted_at + timedelta(days=random.randint(1, 3))).isoformat() if status == "merged" else None
    
    pr = {
        "id": generate_id(),
        "issueId": issue["id"],
        "projectId": issue["projectId"],
        "contributorId": random.choice(participants),
        "githubPrUrl": f"https://github.com/gssoc/project/pull/{i}",
        "title": f"Fixing {issue['title']}",
        "status": status,
        "pointsAwarded": issue["points"] if status == "merged" else 0,
        "mergedBy": random.choice(mentors) if status == "merged" else None,
        "submittedAt": submitted_at.isoformat(),
        "mergedAt": merged_at
    }
    pull_requests.append(pr)

# Leaderboard
user_points = {p: 0 for p in participants}
for pr in pull_requests:
    if pr["status"] == "merged":
        user_points[pr["contributorId"]] += pr["pointsAwarded"]

leaderboard = []
sorted_participants = sorted(user_points.items(), key=lambda x: x[1], reverse=True)
for rank, (user_id, points) in enumerate(sorted_participants, 1):
    user_info = next(u for u in users if u["id"] == user_id)
    leaderboard.append({
        "userId": user_id,
        "name": user_info["name"],
        "username": user_info["username"],
        "avatarUrl": user_info["avatarUrl"],
        "totalPoints": points,
        "rank": rank
    })

# Badges
badges_def = [
    {"id": "badge_1", "name": "First PR Merged", "description": "Awarded for merging the first PR", "icon": "⭐"},
    {"id": "badge_2", "name": "Top 10", "description": "In the top 10 of the leaderboard", "icon": "🏆"},
    {"id": "badge_3", "name": "Level 3 Master", "description": "Completed a Level 3 issue", "icon": "🔥"}
]
user_badges = []
for i, entry in enumerate(leaderboard):
    if entry["totalPoints"] > 0:
        user_badges.append({"userId": entry["userId"], "badgeId": "badge_1", "awardedAt": random_date(5, 0).isoformat()})
    if i < 10:
        user_badges.append({"userId": entry["userId"], "badgeId": "badge_2", "awardedAt": random_date(2, 0).isoformat()})

badges = {
    "definitions": badges_def,
    "userBadges": user_badges
}

# Announcements
announcements = []
for i in range(1, 8):
    announcements.append({
        "id": generate_id(),
        "title": f"Announcement {i}",
        "content": f"This is an important announcement about the program {i}.",
        "authorId": random.choice(admins),
        "createdAt": random_date(20, 1).isoformat()
    })

# Save JSON files
def save_json(filename, data):
    with open(f"data/{filename}", "w") as f:
        json.dump(data, f, indent=2)

save_json("users.json", users)
save_json("organizations.json", projects)
save_json("issues.json", issues)
save_json("pull_requests.json", pull_requests)
save_json("leaderboard.json", leaderboard)
save_json("badges.json", badges)
save_json("announcements.json", announcements)

print("Seed data generated successfully in data/ folder.")
