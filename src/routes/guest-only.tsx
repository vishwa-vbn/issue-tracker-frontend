import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { FullPageSplash } from '@/components/common/full-page-splash';
import { ROUTES } from '@/constants';

interface LocationState {
  from?: {
    pathname: string;
    search?: string;
  };
}

export function GuestOnly() {
  const status = useAppSelector((s) => s.auth.status);
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  if (status === 'unknown') {
    return <FullPageSplash />;
  }

  if (status === 'authed') {
    const target = state?.from ? `${state.from.pathname}${state.from.search || ''}` : ROUTES.DASHBOARD;
    return <Navigate to={target} replace />;
  }

  return <Outlet />;
}

