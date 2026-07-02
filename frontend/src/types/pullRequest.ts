export interface PullRequest {
  id: string;
  issue_id: string;
  project_id: string;
  contributor_id: string;
  github_pr_url: string;
  title: string;
  status: string;
  points_awarded: number;
  merged_by?: string;
  submitted_at: string;
  merged_at?: string;
}
