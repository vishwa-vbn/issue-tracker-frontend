import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store';
import { signedIn } from '@/store/auth-slice';
import { registerApi } from '../api';
import type { RegisterValues } from '../schemas';
import type { AuthResponseData } from '../types';

export function useRegister() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation<AuthResponseData, unknown, RegisterValues>({
    mutationFn: registerApi,
    onSuccess: (data) => {
      queryClient.clear();
      dispatch(signedIn(data));
      toast.success(`Account created! Welcome, ${data.user.name}.`);
    },
  });
}

