import { useQuery } from '@tanstack/react-query';
import { fetchUserDetails } from '../api';

export function useUserDetails(userId: string | null | undefined) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => {
      if (!userId) throw new Error('User ID is required');
      return fetchUserDetails(userId);
    },
    enabled: Boolean(userId),
    staleTime: 30 * 1000,
  });
}

