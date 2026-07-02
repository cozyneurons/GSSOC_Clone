export interface Issue {
  id: string;
  project_id: string;
  title: string;
  description: string;
  label: string;
  points: number;
  status: string;
  assigned_to?: string;
  created_at: string;
}
