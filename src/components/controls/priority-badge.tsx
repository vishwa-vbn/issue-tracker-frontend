import { Badge } from '@/components/ui/badge';
import { ISSUE_PRIORITY, PRIORITY_LABELS, type IssuePriority } from '@/constants';
import { cn } from '@/utils/cn';
import { AlertCircle, ArrowDown, ArrowUp, AlertTriangle } from 'lucide-react';

interface PriorityBadgeProps {
  priority: IssuePriority | string;
  className?: string;
  showIcon?: boolean;
}

const PRIORITY_CONFIG: Record<
  IssuePriority,
  { pill: string; iconClass: string; Icon: typeof ArrowDown }
> = {
  LOW: {
    pill: 'border-slate-200 bg-slate-50 text-slate-600',
    iconClass: 'text-slate-400',
    Icon: ArrowDown,
  },
  MEDIUM: {
    pill: 'border-blue-200 bg-blue-50 text-blue-700',
    iconClass: 'text-blue-500',
    Icon: ArrowUp,
  },
  HIGH: {
    pill: 'border-orange-200 bg-orange-50 text-orange-700',
    iconClass: 'text-orange-500',
    Icon: AlertTriangle,
  },
  CRITICAL: {
    pill: 'border-red-200 bg-red-50 text-red-700',
    iconClass: 'text-red-500',
    Icon: AlertCircle,
  },
};

export function PriorityBadge({ priority, className, showIcon = true }: PriorityBadgeProps) {
  const normalized = (priority.toUpperCase() in ISSUE_PRIORITY
    ? priority.toUpperCase()
    : 'MEDIUM') as IssuePriority;
  const label = PRIORITY_LABELS[normalized] ?? priority;
  const { pill, iconClass, Icon } = PRIORITY_CONFIG[normalized];

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-md border',
        pill,
        className,
      )}
    >
      {showIcon && <Icon className={cn('size-3 shrink-0', iconClass)} />}
      {label}
    </Badge>
  );
}
