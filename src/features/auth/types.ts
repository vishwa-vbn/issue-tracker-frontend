import type { UserRole } from '@/constants';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponseData {
  user: User;
  accessToken: string;
}

