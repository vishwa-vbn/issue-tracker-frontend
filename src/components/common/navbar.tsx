import { Menu, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/controls/user-avatar';
import { useAppDispatch, useAppSelector } from '@/store';
import { setSidebarOpen } from '@/store/ui-slice';

interface NavbarProps {
  onLogout: () => void;
  isLoggingOut?: boolean;
}

export function Navbar({ onLogout, isLoggingOut }: NavbarProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border bg-white px-4 sm:px-6 shadow-2xs shrink-0 select-none">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden size-8 p-0 rounded-md hover:bg-slate-100"
          onClick={() => dispatch(setSidebarOpen(true))}
          aria-label="Open sidebar"
        >
          <Menu className="size-4 text-slate-600" />
        </Button>
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span>Issue Tracking System</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 py-1 pl-1 pr-2 rounded-full hover:bg-slate-100/80 border border-slate-200/80 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              aria-label="User profile menu"
            >
              <UserAvatar name={user?.name} size="xs" />
              <span className="hidden sm:inline-block text-xs font-medium text-slate-700 max-w-[120px] truncate">
                {user?.name}
              </span>
              <ChevronDown className="size-3 text-slate-400 shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52" align="end" sideOffset={6}>
            <DropdownMenuLabel className="p-2 pb-1.5 font-normal">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-900 truncate">
                    {user?.name}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[9px] uppercase font-bold px-1.5 py-0 rounded border-slate-200 text-slate-600 bg-slate-50 shrink-0"
                  >
                    {user?.role}
                  </Badge>
                </div>
                <span className="text-[11px] text-muted-foreground truncate">
                  {user?.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              disabled={isLoggingOut}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer text-xs font-medium py-1.5 px-2"
            >
              <LogOut className="size-3.5 text-destructive" />
              <span>{isLoggingOut ? 'Logging out…' : 'Sign out'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
