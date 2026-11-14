import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateIssue } from '../api';
import { issueKeys } from '../keys';
import { messageForError } from '@/helpers/error-messages';
import type { IssueFormValues } from '../schemas';
import type { Issue } from '../types';

interface UpdateIssueParams {
  id: string;
  data: Partial<IssueFormValues>;
}

export function useUpdateIssue() {
  const queryClient = useQueryClient();

  return useMutation<Issue, unknown, UpdateIssueParams>({
    mutationFn: ({ id, data }) => updateIssue(id, data),
    onSuccess: (issue) => {
      toast.success(`Issue #${issue.issueNumber} updated.`);
      queryClient.invalidateQueries({ queryKey: issueKeys.detail(issue.id) });
      queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (err) => {
      toast.error(messageForError(err));
    },
  });
}

