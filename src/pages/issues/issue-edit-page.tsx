import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/page-header';
import { IssueForm } from '@/features/issues/components/issue-form';
import { DetailSkeleton } from '@/components/common/skeleton-loader';
import { ErrorState } from '@/components/common/error-state';
import { useIssue } from '@/features/issues/hooks/use-issue';
import { useUpdateIssue } from '@/features/issues/hooks/use-update-issue';
import { canEditIssue } from '@/features/issues/permissions';
import { ROUTES } from '@/constants';
import { useAppSelector } from '@/store';
import type { IssueFormValues } from '@/features/issues/schemas';

export default function IssueEditPage() {
  const { issueId } = useParams<{ issueId: string }>();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  const { data: issue, isPending, isError, error, refetch } = useIssue(issueId);
  const updateIssueMutation = useUpdateIssue();

  if (isPending) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Issue" backTo={issueId ? ROUTES.ISSUE_DETAIL(issueId) : ROUTES.ISSUES} />
        <DetailSkeleton />
      </div>
    );
  }

  if (isError || !issue) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Issue" backTo={ROUTES.ISSUES} />
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  }

  if (!canEditIssue(user, issue)) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Issue" backTo={ROUTES.ISSUE_DETAIL(issue.id)} />
        <div className="p-8 text-center bg-card rounded-xl border border-destructive/20 text-destructive">
          You are not authorized to edit this issue. Only the original reporter or an administrator may edit details.
        </div>
      </div>
    );
  }

  const handleSubmit = async (values: IssueFormValues) => {
    await updateIssueMutation.mutateAsync({
      id: issue.id,
      data: {
        title: values.title,
        description: values.description,
        priority: values.priority,
      },
    });
    navigate(ROUTES.ISSUE_DETAIL(issue.id));
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <PageHeader
        title={`Edit Issue #${issue.issueNumber}`}
        subtitle={`Update title, description, or priority for "${issue.title}"`}
        backTo={ROUTES.ISSUE_DETAIL(issue.id)}
      />

      <IssueForm
        initialValues={{
          title: issue.title,
          description: issue.description,
          priority: issue.priority,
          assigneeId: issue.assigneeId,
        }}
        onSubmit={handleSubmit}
        isLoading={updateIssueMutation.isPending}
        submitLabel="Update Issue"
        cancelTo={ROUTES.ISSUE_DETAIL(issue.id)}
      />
    </div>
  );
}

