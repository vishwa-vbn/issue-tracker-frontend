import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store';
import { signedIn } from '@/store/auth-slice';
import { loginApi } from '../api';
import type { LoginValues } from '../schemas';
import type { AuthResponseData } from '../types';

export function useLogin() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation<AuthResponseData, unknown, LoginValues>({
    mutationFn: loginApi,
    onSuccess: (data) => {
      queryClient.clear();
      dispatch(signedIn(data));
      toast.success(`Welcome back, ${data.user.name}!`);
    },
  });
}

