import { api } from '@/services/api';
import type { DashboardSummary } from './types';

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const res = await api.get<{ success: boolean; data: DashboardSummary }>('/dashboard/summary');
  return res.data.data;
}

