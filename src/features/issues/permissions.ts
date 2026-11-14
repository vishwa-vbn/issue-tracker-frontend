import type { AuthUser } from '@/store/auth-slice';
import type { Issue } from './types';

export const isAdmin = (u: AuthUser | null): boolean => u?.role === 'ADMIN';

export const canEditIssue = (u: AuthUser | null, i?: Issue | null): boolean => {
  if (!u || !i) return false;
  return isAdmin(u) || i.reporter?.id === u.id;
};

export const canChangeStatus = (u: AuthUser | null, i?: Issue | null): boolean => {
  if (!u || !i) return false;
  return isAdmin(u) || i.reporter?.id === u.id || i.assignee?.id === u.id;
};

export const canAssign = canEditIssue;

export const canDeleteIssue = canEditIssue;

