import { Outlet } from 'react-router-dom';
import { useAppSelector } from '@/store';
import ForbiddenPage from '@/pages/system/forbidden-page';

export function RequireAdmin() {
  const role = useAppSelector((s) => s.auth.user?.role);

  return role === 'ADMIN' ? <Outlet /> : <ForbiddenPage />;
}

