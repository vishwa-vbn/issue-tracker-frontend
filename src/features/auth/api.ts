import { api } from '@/services/api';
import type { LoginValues, RegisterValues } from './schemas';
import type { AuthResponseData, User } from './types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export async function loginApi(credentials: LoginValues): Promise<AuthResponseData> {
  const res = await api.post<ApiResponse<AuthResponseData>>('/auth/login', credentials);
  return res.data.data;
}

export async function adminLoginApi(credentials: LoginValues): Promise<AuthResponseData> {
  const res = await api.post<ApiResponse<AuthResponseData>>('/auth/admin/login', credentials);
  return res.data.data;
}

export async function registerApi(data: RegisterValues): Promise<AuthResponseData> {
  const res = await api.post<ApiResponse<AuthResponseData>>('/auth/register', data);
  return res.data.data;
}

export async function refreshApi(): Promise<AuthResponseData> {
  const res = await api.post<ApiResponse<AuthResponseData>>('/auth/refresh');
  return res.data.data;
}

export async function logoutApi(): Promise<void> {
  await api.post<ApiResponse<null>>('/auth/logout');
}

export async function getMeApi(): Promise<User> {
  const res = await api.get<ApiResponse<{ user: User }>>('/auth/me');
  return res.data.data.user;
}

