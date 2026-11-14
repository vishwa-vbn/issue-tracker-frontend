import { describe, it, expect } from 'vitest';
import {
  isAdmin,
  canEditIssue,
  canChangeStatus,
  canAssign,
  canDeleteIssue,
} from './permissions';
import type { AuthUser } from '@/store/auth-slice';
import type { Issue } from './types';

describe('Issue Permissions', () => {
  const adminUser: AuthUser = {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN',
  };

  const normalUser1: AuthUser = {
    id: 'user-1',
    name: 'User One',
    email: 'user1@example.com',
    role: 'USER',
  };

  const normalUser2: AuthUser = {
    id: 'user-2',
    name: 'User Two',
    email: 'user2@example.com',
    role: 'USER',
  };

  const issue: Issue = {
    id: 'issue-1',
    issueNumber: 101,
    title: 'Bug report',
    description: 'Description',
    status: 'OPEN',
    priority: 'HIGH',
    reporterId: 'user-1',
    assigneeId: 'user-2',
    reporter: { id: 'user-1', name: 'User One' },
    assignee: { id: 'user-2', name: 'User Two' },
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  };

  it('correctly identifies admin users', () => {
    expect(isAdmin(adminUser)).toBe(true);
    expect(isAdmin(normalUser1)).toBe(false);
    expect(isAdmin(null)).toBe(false);
  });

  it('allows reporter and admin to edit issues, but forbids other users', () => {
    expect(canEditIssue(adminUser, issue)).toBe(true);
    expect(canEditIssue(normalUser1, issue)).toBe(true);
    expect(canEditIssue(normalUser2, issue)).toBe(false);
    expect(canEditIssue(null, issue)).toBe(false);
  });

  it('allows reporter, assignee, and admin to change issue status', () => {
    expect(canChangeStatus(adminUser, issue)).toBe(true);
    expect(canChangeStatus(normalUser1, issue)).toBe(true); // reporter
    expect(canChangeStatus(normalUser2, issue)).toBe(true); // assignee

    const thirdUser: AuthUser = {
      id: 'user-3',
      name: 'User Three',
      email: 'user3@example.com',
      role: 'USER',
    };
    expect(canChangeStatus(thirdUser, issue)).toBe(false);
    expect(canChangeStatus(null, issue)).toBe(false);
  });

  it('allows reporter and admin to assign or delete issue', () => {
    expect(canAssign(adminUser, issue)).toBe(true);
    expect(canAssign(normalUser1, issue)).toBe(true);
    expect(canAssign(normalUser2, issue)).toBe(false);

    expect(canDeleteIssue(adminUser, issue)).toBe(true);
    expect(canDeleteIssue(normalUser1, issue)).toBe(true);
    expect(canDeleteIssue(normalUser2, issue)).toBe(false);
  });
});

