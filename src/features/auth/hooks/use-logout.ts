import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store';
import { signedOut } from '@/store/auth-slice';
import { logoutApi } from '../api';
import { ROUTES } from '@/constants';

export function useLogout() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutApi,
    onSettled: () => {
      queryClient.clear();
      dispatch(signedOut());
      toast.info('You have been logged out.');
      navigate(ROUTES.LOGIN, { replace: true });
    },
  });
}

