import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export function TableSkeleton({
  rows = 8,
  title = 'Loading data...',
}: {
  rows?: number;
  cols?: number;
  title?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200/70 bg-white shadow-2xs overflow-hidden select-none">
      {/* Top indeterminate line */}
      <div className="h-1 w-full bg-primary/10 overflow-hidden">
        <div className="h-full bg-primary animate-indeterminate w-1/3" />
      </div>

      {/* Header bar with status indicator */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200/60 bg-slate-50/70">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <Loader2 className="size-3.5 animate-spin text-primary" />
          <span>{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      {/* Table columns */}
      <div className="p-4 space-y-3.5">
        <div className="flex items-center gap-4 pb-2 border-b border-slate-100">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-52" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28 hidden sm:block" />
          <Skeleton className="h-4 w-20 ml-auto hidden md:block" />
        </div>

        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-100/70 last:border-0">
            <Skeleton className="h-4 w-8 rounded" />
            <div className="space-y-1.5 flex-1 max-w-xs">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-18 rounded-md" />
            <div className="hidden sm:flex items-center gap-2 w-28">
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="h-3.5 w-16" />
            </div>
            <Skeleton className="h-3.5 w-16 ml-auto hidden md:block" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton({
  count = 4,
  className,
}: {
  count?: number;
  className?: string;
}) {
  const gridColsClass =
    count === 1
      ? 'grid-cols-1'
      : count === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : count === 3
      ? 'grid-cols-1 sm:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div className={cn('grid gap-4', gridColsClass, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 border border-slate-200/70 rounded-xl bg-white space-y-3.5 shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="size-7 rounded-lg" />
          </div>
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-3 w-36" />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* 4 Stat Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-5 border border-slate-200/70 rounded-xl bg-white space-y-3 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="size-8 rounded-lg" />
            </div>
            <Skeleton className="h-7 w-14" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Middle Row: My Work (2 cols) & Priority Distribution (1 col) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* My Work Card Skeleton */}
        <div className="lg:col-span-2 border border-slate-200/70 rounded-xl bg-white p-5 shadow-2xs space-y-4">
          <div className="space-y-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="p-3.5 border border-slate-200/60 rounded-xl space-y-3 bg-slate-50/40"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="size-7 rounded-md" />
                </div>
                <Skeleton className="h-6 w-10" />
                <Skeleton className="h-2.5 w-24" />
              </div>
            ))}
          </div>
        </div>

        {/* Priority Breakdown Skeleton */}
        <div className="border border-slate-200/70 rounded-xl bg-white p-5 shadow-2xs space-y-4">
          <div className="space-y-1">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-44" />
          </div>
          <div className="space-y-3.5 pt-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Issues Table Skeleton */}
      <TableSkeleton rows={5} title="Loading recent issues..." />
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-3/4 max-w-lg" />
        <Skeleton className="h-3.5 w-1/3 max-w-xs" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-48 w-full rounded-xl border border-slate-200/60" />
          <Skeleton className="h-32 w-full rounded-xl border border-slate-200/60" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-xl border border-slate-200/60" />
          <Skeleton className="h-40 w-full rounded-xl border border-slate-200/60" />
        </div>
      </div>
    </div>
  );
}

export function FullPageSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-3.5 w-64" />
      </div>
      <CardSkeleton count={4} />
      <TableSkeleton rows={6} cols={5} />
    </div>
  );
}
