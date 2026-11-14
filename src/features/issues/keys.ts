import type { IssueFilters } from './types';

export const issueKeys = {
  all: ['issues'] as const,
  lists: () => [...issueKeys.all, 'list'] as const,
  list: (filters: IssueFilters) => [...issueKeys.lists(), filters] as const,
  detail: (id: string) => [...issueKeys.all, 'detail', id] as const,
  activity: (id: string) => [...issueKeys.all, 'activity', id] as const,
  comments: (id: string, page?: number) => ['comments', id, page ?? 1] as const,
};

