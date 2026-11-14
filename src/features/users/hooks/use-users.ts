import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchUsers } from '../api';
import type { UserFilters, PaginatedResponse, UserSummary } from '../types';

export function useUsers(filters: UserFilters) {
  return useQuery<PaginatedResponse<UserSummary>>({
    queryKey: ['users', 'admin', filters],
    queryFn: () => fetchUsers(filters),
    placeholderData: keepPreviousData,
  });
}

