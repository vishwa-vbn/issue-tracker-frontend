import { api } from '@/services/api';
import type { Comment, PaginatedCommentsResponse } from './types';

export async function fetchComments(
  issueId: string,
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedCommentsResponse> {
  const res = await api.get<PaginatedCommentsResponse>(`/issues/${issueId}/comments`, {
    params: { page, limit },
  });
  return res.data;
}

export async function addComment(issueId: string, body: string): Promise<Comment> {
  const res = await api.post<{ success: boolean; data: Comment }>(
    `/issues/${issueId}/comments`,
    { body },
  );
  return res.data.data;
}

export async function editComment(commentId: string, body: string): Promise<Comment> {
  const res = await api.patch<{ success: boolean; data: Comment }>(`/comments/${commentId}`, {
    body,
  });
  return res.data.data;
}

export async function deleteComment(commentId: string): Promise<void> {
  await api.delete<{ success: boolean; message?: string }>(`/comments/${commentId}`);
}

