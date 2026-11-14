import type { IssuePriority, IssueStatus } from '@/constants';
import type { PaginatedMeta } from '@/features/users/types';

export interface IssueUserRef {
  id: string;
  name: string;
  email?: string;
}

export interface Issue {
  id: string;
  issueNumber: number;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  reporterId: string;
  assigneeId: string | null;
  reporter: IssueUserRef;
  assignee: IssueUserRef | null;
  commentCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface IssueFilters {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  assigneeId?: string;
  reporterId?: string;
  q?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  unassigned?: boolean;
}

export interface PaginatedIssuesResponse {
  success: boolean;
  data: Issue[];
  meta: PaginatedMeta;
}

export interface IssueActivity {
  id: string;
  issueId: string;
  type: string;
  fromValue?: string | null;
  toValue?: string | null;
  actor: IssueUserRef;
  createdAt: string;
}

