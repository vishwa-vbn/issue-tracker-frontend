import { Badge } from '@/components/ui/badge';
import { ISSUE_STATUS, STATUS_LABELS, type IssueStatus } from '@/constants';
import { cn } from '@/utils/cn';

interface StatusBadgeProps {
  status: IssueStatus | string;
  className?: string;
}

const STATUS_CONFIG: Record<IssueStatus, { dot: string; pill: string }> = {
  OPEN: {
    dot: 'bg-blue-500',
    pill: 'border-blue-200 bg-blue-50 text-blue-700',
  },
  IN_PROGRESS: {
    dot: 'bg-amber-500',
    pill: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  CLOSED: {
    dot: 'bg-emerald-500',
    pill: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = (status.toUpperCase() in ISSUE_STATUS
    ? status.toUpperCase()
    : 'OPEN') as IssueStatus;
  const label = STATUS_LABELS[normalized] ?? status;
  const config = STATUS_CONFIG[normalized];

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded-full border',
        config.pill,
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full shrink-0', config.dot)} />
      {label}
    </Badge>
  );
}
