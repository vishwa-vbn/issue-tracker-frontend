import { Clock, History } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useIssueActivity } from '../hooks/use-issue-activity';
import { formatRelativeTime } from '@/utils/format-date';
import type { IssueActivity } from '../types';

interface ActivityTimelineProps {
  issueId: string;
}

export function ActivityTimeline({ issueId }: ActivityTimelineProps) {
  const { data: activities, isPending, isError } = useIssueActivity(issueId);

  if (isPending) {
    return (
      <div className="space-y-4 py-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3 items-center">
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
    );
  }

  if (isError || !activities || activities.length === 0) {
    return (
      <div className="py-4 text-center text-xs text-muted-foreground">
        No recorded activity events yet.
      </div>
    );
  }

  const formatActivityText = (item: IssueActivity) => {
    const rawItem = item as unknown as Record<string, unknown>;
    const rawType = rawItem.type || rawItem.action || rawItem.eventType || '';
    const typeStr = typeof rawType === 'string' ? rawType.toUpperCase() : '';

    const toVal =
      typeof rawItem.toValue === 'string'
        ? rawItem.toValue
        : typeof (rawItem.details as Record<string, unknown> | undefined)?.newStatus === 'string'
        ? ((rawItem.details as Record<string, unknown>).newStatus as string)
        : typeof (rawItem.details as Record<string, unknown> | undefined)?.status === 'string'
        ? ((rawItem.details as Record<string, unknown>).status as string)
        : typeof (rawItem.details as Record<string, unknown> | undefined)?.newAssigneeName === 'string'
        ? ((rawItem.details as Record<string, unknown>).newAssigneeName as string)
        : '';

    switch (typeStr) {
      case 'CREATED':
      case 'ISSUE_CREATED':
        return 'created this issue';
      case 'STATUS_CHANGED':
        return (
          <span>
            changed status to <strong className="text-foreground">{toVal || 'updated'}</strong>
          </span>
        );
      case 'ASSIGNED':
      case 'ASSIGNEE_CHANGED':
        return (
          <span>
            assigned this issue to <strong className="text-foreground">{toVal || 'team member'}</strong>
          </span>
        );
      case 'UNASSIGNED':
        return 'unassigned this issue';
      case 'COMMENTED':
      case 'COMMENT_ADDED':
        return 'commented on this issue';
      case 'UPDATED':
      case 'DETAILS_UPDATED':
        return 'updated issue details';
      default:
        return typeStr ? typeStr.toLowerCase().replace(/_/g, ' ') : 'updated this issue';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <History className="size-4 text-muted-foreground" />
        <h4 className="text-sm font-semibold text-foreground">Activity Timeline</h4>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-border">
        {activities.map((item) => {
          const rawItem = item as unknown as Record<string, unknown>;
          const actorName =
            (rawItem.actor as { name?: string } | undefined)?.name ||
            (rawItem.user as { name?: string } | undefined)?.name ||
            'Someone';

          return (
            <div key={item.id} className="relative flex items-start gap-2.5 text-xs">
              <div className="absolute -left-6 top-0.5 flex size-5 items-center justify-center rounded-full bg-background border border-border shadow-xs">
                <Clock className="size-2.5 text-muted-foreground" />
              </div>

              <div className="flex-1 space-y-0.5">
                <div className="text-muted-foreground leading-normal">
                  <span className="font-semibold text-foreground mr-1">{actorName}</span>
                  {formatActivityText(item)}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {formatRelativeTime(item.createdAt)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
