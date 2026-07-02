export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar_url: string;
  role: string;
  college?: string;
  bio?: string;
  joined_at: string;
}
