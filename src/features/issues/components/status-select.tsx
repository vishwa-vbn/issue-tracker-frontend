import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { ISSUE_STATUS, type IssueStatus } from '@/constants';
import { StatusBadge } from '@/components/controls/status-badge';
import { useChangeStatus } from '../hooks/use-change-status';

interface StatusSelectProps {
  issueId: string;
  status: IssueStatus;
  disabled?: boolean;
}

export function StatusSelect({ issueId, status, disabled }: StatusSelectProps) {
  const changeStatusMutation = useChangeStatus();

  const handleChange = (newStatus: string) => {
    if (newStatus !== status) {
      changeStatusMutation.mutate({
        id: issueId,
        status: newStatus as IssueStatus,
      });
    }
  };

  return (
    <div className="w-full">
      <Select
        value={status}
        onValueChange={handleChange}
        disabled={disabled || changeStatusMutation.isPending}
      >
        <SelectTrigger size="sm" className="w-full h-8.5 px-2 bg-white border-slate-200 hover:border-slate-300">
          <div className="flex items-center">
            <StatusBadge status={status} />
          </div>
        </SelectTrigger>
        <SelectContent align="start" className="min-w-[140px]">
          <SelectItem value={ISSUE_STATUS.OPEN} className="py-1">
            <StatusBadge status={ISSUE_STATUS.OPEN} />
          </SelectItem>
          <SelectItem value={ISSUE_STATUS.IN_PROGRESS} className="py-1">
            <StatusBadge status={ISSUE_STATUS.IN_PROGRESS} />
          </SelectItem>
          <SelectItem value={ISSUE_STATUS.CLOSED} className="py-1">
            <StatusBadge status={ISSUE_STATUS.CLOSED} />
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
