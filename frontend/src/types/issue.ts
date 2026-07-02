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
