import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/page-header';
import { IssueFiltersBar } from '@/features/issues/components/issue-filters';
import { IssueTable } from '@/features/issues/components/issue-table';
import { Pagination } from '@/components/common/pagination';
import { TableSkeleton } from '@/components/common/skeleton-loader';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { useIssues } from '@/features/issues/hooks/use-issues';
import { ROUTES } from '@/constants';
import type { IssueFilters } from '@/features/issues/types';

export default function IssueListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: IssueFilters = useMemo(() => {
    return {
      page: Number(searchParams.get('page')) || 1,
      limit: 10,
      q: searchParams.get('q') || undefined,
      status: searchParams.get('status') || undefined,
      priority: searchParams.get('priority') || undefined,
      assigneeId: searchParams.get('assigneeId') || undefined,
      unassigned: searchParams.get('unassigned') === 'true' || undefined,
      sort: searchParams.get('sort') || 'createdAt',
      order: (searchParams.get('order') as 'asc' | 'desc') || 'desc',
    };
  }, [searchParams]);

  const { data, isPending, isFetching, isError, error, refetch } = useIssues(filters);

  const handleFilterChange = (updated: Partial<IssueFilters>) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(updated).forEach(([k, v]) => {
          if (v === undefined || v === null || v === '') {
            next.delete(k);
          } else {
            next.set(k, String(v));
          }
        });
        return next;
      },
      { replace: true },
    );
  };

  const handleResetFilters = () => {
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <PageHeader
        title="Issues"
        subtitle="Browse, filter, and prioritize tasks and bug reports across the project"
        actions={
          <Button asChild className="gap-2 shadow-sm font-semibold">
            <Link to={ROUTES.ISSUE_NEW}>
              <Plus className="size-4" />
              New Issue
            </Link>
          </Button>
        }
      />

      {/* Filter Toolbar */}
      <IssueFiltersBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Issue Table & Pagination */}
      {isPending ? (
        <TableSkeleton rows={8} cols={6} title="Loading issues..." />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : data.data.length === 0 ? (
        <EmptyState
          title="No issues found"
          description={
            searchParams.toString()
              ? 'No issues match your selected filter criteria. Try adjusting or resetting filters.'
              : 'There are no issues in the repository yet. Create the first issue to get started!'
          }
          action={
            searchParams.toString() ? (
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Reset all filters
              </Button>
            ) : (
              <Button asChild size="sm">
                <Link to={ROUTES.ISSUE_NEW}>
                  <Plus className="mr-2 size-4" />
                  Create First Issue
                </Link>
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-4">
          <IssueTable issues={data.data} isFetching={isFetching} />

          <Pagination
            page={data.meta.page}
            totalPages={data.meta.totalPages}
            totalItems={data.meta.total}
            limit={data.meta.limit}
            isFetching={isFetching}
            onPageChange={(p) => handleFilterChange({ page: p })}
          />
        </div>
      )}
    </div>
  );
}

