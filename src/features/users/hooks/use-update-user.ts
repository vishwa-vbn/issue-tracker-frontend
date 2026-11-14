import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateUser } from '../api';
import { messageForError } from '@/helpers/error-messages';
import type { UpdateUserInput } from '../types';

interface UpdateUserParams {
  userId: string;
  payload: UpdateUserInput;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: UpdateUserParams) =>
      updateUser(userId, payload),
    onSuccess: (updatedUser) => {
      toast.success(`User ${updatedUser.name} updated successfully.`);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', updatedUser.id] });
      queryClient.invalidateQueries({ queryKey: ['users', 'assignable'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (err) => {
      toast.error(messageForError(err));
    },
  });
}
