import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/common/page-header';
import { StatusBadge } from '@/components/controls/status-badge';
import { PriorityBadge } from '@/components/controls/priority-badge';
import { UserAvatar } from '@/components/controls/user-avatar';
import { StatusSelect } from '@/features/issues/components/status-select';
import { AssigneeCombobox } from '@/features/issues/components/assignee-combobox';
import { ActivityTimeline } from '@/features/issues/components/activity-timeline';
import { CommentList } from '@/features/comments/components/comment-list';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { DetailSkeleton } from '@/components/common/skeleton-loader';
import { ErrorState } from '@/components/common/error-state';
import { useIssue } from '@/features/issues/hooks/use-issue';
import { useDeleteIssue } from '@/features/issues/hooks/use-delete-issue';
import {
  canChangeStatus,
  canEditIssue,
  canAssign,
  canDeleteIssue,
} from '@/features/issues/permissions';
import { formatDateTime } from '@/utils/format-date';
import { ROUTES } from '@/constants';
import { useAppSelector } from '@/store';

export default function IssueDetailPage() {
  const { issueId } = useParams<{ issueId: string }>();
  const user = useAppSelector((s) => s.auth.user);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: issue, isPending, isError, error, refetch } = useIssue(issueId);
  const deleteMutation = useDeleteIssue();

  if (isPending) {
    return (
      <div className="space-y-6">
        <PageHeader title="Issue Details" backTo={ROUTES.ISSUES} />
        <DetailSkeleton />
      </div>
    );
  }

  if (isError || !issue) {
    return (
      <div className="space-y-6">
        <PageHeader title="Issue Details" backTo={ROUTES.ISSUES} />
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  }

  const allowEdit = canEditIssue(user, issue);
  const allowStatus = canChangeStatus(user, issue);
  const allowAssign = canAssign(user, issue);
  const allowDelete = canDeleteIssue(user, issue);

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <PageHeader
        title={`#${issue.issueNumber} ${issue.title}`}
        backTo={ROUTES.ISSUES}
        actions={
          <div className="flex items-center gap-2">
            {allowEdit && (
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <Link to={ROUTES.ISSUE_EDIT(issue.id)}>
                  <Pencil className="size-3.5" />
                  Edit
                </Link>
              </Button>
            )}
            {allowDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="gap-1.5 text-destructive hover:bg-destructive/10 border-destructive/30"
              >
                <Trash2 className="size-3.5" />
                Delete
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left main area (Description + Comments) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Issue Description Card */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-4 border-b border-border/60 flex flex-row items-center justify-between px-6 pt-5">
              <div className="flex items-center gap-3">
                <UserAvatar name={issue.reporter?.name} size="md" />
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {issue.reporter?.name || 'Reporter'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Reported on {formatDateTime(issue.createdAt)}
                  </div>
                </div>
              </div>
              <StatusBadge status={issue.status} />
            </CardHeader>
            <CardContent className="pt-5 px-6 pb-6">
              {issue.description ? (
                <div className="text-sm text-foreground whitespace-pre-wrap break-words leading-relaxed">
                  {issue.description}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No additional description provided for this issue.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Comment & Discussion Section */}
          <Card className="border-border shadow-sm px-6 py-5">
            <CommentList issueId={issue.id} />
          </Card>
        </div>

        {/* Right Sidebar (Details, Status, Assignee, Activity) */}
        <div className="space-y-5">
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-0 pt-4 px-5">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Properties</CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-4 space-y-5 text-sm">
              {/* Status */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">
                  Status
                </span>
                {allowStatus ? (
                  <StatusSelect issueId={issue.id} status={issue.status} />
                ) : (
                  <div>
                    <StatusBadge status={issue.status} />
                  </div>
                )}
              </div>

              <div className="border-t border-border/60" />

              {/* Priority */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">
                  Priority
                </span>
                <div>
                  <PriorityBadge priority={issue.priority} />
                </div>
              </div>

              <div className="border-t border-border/60" />

              {/* Assignee */}
              <div className="space-y-2">
                {allowAssign ? (
                  <AssigneeCombobox
                    issueId={issue.id}
                    assigneeId={issue.assignee?.id ?? null}
                  />
                ) : (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70 block mb-2">
                      Assignee
                    </span>
                    {issue.assignee ? (
                      <div className="flex items-center gap-2.5">
                        <UserAvatar name={issue.assignee.name} size="sm" />
                        <span className="text-sm font-medium">{issue.assignee.name}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Unassigned</span>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-border/60" />

              {/* Reporter */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70 block">
                  Reporter
                </span>
                <div className="flex items-center gap-2.5">
                  <UserAvatar name={issue.reporter?.name} size="sm" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold truncate">{issue.reporter?.name}</span>
                    {issue.reporter?.email && (
                      <span className="text-xs text-muted-foreground truncate">{issue.reporter.email}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-border/60" />

              {/* Dates */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Created</span>
                  <span className="text-xs font-semibold text-foreground">
                    {formatDateTime(issue.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Updated</span>
                  <span className="text-xs font-semibold text-foreground">
                    {formatDateTime(issue.updatedAt)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline Card */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-0 pt-4 px-5">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Activity</CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-4">
              <ActivityTimeline issueId={issue.id} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Issue?"
        description={`Are you sure you want to delete Issue #${issue.issueNumber}: "${issue.title}"? This will permanently remove the issue, its comments, and activity history.`}
        confirmText="Delete Issue"
        isDestructive
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(issue.id)}
      />
    </div>
  );
}
