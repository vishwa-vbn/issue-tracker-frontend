import { useQuery } from '@tanstack/react-query';
import { fetchIssueActivity } from '../api';
import { issueKeys } from '../keys';
import type { IssueActivity } from '../types';

export function useIssueActivity(issueId?: string) {
  return useQuery<IssueActivity[]>({
    queryKey: issueKeys.activity(issueId ?? ''),
    queryFn: () => fetchIssueActivity(issueId ?? ''),
    enabled: !!issueId,
  });
}

