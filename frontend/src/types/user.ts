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
