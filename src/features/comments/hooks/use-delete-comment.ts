import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteComment } from '../api';
import { issueKeys } from '@/features/issues/keys';
import { messageForError } from '@/helpers/error-messages';

interface DeleteCommentParams {
  issueId: string;
  commentId: string;
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId }: DeleteCommentParams) => deleteComment(commentId),
    onSuccess: (_, vars) => {
      toast.success('Comment deleted.');
      queryClient.invalidateQueries({ queryKey: ['comments', vars.issueId] });
      queryClient.invalidateQueries({ queryKey: issueKeys.detail(vars.issueId) });
      queryClient.invalidateQueries({ queryKey: issueKeys.activity(vars.issueId) });
    },
    onError: (err) => {
      toast.error(messageForError(err));
    },
  });
}

