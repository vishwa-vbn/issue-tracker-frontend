import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { addComment } from '../api';
import { issueKeys } from '@/features/issues/keys';
import { messageForError } from '@/helpers/error-messages';

interface AddCommentParams {
  issueId: string;
  body: string;
}

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ issueId, body }: AddCommentParams) => addComment(issueId, body),
    onSuccess: (_, vars) => {
      toast.success('Comment posted.');
      queryClient.invalidateQueries({ queryKey: ['comments', vars.issueId] });
      queryClient.invalidateQueries({ queryKey: issueKeys.detail(vars.issueId) });
      queryClient.invalidateQueries({ queryKey: issueKeys.activity(vars.issueId) });
    },
    onError: (err) => {
      toast.error(messageForError(err));
    },
  });
}

