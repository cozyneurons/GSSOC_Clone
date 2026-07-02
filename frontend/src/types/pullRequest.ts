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
