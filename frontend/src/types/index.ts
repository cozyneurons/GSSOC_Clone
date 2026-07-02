export interface User {
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

export interface Project {
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

export interface Issue {
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

export interface PullRequest {
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

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
}
