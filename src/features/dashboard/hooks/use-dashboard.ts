import { useQuery } from '@tanstack/react-query';
import { fetchDashboardSummary } from '../api';
import type { DashboardSummary } from '../types';

export function useDashboard() {
  return useQuery<DashboardSummary>({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardSummary,
  });
}

