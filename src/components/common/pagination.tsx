import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems?: number;
  limit?: number;
  onPageChange: (newPage: number) => void;
  className?: string;
  isFetching?: boolean;
}

export function Pagination({
  page,
  totalPages,
  totalItems,
  limit,
  onPageChange,
  className,
  isFetching = false,
}: PaginationProps) {
  if (totalPages <= 1 && !totalItems) return null;

  const startItem = limit ? (page - 1) * limit + 1 : undefined;
  const endItem = limit && totalItems ? Math.min(page * limit, totalItems) : undefined;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (page < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-1 text-sm ${className ?? ''}`}
    >
      <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
        {totalItems !== undefined && startItem !== undefined && endItem !== undefined ? (
          <span>
            Showing <span className="font-semibold text-foreground">{startItem}</span> to{' '}
            <span className="font-semibold text-foreground">{endItem}</span> of{' '}
            <span className="font-semibold text-foreground">{totalItems}</span> results
          </span>
        ) : (
          <span>
            Page <span className="font-semibold text-foreground">{page}</span> of{' '}
            <span className="font-semibold text-foreground">{totalPages || 1}</span>
          </span>
        )}
        {isFetching && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary ml-1">
            <Loader2 className="size-3 animate-spin" />
            <span>Loading...</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || isFetching}
          aria-label="Previous page"
          className="size-8 p-0"
        >
          <ChevronLeft className="size-4" />
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) =>
            typeof p === 'number' ? (
              <Button
                key={idx}
                variant={p === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(p)}
                disabled={isFetching && p === page}
                className="size-8 p-0 text-xs font-medium"
              >
                {p}
              </Button>
            ) : (
              <span key={idx} className="px-1 text-xs text-muted-foreground">
                {p}
              </span>
            ),
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || isFetching}
          aria-label="Next page"
          className="size-8 p-0"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
