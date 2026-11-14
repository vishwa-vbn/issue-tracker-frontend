import { api } from '@/services/api';
import type {
  UserSummary,
  UserDetails,
  UserFilters,
  PaginatedResponse,
  CreateUserInput,
  UpdateUserInput,
} from './types';

export async function fetchAssignableUsers(): Promise<UserSummary[]> {
  const res = await api.get<{ success: boolean; data: UserSummary[] }>('/users/assignable');
  return res.data.data;
}

export async function fetchUsers(filters: UserFilters): Promise<PaginatedResponse<UserSummary>> {
  const res = await api.get<PaginatedResponse<UserSummary>>('/users', { params: filters });
  return res.data;
}

export async function fetchUserDetails(userId: string): Promise<UserDetails> {
  const res = await api.get<{ success: boolean; data: UserDetails }>(`/users/${userId}`);
  return res.data.data;
}

export async function createUser(payload: CreateUserInput): Promise<UserSummary> {
  const res = await api.post<{ success: boolean; data: UserSummary }>('/users', payload);
  return res.data.data;
}

export async function updateUser(
  userId: string,
  payload: UpdateUserInput,
): Promise<UserSummary> {
  const res = await api.patch<{ success: boolean; data: UserSummary }>(`/users/${userId}`, payload);
  return res.data.data;
}

export async function deleteUser(userId: string): Promise<void> {
  await api.delete(`/users/${userId}`);
}
