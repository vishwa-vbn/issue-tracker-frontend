import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/controls/user-avatar';
import { useUserDetails } from '../hooks/use-user-details';
import { formatDate, formatDateTime } from '@/utils/format-date';
import { ROUTES } from '@/constants';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  XCircle,
  Shield,
  User,
  Calendar,
  Layers,
  FileCheck,
  Pencil,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import type { UserSummary } from '../types';

interface UserDetailsDialogProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditClick?: (user: UserSummary) => void;
}

export function UserDetailsDialog({
  userId,
  open,
  onOpenChange,
  onEditClick,
}: UserDetailsDialogProps) {
  const { data: user, isPending, isError } = useUserDetails(open ? userId : null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-foreground">User Details & Activity</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Account overview, role permissions, and issue engagement metrics
          </DialogDescription>
        </DialogHeader>

        {isPending ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <Loader2 className="size-6 animate-spin text-primary" />
            <span className="text-xs text-muted-foreground">Loading user details...</span>
          </div>
        ) : isError || !user ? (
          <div className="py-6 text-center text-xs text-destructive">
            Failed to load user details. Please try again.
          </div>
        ) : (
          <div className="space-y-5 py-1">
            {/* Profile Header */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-border bg-slate-50/70">
              <UserAvatar name={user.name} size="lg" />
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground truncate">{user.name}</h3>
                  {user.role === 'ADMIN' ? (
                    <Badge variant="default" className="text-[10px] px-1.5 py-0 font-semibold gap-1">
                      <Shield className="size-3" />
                      Admin
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-semibold gap-1">
                      <User className="size-3" />
                      User
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                <div className="mt-1 flex items-center gap-2">
                  {user.isActive ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                      <CheckCircle className="size-3" />
                      Active Account
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                      <XCircle className="size-3" />
                      Deactivated Account
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Issue Stats Row */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                to={`${ROUTES.ISSUES}?assigneeId=${user.id}`}
                onClick={() => onOpenChange(false)}
                className="group flex flex-col justify-between p-3.5 rounded-xl border border-border bg-white hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-semibold">Assigned Issues</span>
                  <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
                    <FileCheck className="size-3.5" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-bold tracking-tight text-foreground">
                    {user.stats?.assignedIssues ?? 0}
                  </span>
                  <span className="text-[11px] text-primary inline-flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    View <ExternalLink className="size-2.5" />
                  </span>
                </div>
              </Link>

              <Link
                to={`${ROUTES.ISSUES}?q=${encodeURIComponent(user.email)}`}
                onClick={() => onOpenChange(false)}
                className="group flex flex-col justify-between p-3.5 rounded-xl border border-border bg-white hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-semibold">Reported Issues</span>
                  <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <Layers className="size-3.5" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-bold tracking-tight text-foreground">
                    {user.stats?.reportedIssues ?? 0}
                  </span>
                  <span className="text-[11px] text-primary inline-flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    View <ExternalLink className="size-2.5" />
                  </span>
                </div>
              </Link>
            </div>

            {/* Account Metadata */}
            <div className="space-y-2 p-3 rounded-lg border border-border/70 bg-slate-50/50 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3" />
                  Account Created
                </span>
                <span className="font-medium text-foreground">{formatDateTime(user.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3" />
                  Last Updated
                </span>
                <span className="font-medium text-foreground">{formatDate(user.updatedAt)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              {onEditClick && (
                <Button
                  size="sm"
                  onClick={() => {
                    onOpenChange(false);
                    onEditClick(user);
                  }}
                  className="gap-1.5 text-xs font-semibold"
                >
                  <Pencil className="size-3.5" />
                  Edit User
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

