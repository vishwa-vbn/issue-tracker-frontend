import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchComments } from '../api';
import { issueKeys } from '@/features/issues/keys';
import type { PaginatedCommentsResponse } from '../types';

export function useComments(issueId: string, page: number = 1) {
  return useQuery<PaginatedCommentsResponse>({
    queryKey: issueKeys.comments(issueId, page),
    queryFn: () => fetchComments(issueId, page),
    placeholderData: keepPreviousData,
    enabled: !!issueId,
  });
}

