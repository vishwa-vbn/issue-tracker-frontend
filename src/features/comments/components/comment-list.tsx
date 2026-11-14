import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { CommentItem } from './comment-item';
import { CommentForm } from './comment-form';
import { Pagination } from '@/components/common/pagination';
import { ErrorState } from '@/components/common/error-state';
import { useComments } from '../hooks/use-comments';

interface CommentListProps {
  issueId: string;
}

export function CommentList({ issueId }: CommentListProps) {
  const [page, setPage] = useState(1);
  const { data, isPending, isError, error, refetch } = useComments(issueId, page);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <MessageSquare className="size-5 text-muted-foreground" />
        <h3 className="text-base font-semibold text-foreground">
          Discussion ({data?.meta.total ?? 0})
        </h3>
      </div>

      {/* Add New Comment */}
      <CommentForm issueId={issueId} />

      {/* List Comments */}
      {isPending ? (
        <div className="space-y-4 pt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 p-3.5 border rounded-xl">
              <Skeleton className="size-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : data.data.length === 0 ? (
        <div className="py-6 text-center text-sm text-muted-foreground border border-dashed rounded-xl p-6">
          No comments yet. Start the conversation!
        </div>
      ) : (
        <div className="space-y-3.5 pt-2">
          {data.data.map((comment) => (
            <CommentItem key={comment.id} comment={comment} issueId={issueId} />
          ))}

          {data.meta.totalPages > 1 && (
            <div className="pt-2">
              <Pagination
                page={data.meta.page}
                totalPages={data.meta.totalPages}
                totalItems={data.meta.total}
                limit={data.meta.limit}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

