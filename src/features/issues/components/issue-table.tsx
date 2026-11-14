import { Link } from 'react-router-dom';
import { MessageSquare, ExternalLink, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/controls/status-badge';
import { PriorityBadge } from '@/components/controls/priority-badge';
import { UserAvatar } from '@/components/controls/user-avatar';
import { formatRelativeTime } from '@/utils/format-date';
import { ROUTES } from '@/constants';
import type { Issue } from '../types';

interface IssueTableProps {
  issues: Issue[];
  isFetching?: boolean;
}

export function IssueTable({ issues, isFetching = false }: IssueTableProps) {
  return (
    <div className="relative rounded-xl border border-border bg-card shadow-2xs overflow-hidden">
      {/* Top Indeterminate Loading Progress Bar (active when switching pages or filtering) */}
      {isFetching && (
        <div className="absolute inset-x-0 top-0 h-1 z-30 overflow-hidden bg-primary/15">
          <div className="h-full bg-primary animate-indeterminate w-1/3" />
        </div>
      )}

      {/* Floating Status Badge when fetching */}
      {isFetching && (
        <div className="absolute top-2.5 right-4 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 border border-primary/20 text-[11px] font-semibold text-primary shadow-xs backdrop-blur-xs animate-in fade-in-50 duration-150">
          <Loader2 className="size-3 animate-spin text-primary" />
          <span>Updating table...</span>
        </div>
      )}

      {/* Desktop Table View */}
      <div className={`hidden md:block overflow-x-auto transition-opacity duration-200 ${isFetching ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-border">
              <TableHead className="w-16 pl-5 text-xs font-bold uppercase tracking-wider text-slate-500">
                #
              </TableHead>
              <TableHead className="min-w-[280px] text-xs font-bold uppercase tracking-wider text-slate-500">
                Title
              </TableHead>
              <TableHead className="w-32 text-xs font-bold uppercase tracking-wider text-slate-500">
                Status
              </TableHead>
              <TableHead className="w-28 text-xs font-bold uppercase tracking-wider text-slate-500">
                Priority
              </TableHead>
              <TableHead className="w-44 text-xs font-bold uppercase tracking-wider text-slate-500">
                Assignee
              </TableHead>
              <TableHead className="w-36 text-xs font-bold uppercase tracking-wider text-slate-500">
                Reporter
              </TableHead>
              <TableHead className="w-14 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                <MessageSquare className="size-3.5 mx-auto text-slate-400" />
              </TableHead>
              <TableHead className="w-28 text-right pr-5 text-xs font-bold uppercase tracking-wider text-slate-500">
                Created
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.map((issue, idx) => (
              <TableRow
                key={issue.id}
                className={`group transition-colors hover:bg-indigo-50/50 border-b border-border/60 last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}
              >
                <TableCell className="pl-5 font-mono text-xs font-bold text-muted-foreground">
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                    #{issue.issueNumber}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <Link
                      to={ROUTES.ISSUE_DETAIL(issue.id)}
                      className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 inline-flex items-center gap-1.5"
                    >
                      {issue.title}
                      <ExternalLink className="size-3 opacity-0 group-hover:opacity-60 transition-opacity shrink-0" />
                    </Link>
                    {issue.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {issue.description}
                      </p>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <StatusBadge status={issue.status} />
                </TableCell>

                <TableCell>
                  <PriorityBadge priority={issue.priority} />
                </TableCell>

                <TableCell>
                  {issue.assignee ? (
                    <div className="flex items-center gap-2 min-w-0">
                      <UserAvatar name={issue.assignee.name} size="sm" />
                      <span className="text-xs font-medium text-foreground truncate">
                        {issue.assignee.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">Unassigned</span>
                  )}
                </TableCell>

                <TableCell>
                  <span className="text-xs text-muted-foreground truncate block max-w-[130px]">
                    {issue.reporter?.name || '—'}
                  </span>
                </TableCell>

                <TableCell className="text-center">
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-medium">
                    <MessageSquare className="size-3" />
                    {issue.commentCount ?? 0}
                  </span>
                </TableCell>

                <TableCell className="text-right pr-5 text-xs text-muted-foreground whitespace-nowrap">
                  {formatRelativeTime(issue.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card List View */}
      <div className={`divide-y divide-border md:hidden transition-opacity duration-200 ${isFetching ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
        {issues.map((issue) => (
          <Link
            key={issue.id}
            to={ROUTES.ISSUE_DETAIL(issue.id)}
            className="block p-4 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                  #{issue.issueNumber}
                </span>
                <StatusBadge status={issue.status} />
              </div>
              <PriorityBadge priority={issue.priority} />
            </div>

            <div className="font-semibold text-sm text-foreground line-clamp-2 mb-2.5">
              {issue.title}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                {issue.assignee ? (
                  <div className="flex items-center gap-1.5">
                    <UserAvatar name={issue.assignee.name} size="sm" />
                    <span className="truncate max-w-[120px]">{issue.assignee.name}</span>
                  </div>
                ) : (
                  <span className="italic">Unassigned</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <MessageSquare className="size-3" />
                  {issue.commentCount ?? 0}
                </span>
                <span>{formatRelativeTime(issue.createdAt)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
