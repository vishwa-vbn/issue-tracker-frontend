import { useQuery } from '@tanstack/react-query';
import { fetchIssueById } from '../api';
import { issueKeys } from '../keys';
import type { Issue } from '../types';

export function useIssue(id?: string) {
  return useQuery<Issue>({
    queryKey: issueKeys.detail(id ?? ''),
    queryFn: () => fetchIssueById(id ?? ''),
    enabled: !!id,
  });
}

