import { useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/store';
import { sessionExpired, tokenRefreshed } from '@/store/auth-slice';
import { FullPageSplash } from '@/components/common/full-page-splash';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export function AuthBootstrap({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const status = useAppSelector((s) => s.auth.status);

  useEffect(() => {
    let mounted = true;
    axios
      .post(`${baseURL}/auth/refresh`, null, { withCredentials: true })
      .then((res) => {
        if (mounted && res.data?.data) {
          dispatch(tokenRefreshed(res.data.data));
        }
      })
      .catch(() => {
        if (mounted) {
          dispatch(sessionExpired());
        }
      });

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  if (status === 'unknown') {
    return <FullPageSplash />;
  }

  return <>{children}</>;
}

