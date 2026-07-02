# Database Schema

This document outlines the database schema and relationships for the GSSOC-style open-source program platform.

## `users`
Represents participants, mentors, project admins, and admins.
- `id` (String, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `username` (String, Unique)
- `avatarUrl` (String)
- `role` (String: "participant", "mentor", "project_admin", "admin")
- `college` (String)
- `bio` (Text)
- `joinedAt` (DateTime)

## `projects`
Represents organizations or projects in the program.
- `id` (String, Primary Key)
- `name` (String)
- `description` (Text)
- `techStack` (Array of Strings)
- `difficultyLevel` (String)
- `repoUrl` (String)
- `tags` (Array of Strings)
- `projectAdminId` (String, Foreign Key to `users.id`)
- `status` (String)
*Many-to-Many Relationship with `mentors` (users)*

## `issues`
Represents issues across the projects.
- `id` (String, Primary Key)
- `projectId` (String, Foreign Key to `projects.id`)
- `title` (String)
- `description` (Text)
- `label` (String: "level1", "level2", "level3")
- `points` (Integer)
- `status` (String: "open", "assigned", "closed")
- `assignedTo` (String, Foreign Key to `users.id`, Nullable)
- `createdAt` (DateTime)

## `pull_requests`
Represents pull requests submitted by participants.
- `id` (String, Primary Key)
- `issueId` (String, Foreign Key to `issues.id`)
- `projectId` (String, Foreign Key to `projects.id`)
- `contributorId` (String, Foreign Key to `users.id`)
- `githubPrUrl` (String)
- `title` (String)
- `status` (String: "open", "merged", "rejected")
- `pointsAwarded` (Integer)
- `mergedBy` (String, Foreign Key to `users.id`, Nullable)
- `submittedAt` (DateTime)
- `mergedAt` (DateTime, Nullable)

## `leaderboard`
This is conceptually a view derived from `users` and their accumulated `pull_requests` points.
- `userId` (String, Foreign Key to `users.id`)
- `name` (String)
- `username` (String)
- `avatarUrl` (String)
- `totalPoints` (Integer)
- `rank` (Integer)

## `badges`
Represents badges that users can earn.
- **Definitions**:
  - `id` (String, Primary Key)
  - `name` (String)
  - `description` (String)
  - `icon` (String)
- **User Badges** (Many-to-Many):
  - `userId` (String, Foreign Key to `users.id`)
  - `badgeId` (String, Foreign Key to `badges.id`)
  - `awardedAt` (DateTime)

## `announcements`
Represents program announcements.
- `id` (String, Primary Key)
- `title` (String)
- `content` (Text)
- `authorId` (String, Foreign Key to `users.id`)
- `createdAt` (DateTime)

## Relationships summary
- A `User` (Project Admin) can manage multiple `Projects`.
- A `Project` can have multiple `Mentors` (Users) and one `Project Admin` (User).
- A `Project` has multiple `Issues`.
- An `Issue` belongs to one `Project`, and can be assigned to one `User` (Participant).
- A `Pull Request` belongs to one `Issue` and one `Project`, created by one `User` (Participant), and optionally merged by one `User` (Mentor/Admin).
- A `User` can have multiple `Badges`.
- A `User` (Admin) can create multiple `Announcements`.
