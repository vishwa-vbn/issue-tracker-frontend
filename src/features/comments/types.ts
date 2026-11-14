import type { IssueUserRef } from '@/features/issues/types';
import type { PaginatedMeta } from '@/features/users/types';

export interface Comment {
  id: string;
  issueId: string;
  authorId: string;
  author: IssueUserRef;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedCommentsResponse {
  success: boolean;
  data: Comment[];
  meta: PaginatedMeta;
}

