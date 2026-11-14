import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { FullPageSplash } from '@/components/common/full-page-splash';
import { ROUTES } from '@/constants';

export function RequireAuth() {
  const status = useAppSelector((s) => s.auth.status);
  const location = useLocation();

  if (status === 'unknown') {
    return <FullPageSplash />;
  }

  if (status === 'guest') {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  return <Outlet />;
}

