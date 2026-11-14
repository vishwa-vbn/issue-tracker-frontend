import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createIssue } from '../api';
import { issueKeys } from '../keys';
import { messageForError } from '@/helpers/error-messages';
import type { IssueFormValues } from '../schemas';
import type { Issue } from '../types';

export function useCreateIssue() {
  const queryClient = useQueryClient();

  return useMutation<Issue, unknown, IssueFormValues>({
    mutationFn: createIssue,
    onSuccess: (issue) => {
      toast.success(`Issue #${issue.issueNumber} created successfully.`);
      queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (err) => {
      toast.error(messageForError(err));
    },
  });
}

