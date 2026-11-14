import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { deleteIssue } from '../api';
import { issueKeys } from '../keys';
import { messageForError } from '@/helpers/error-messages';
import { ROUTES } from '@/constants';

export function useDeleteIssue() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<void, unknown, string>({
    mutationFn: deleteIssue,
    onSuccess: () => {
      toast.success('Issue deleted successfully.');
      queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      navigate(ROUTES.ISSUES);
    },
    onError: (err) => {
      toast.error(messageForError(err));
    },
  });
}

