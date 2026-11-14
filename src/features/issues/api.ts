import { api } from '@/services/api';
import type {
  Issue,
  IssueFilters,
  PaginatedIssuesResponse,
  IssueActivity,
} from './types';
import type { IssueFormValues } from './schemas';
import type { IssueStatus } from '@/constants';

export async function fetchIssues(filters: IssueFilters): Promise<PaginatedIssuesResponse> {
  const params: Record<string, unknown> = { ...filters };
  if (filters.unassigned) {
    params.assigneeId = 'null';
  }
  const res = await api.get<PaginatedIssuesResponse>('/issues', { params });
  return res.data;
}

export async function fetchIssueById(id: string): Promise<Issue> {
  const res = await api.get<{ success: boolean; data: Issue }>(`/issues/${id}`);
  return res.data.data;
}

export async function createIssue(data: IssueFormValues): Promise<Issue> {
  const res = await api.post<{ success: boolean; data: Issue }>('/issues', data);
  return res.data.data;
}

export async function updateIssue(
  id: string,
  data: Partial<IssueFormValues>,
): Promise<Issue> {
  const res = await api.patch<{ success: boolean; data: Issue }>(`/issues/${id}`, data);
  return res.data.data;
}

export async function changeIssueStatus(id: string, status: IssueStatus): Promise<Issue> {
  const res = await api.patch<{ success: boolean; data: Issue }>(`/issues/${id}/status`, {
    status,
  });
  return res.data.data;
}

export async function assignIssue(id: string, assigneeId: string | null): Promise<Issue> {
  const res = await api.patch<{ success: boolean; data: Issue }>(`/issues/${id}/assignee`, {
    assigneeId,
  });
  return res.data.data;
}

export async function deleteIssue(id: string): Promise<void> {
  await api.delete<{ success: boolean; message?: string }>(`/issues/${id}`);
}

export async function fetchIssueActivity(id: string): Promise<IssueActivity[]> {
  const res = await api.get<{ success: boolean; data: IssueActivity[] }>(`/issues/${id}/activity`);
  return res.data.data;
}

