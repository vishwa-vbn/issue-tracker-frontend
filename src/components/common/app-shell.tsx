import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';
import { ServerWakingBanner } from './server-waking-banner';
import { FullPageSplash } from './full-page-splash';
import { useAppDispatch, useAppSelector } from '@/store';
import { setSidebarOpen } from '@/store/ui-slice';
import { useLogout } from '@/features/auth/hooks/use-logout';

export function AppShell() {
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);
  const logoutMutation = useLogout();

  return (
    <div className="flex h-screen w-full flex-col bg-background overflow-hidden">
      <ServerWakingBanner />

      <div className="flex flex-1 w-full h-full overflow-hidden">
        {/* Fixed Desktop Sidebar */}
        <aside className="hidden md:flex w-64 shrink-0 flex-col h-full">
          <Sidebar />
        </aside>

        {/* Mobile Navigation Sheet */}
        <Sheet open={sidebarOpen} onOpenChange={(open) => dispatch(setSidebarOpen(open))}>
          <SheetContent side="left" className="p-0 w-72">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <Sidebar onNavClick={() => dispatch(setSidebarOpen(false))} />
          </SheetContent>
        </Sheet>

        {/* Main Content Column with Fixed Header and Scrollable Body */}
        <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
          {/* Fixed Header (Level with Sidebar Brand Header) */}
          <Navbar
            onLogout={() => logoutMutation.mutate()}
            isLoggingOut={logoutMutation.isPending}
          />

          {/* Scrollable Content Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl w-full mx-auto">
              <Suspense fallback={<FullPageSplash />}>
                <Outlet />
              </Suspense>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
