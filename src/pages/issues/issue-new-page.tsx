import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/page-header';
import { IssueForm } from '@/features/issues/components/issue-form';
import { useCreateIssue } from '@/features/issues/hooks/use-create-issue';
import { ROUTES } from '@/constants';
import type { IssueFormValues } from '@/features/issues/schemas';

export default function IssueNewPage() {
  const navigate = useNavigate();
  const createIssueMutation = useCreateIssue();

  const handleSubmit = async (values: IssueFormValues) => {
    const created = await createIssueMutation.mutateAsync(values);
    navigate(ROUTES.ISSUE_DETAIL(created.id));
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <PageHeader
        title="Create New Issue"
        subtitle="File a bug report, improvement request, or task description"
        backTo={ROUTES.ISSUES}
      />

      <IssueForm
        onSubmit={handleSubmit}
        isLoading={createIssueMutation.isPending}
        submitLabel="Create Issue"
        cancelTo={ROUTES.ISSUES}
      />
    </div>
  );
}

