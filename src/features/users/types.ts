import type { UserRole } from '@/constants';

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  reportedIssues: number;
  assignedIssues: number;
}

export interface UserDetails extends UserSummary {
  stats: UserStats;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive?: boolean;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
  password?: string;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: string;
  isActive?: boolean | string;
  q?: string;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginatedMeta;
}
