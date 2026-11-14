import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createUser } from '../api';
import { messageForError } from '@/helpers/error-messages';
import type { CreateUserInput } from '../types';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserInput) => createUser(payload),
    onSuccess: (newUser) => {
      toast.success(`User "${newUser.name}" created successfully.`);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'assignable'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (err) => {
      toast.error(messageForError(err));
    },
  });
}

