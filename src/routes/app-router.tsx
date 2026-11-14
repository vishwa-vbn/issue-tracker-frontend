import { lazy } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { GuestOnly } from './guest-only';
import { RequireAuth } from './require-auth';
import { RequireAdmin } from './require-admin';
import { AppShell } from '@/components/common/app-shell';
import { RouteErrorBoundary } from '@/components/common/route-error-boundary';
import NotFoundPage from '@/pages/system/not-found-page';

const LoginPage = lazy(() => import('@/pages/auth/login-page'));
const RegisterPage = lazy(() => import('@/pages/auth/register-page'));
const AdminLoginPage = lazy(() => import('@/pages/auth/admin-login-page'));
const DashboardPage = lazy(() => import('@/pages/dashboard/dashboard-page'));
const IssueListPage = lazy(() => import('@/pages/issues/issue-list-page'));
const IssueNewPage = lazy(() => import('@/pages/issues/issue-new-page'));
const IssueDetailPage = lazy(() => import('@/pages/issues/issue-detail-page'));
const IssueEditPage = lazy(() => import('@/pages/issues/issue-edit-page'));
const AdminUsersPage = lazy(() => import('@/pages/admin/admin-users-page'));
const ComponentViewerPage = lazy(() => import('@/pages/system/component-viewer-page'));

const router = createBrowserRouter([
  // Guest Routes (redirect if already logged in)
  {
    element: <GuestOnly />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/admin/login', element: <AdminLoginPage /> },
    ],
  },

  // Authenticated Application Routes
  {
    element: <RequireAuth />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <AppShell />,
        errorElement: <RouteErrorBoundary />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/issues', element: <IssueListPage /> },
          { path: '/issues/new', element: <IssueNewPage /> },
          { path: '/issues/:issueId', element: <IssueDetailPage /> },
          { path: '/issues/:issueId/edit', element: <IssueEditPage /> },

          // Admin Protected Routes
          {
            element: <RequireAdmin />,
            children: [{ path: '/admin/users', element: <AdminUsersPage /> }],
          },

          // Dev Component Viewer
          { path: '/component-viewer', element: <ComponentViewerPage /> },
        ],
      },
    ],
  },

  // 404 Catch All
  { path: '*', element: <NotFoundPage /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

