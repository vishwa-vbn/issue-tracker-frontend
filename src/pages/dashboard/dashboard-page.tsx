import { Link } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Layers,
  Plus,
  Shield,
  UserX,
  Users,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageHeader } from '@/components/common/page-header';
import { StatCard } from '@/features/dashboard/components/stat-card';
import { PriorityBreakdown } from '@/features/dashboard/components/priority-breakdown';
import { MyWorkCard } from '@/features/dashboard/components/my-work-card';
import { StatusBadge } from '@/components/controls/status-badge';
import { PriorityBadge } from '@/components/controls/priority-badge';
import { UserAvatar } from '@/components/controls/user-avatar';
import { DashboardSkeleton } from '@/components/common/skeleton-loader';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { useDashboard } from '@/features/dashboard/hooks/use-dashboard';
import { formatRelativeTime } from '@/utils/format-date';
import { ROUTES } from '@/constants';
import { useAppSelector } from '@/store';

export default function DashboardPage() {
  const { data, isPending, isError, error, refetch } = useDashboard();
  const user = useAppSelector((s) => s.auth.user);
  const isAdmin = user?.role === 'ADMIN';

  if (isPending) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" subtitle="Overview of project issues, metrics and team activity" />
        <DashboardSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" subtitle="Overview of project issues, metrics and activity" />
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  }

  const { totals, byPriority, mine, recent, admin } = data;

  return (
    <div className="space-y-8 animate-in fade-in-50">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of project issues, metrics and team activity"
        actions={
          <Button asChild className="gap-2 shadow-sm font-semibold">
            <Link to={ROUTES.ISSUE_NEW}>
              <Plus className="size-4" />
              New Issue
            </Link>
          </Button>
        }
      />

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Issues"
          value={totals.all}
          icon={<Layers className="size-5 text-indigo-600" />}
          description="All tracked issues in the repository"
          colorClass="bg-indigo-50 text-indigo-600 border-indigo-200"
          href={ROUTES.ISSUES}
        />
        <StatCard
          title="Open"
          value={totals.open}
          icon={<AlertCircle className="size-5 text-blue-600" />}
          description="New and awaiting resolution"
          colorClass="bg-blue-50 text-blue-600 border-blue-200"
          href={`${ROUTES.ISSUES}?status=OPEN`}
        />
        <StatCard
          title="In Progress"
          value={totals.inProgress}
          icon={<Clock className="size-5 text-amber-600" />}
          description="Actively worked on by assignees"
          colorClass="bg-amber-50 text-amber-600 border-amber-200"
          href={`${ROUTES.ISSUES}?status=IN_PROGRESS`}
        />
        <StatCard
          title="Closed"
          value={totals.closed}
          icon={<CheckCircle2 className="size-5 text-emerald-600" />}
          description="Resolved and completed issues"
          colorClass="bg-emerald-50 text-emerald-600 border-emerald-200"
          href={`${ROUTES.ISSUES}?status=CLOSED`}
        />
      </div>

      {/* Admin Quick Widget Row if Admin */}
      {isAdmin && admin && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Unassigned Issues"
            value={admin.unassigned}
            icon={<UserX className="size-5 text-rose-600" />}
            description="Issues needing an assignee"
            colorClass="bg-rose-50 text-rose-600 border-rose-200"
            href={`${ROUTES.ISSUES}?unassigned=true`}
          />
          <StatCard
            title="Total Users"
            value={admin.users.total}
            icon={<Users className="size-5 text-purple-600" />}
            description={`${admin.users.active} active accounts`}
            colorClass="bg-purple-50 text-purple-600 border-purple-200"
            href={ROUTES.ADMIN_USERS}
          />
          <div className="flex flex-col justify-center rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Shield className="size-4 text-amber-600" />
              <span>Admin Center</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage system permissions, roles and active team roster.
            </p>
            <div className="mt-3">
              <Button asChild variant="outline" size="sm" className="text-xs">
                <Link to={ROUTES.ADMIN_USERS}>Open User Management</Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Middle Grid: My Work & Priority Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MyWorkCard mine={mine} />
        </div>
        <div>
          <PriorityBreakdown byPriority={byPriority} />
        </div>
      </div>

      {/* Recent Issues Table */}
      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-semibold">Recent Issues</CardTitle>
            <CardDescription className="text-xs">
              Latest created or updated issues across all modules
            </CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs gap-1">
            <Link to={ROUTES.ISSUES}>
              View all issues
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {recent.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No recent issues"
                description="Create your first issue to start tracking tasks and bugs."
                action={
                  <Button asChild size="sm">
                    <Link to={ROUTES.ISSUE_NEW}>Create Issue</Link>
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-border">
                    <TableHead className="w-16 pl-5 text-xs font-bold uppercase tracking-wider text-slate-500">#</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Title</TableHead>
                    <TableHead className="w-28 text-xs font-bold uppercase tracking-wider text-slate-500">Status</TableHead>
                    <TableHead className="w-28 text-xs font-bold uppercase tracking-wider text-slate-500">Priority</TableHead>
                    <TableHead className="hidden md:table-cell text-xs font-bold uppercase tracking-wider text-slate-500">Assignee</TableHead>
                    <TableHead className="hidden sm:table-cell text-right pr-5 text-xs font-bold uppercase tracking-wider text-slate-500">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recent.map((issue, idx) => (
                    <TableRow key={issue.id} className={`transition-colors hover:bg-indigo-50/40 border-b border-border/60 last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                      <TableCell className="pl-5 font-mono text-[11px] font-bold">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">#{issue.issueNumber}</span>
                      </TableCell>
                      <TableCell>
                        <Link
                          to={ROUTES.ISSUE_DETAIL(issue.id)}
                          className="font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
                        >
                          {issue.title}
                        </Link>
                        <div className="sm:hidden text-xs text-muted-foreground mt-0.5">
                          {formatRelativeTime(issue.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={issue.status} />
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={issue.priority} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {issue.assignee ? (
                          <div className="flex items-center gap-2">
                            <UserAvatar name={issue.assignee.name} size="sm" />
                            <span className="text-xs font-medium truncate max-w-[120px]">
                              {issue.assignee.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            Unassigned
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-right pr-5 text-xs text-muted-foreground">
                        {formatRelativeTime(issue.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

