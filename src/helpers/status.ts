import type { IssuePriority, IssueStatus } from '@/constants';

export function getStatusBadgeClass(status: IssueStatus): string {
  switch (status) {
    case 'OPEN':
      return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50';
    case 'IN_PROGRESS':
      return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50';
    case 'CLOSED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
}

export function getPriorityBadgeClass(priority: IssuePriority): string {
  switch (priority) {
    case 'LOW':
      return 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100';
    case 'MEDIUM':
      return 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100';
    case 'HIGH':
      return 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100';
    case 'CRITICAL':
      return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

