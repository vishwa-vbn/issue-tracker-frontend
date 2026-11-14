import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { editComment } from '../api';
import { issueKeys } from '@/features/issues/keys';
import { messageForError } from '@/helpers/error-messages';

interface EditCommentParams {
  issueId: string;
  commentId: string;
  body: string;
}

export function useEditComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, body }: EditCommentParams) => editComment(commentId, body),
    onSuccess: (_, vars) => {
      toast.success('Comment updated.');
      queryClient.invalidateQueries({ queryKey: ['comments', vars.issueId] });
      queryClient.invalidateQueries({ queryKey: issueKeys.activity(vars.issueId) });
    },
    onError: (err) => {
      toast.error(messageForError(err));
    },
  });
}

