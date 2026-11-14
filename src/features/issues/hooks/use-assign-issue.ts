import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { assignIssue } from '../api';
import { issueKeys } from '../keys';
import { messageForError } from '@/helpers/error-messages';
import type { Issue } from '../types';

interface AssignIssueParams {
  id: string;
  assigneeId: string | null;
}

export function useAssignIssue() {
  const queryClient = useQueryClient();

  return useMutation<Issue, unknown, AssignIssueParams>({
    mutationFn: ({ id, assigneeId }) => assignIssue(id, assigneeId),
    onSuccess: (issue) => {
      toast.success(
        issue.assignee
          ? `Assigned to ${issue.assignee.name}.`
          : 'Issue unassigned.',
      );
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

