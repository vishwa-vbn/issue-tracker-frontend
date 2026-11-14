import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchIssues } from '../api';
import { issueKeys } from '../keys';
import type { IssueFilters, PaginatedIssuesResponse } from '../types';

export function useIssues(filters: IssueFilters) {
  return useQuery<PaginatedIssuesResponse>({
    queryKey: issueKeys.list(filters),
    queryFn: () => fetchIssues(filters),
    placeholderData: keepPreviousData,
  });
}

