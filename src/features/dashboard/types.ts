import type { IssuePriority, IssueStatus } from '@/constants';

export interface DashboardRecentIssue {
  id: string;
  issueNumber: number;
  title: string;
  status: IssueStatus;
  priority: IssuePriority;
  createdAt: string;
  reporter: {
    id: string;
    name: string;
  };
  assignee: {
    id: string;
    name: string;
  } | null;
}

export interface DashboardSummary {
  totals: {
    all: number;
    open: number;
    inProgress: number;
    closed: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  mine: {
    assigned: number;
    assignedOpen: number;
    reported: number;
  };
  recent: DashboardRecentIssue[];
  admin?: {
    unassigned: number;
    users: {
      total: number;
      active: number;
    };
  };
}

