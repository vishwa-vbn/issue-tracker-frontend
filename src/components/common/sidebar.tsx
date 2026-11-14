import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  PlusCircle,
  Users,
  Code2,
  Bug,
} from 'lucide-react';
import { useAppSelector } from '@/store';
import { ROUTES } from '@/constants';
import { cn } from '@/utils/cn';

interface SidebarProps {
  onNavClick?: () => void;
  className?: string;
}

export function Sidebar({ onNavClick, className }: SidebarProps) {
  const user = useAppSelector((s) => s.auth.user);
  const isAdmin = user?.role === 'ADMIN';
  const showComponentViewer = import.meta.env.VITE_ENABLE_COMPONENT_VIEWER === 'true';

  const navItems = [
    { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { to: ROUTES.ISSUES, label: 'Issues', icon: CheckSquare },
    { to: ROUTES.ISSUE_NEW, label: 'New Issue', icon: PlusCircle },
  ];

  return (
    <div className={cn('flex flex-col h-full w-full bg-card border-r border-border overflow-hidden select-none', className)}>
      {/* Brand Header — Fixed height h-14 to match the Navbar exactly */}
      <div className="flex h-14 items-center gap-2.5 px-5 border-b border-border bg-white shrink-0">
        <div className="flex size-7.5 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-2xs shrink-0">
          <Bug className="size-4" />
        </div>
        <div className="flex flex-col leading-none min-w-0">
          <span className="font-bold text-sm tracking-tight text-foreground truncate">
            Issue Tracker
          </span>
          <span className="text-[10px] text-muted-foreground font-medium mt-0.5 truncate">
            Task & Bug Management
          </span>
        </div>
      </div>

      {/* Navigation Links — Scrollable independently if needed */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        <div>
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-2">
            Main Menu
          </p>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onNavClick}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-primary/10 text-primary font-semibold border border-primary/20 shadow-none'
                        : 'text-muted-foreground hover:bg-slate-100 hover:text-foreground',
                    )
                  }
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {isAdmin && (
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-2">
              Administration
            </p>
            <nav className="space-y-0.5">
              <NavLink
                to={ROUTES.ADMIN_USERS}
                onClick={onNavClick}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold border border-primary/20'
                      : 'text-muted-foreground hover:bg-slate-100 hover:text-foreground',
                  )
                }
              >
                <Users className="size-4 shrink-0" />
                <span>Manage Users</span>
              </NavLink>
            </nav>
          </div>
        )}

        {showComponentViewer && (
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-2">
              Development
            </p>
            <nav className="space-y-0.5">
              <NavLink
                to={ROUTES.COMPONENT_VIEWER}
                onClick={onNavClick}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold border border-primary/20'
                      : 'text-muted-foreground hover:bg-slate-100 hover:text-foreground',
                  )
                }
              >
                <Code2 className="size-4 shrink-0" />
                <span>Component Viewer</span>
              </NavLink>
            </nav>
          </div>
        )}
      </div>

      {/* Footer — Fixed at the bottom */}
      <div className="p-3 border-t border-border shrink-0 bg-white">
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-slate-50 border border-border">
          <div className="flex size-6.5 items-center justify-center rounded-md bg-primary/10 shrink-0">
            <Bug className="size-3 text-primary" />
          </div>
          <div className="flex flex-col leading-none min-w-0">
            <span className="text-xs font-semibold text-foreground truncate">Issue Tracker v1.0</span>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Role: <span className="font-semibold text-foreground">{user?.role || 'Guest'}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
