import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { changeIssueStatus } from '../api';
import { issueKeys } from '../keys';
import { messageForError } from '@/helpers/error-messages';
import { STATUS_LABELS, type IssueStatus } from '@/constants';
import type { Issue } from '../types';

interface ChangeStatusParams {
  id: string;
  status: IssueStatus;
}

export function useChangeStatus() {
  const queryClient = useQueryClient();

  return useMutation<Issue, unknown, ChangeStatusParams>({
    mutationFn: ({ id, status }) => changeIssueStatus(id, status),
    onSuccess: (issue, vars) => {
      toast.success(`Status changed to "${STATUS_LABELS[vars.status]}".`);
      queryClient.invalidateQueries({ queryKey: issueKeys.detail(issue.id) });
      queryClient.invalidateQueries({ queryKey: issueKeys.activity(issue.id) });
      queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (err) => {
      toast.error(messageForError(err));
    },
  });
}

