export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  profileImageUrl: string;
  description: string;
  createdAt: Date;
}