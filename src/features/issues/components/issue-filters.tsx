import { Search, RotateCcw, UserCheck, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAssignableUsers } from '@/features/users/hooks/use-assignable-users';
import { ISSUE_PRIORITY, ISSUE_STATUS, PRIORITY_LABELS, STATUS_LABELS } from '@/constants';
import type { IssueFilters } from '../types';
import { useAppSelector } from '@/store';

interface IssueFiltersProps {
  filters: IssueFilters;
  onChange: (updated: Partial<IssueFilters>) => void;
  onReset: () => void;
}

export function IssueFiltersBar({ filters, onChange, onReset }: IssueFiltersProps) {
  const currentUserId = useAppSelector((s) => s.auth.user?.id);
  const { data: assignableUsers } = useAssignableUsers();

  const isMyIssuesActive = filters.assigneeId === currentUserId;

  const toggleMyIssues = () => {
    if (isMyIssuesActive) {
      onChange({ assigneeId: undefined, page: 1 });
    } else {
      onChange({ assigneeId: currentUserId, page: 1 });
    }
  };

  const hasActiveFilters = Boolean(
    filters.q ||
      filters.status ||
      filters.priority ||
      filters.assigneeId ||
      filters.unassigned ||
      (filters.sort && filters.sort !== 'createdAt') ||
      (filters.order && filters.order !== 'desc'),
  );

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-white p-3.5 shadow-2xs">
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search issues by title, description or keyword..."
            value={filters.q || ''}
            onChange={(e) => onChange({ q: e.target.value || undefined, page: 1 })}
            className="pl-8.5 pr-8 h-8.5 text-xs sm:text-sm bg-slate-50/50 hover:bg-white focus:bg-white border-border"
          />
          {filters.q && (
            <button
              onClick={() => onChange({ q: undefined, page: 1 })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Quick Filter: My Issues */}
        <Button
          variant={isMyIssuesActive ? 'default' : 'outline'}
          size="sm"
          onClick={toggleMyIssues}
          className="h-8.5 gap-1.5 shrink-0 text-xs font-semibold px-3 border-border"
        >
          <UserCheck className="size-3.5" />
          My Issues
        </Button>
      </div>

      {/* Dropdown Filters Row */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
        {/* Status Filter */}
        <div className="w-auto min-w-[120px]">
          <Select
            value={filters.status || 'ALL'}
            onValueChange={(val) =>
              onChange({ status: val === 'ALL' ? undefined : val, page: 1 })
            }
          >
            <SelectTrigger size="sm" className="h-8 text-xs font-medium bg-slate-50/60 border-slate-200">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value={ISSUE_STATUS.OPEN}>{STATUS_LABELS.OPEN}</SelectItem>
              <SelectItem value={ISSUE_STATUS.IN_PROGRESS}>{STATUS_LABELS.IN_PROGRESS}</SelectItem>
              <SelectItem value={ISSUE_STATUS.CLOSED}>{STATUS_LABELS.CLOSED}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Priority Filter */}
        <div className="w-auto min-w-[120px]">
          <Select
            value={filters.priority || 'ALL'}
            onValueChange={(val) =>
              onChange({ priority: val === 'ALL' ? undefined : val, page: 1 })
            }
          >
            <SelectTrigger size="sm" className="h-8 text-xs font-medium bg-slate-50/60 border-slate-200">
              <SelectValue placeholder="All Priority" />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="ALL">All Priority</SelectItem>
              <SelectItem value={ISSUE_PRIORITY.LOW}>{PRIORITY_LABELS.LOW}</SelectItem>
              <SelectItem value={ISSUE_PRIORITY.MEDIUM}>{PRIORITY_LABELS.MEDIUM}</SelectItem>
              <SelectItem value={ISSUE_PRIORITY.HIGH}>{PRIORITY_LABELS.HIGH}</SelectItem>
              <SelectItem value={ISSUE_PRIORITY.CRITICAL}>{PRIORITY_LABELS.CRITICAL}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Assignee Filter */}
        <div className="w-auto min-w-[140px]">
          <Select
            value={filters.unassigned ? 'UNASSIGNED' : filters.assigneeId || 'ALL'}
            onValueChange={(val) => {
              if (val === 'UNASSIGNED') {
                onChange({ unassigned: true, assigneeId: undefined, page: 1 });
              } else if (val === 'ALL') {
                onChange({ unassigned: undefined, assigneeId: undefined, page: 1 });
              } else {
                onChange({ unassigned: undefined, assigneeId: val, page: 1 });
              }
            }}
          >
            <SelectTrigger size="sm" className="h-8 text-xs font-medium bg-slate-50/60 border-slate-200">
              <SelectValue placeholder="All Assignees" />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="ALL">All Assignees</SelectItem>
              <SelectItem value="UNASSIGNED">Unassigned Only</SelectItem>
              {(assignableUsers ?? []).map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="w-auto min-w-[145px]">
          <Select
            value={`${filters.sort || 'createdAt'}-${filters.order || 'desc'}`}
            onValueChange={(val) => {
              const [sort, order] = val.split('-');
              onChange({ sort, order: order as 'asc' | 'desc', page: 1 });
            }}
          >
            <SelectTrigger size="sm" className="h-8 text-xs font-medium bg-slate-50/60 border-slate-200">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="createdAt-desc">Newest First</SelectItem>
              <SelectItem value="createdAt-asc">Oldest First</SelectItem>
              <SelectItem value="priority-desc">Highest Priority</SelectItem>
              <SelectItem value="status-asc">Status</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset button if any filter active */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 text-xs gap-1 text-slate-500 hover:text-slate-900 ml-auto"
          >
            <RotateCcw className="size-3" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
