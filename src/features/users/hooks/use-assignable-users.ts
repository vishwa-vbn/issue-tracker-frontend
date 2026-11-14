import { useQuery } from '@tanstack/react-query';
import { fetchAssignableUsers } from '../api';
import type { UserSummary } from '../types';

export function useAssignableUsers() {
  return useQuery<UserSummary[]>({
    queryKey: ['users', 'assignable'],
    queryFn: fetchAssignableUsers,
    staleTime: 60_000,
  });
}

