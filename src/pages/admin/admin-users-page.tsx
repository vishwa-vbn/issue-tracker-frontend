import { useState } from 'react';
import {
  Search,
  CheckCircle,
  XCircle,
  Shield,
  UserPlus,
  Eye,
  Pencil,
  UserCheck,
  UserX,
  Loader2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/common/page-header';
import { UserAvatar } from '@/components/controls/user-avatar';
import { Pagination } from '@/components/common/pagination';
import { TableSkeleton } from '@/components/common/skeleton-loader';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { CreateUserDialog } from '@/features/users/components/create-user-dialog';
import { EditUserDialog } from '@/features/users/components/edit-user-dialog';
import { UserDetailsDialog } from '@/features/users/components/user-details-dialog';
import { useUsers } from '@/features/users/hooks/use-users';
import { useUpdateUser } from '@/features/users/hooks/use-update-user';
import { useDeleteUser } from '@/features/users/hooks/use-delete-user';
import { formatDate } from '@/utils/format-date';
import type { UserSummary } from '@/features/users/types';
import type { UserRole } from '@/constants';
import { useAppSelector } from '@/store';

export default function AdminUsersPage() {
  const currentUserId = useAppSelector((s) => s.auth.user?.id);
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  // Dialog States
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<UserSummary | null>(null);
  const [detailsTargetId, setDetailsTargetId] = useState<string | null>(null);

  const filters = {
    page,
    limit: 10,
    role: roleFilter !== 'ALL' ? roleFilter : undefined,
    isActive: statusFilter === 'ACTIVE' ? true : statusFilter === 'INACTIVE' ? false : undefined,
    q: search.trim() || undefined,
  };

  const { data, isPending, isFetching, isError, error, refetch } = useUsers(filters);
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const [confirmTarget, setConfirmTarget] = useState<{
    user: UserSummary;
    action: 'deactivate' | 'activate' | 'role';
    newRole?: UserRole;
  } | null>(null);

  const handleToggleStatus = (targetUser: UserSummary) => {
    if (targetUser.id === currentUserId) return;
    setConfirmTarget({
      user: targetUser,
      action: targetUser.isActive ? 'deactivate' : 'activate',
    });
  };

  const handleRoleChange = (targetUser: UserSummary, newRole: UserRole) => {
    if (targetUser.id === currentUserId) return;
    setConfirmTarget({
      user: targetUser,
      action: 'role',
      newRole,
    });
  };

  const handleConfirmAction = () => {
    if (!confirmTarget) return;

    if (confirmTarget.action === 'deactivate') {
      // Calls DELETE /api/v1/users/:id to safely deactivate and revoke all sessions
      deleteUserMutation.mutate(confirmTarget.user.id, {
        onSettled: () => setConfirmTarget(null),
      });
    } else if (confirmTarget.action === 'activate') {
      // Calls PATCH /api/v1/users/:id with isActive: true
      updateUserMutation.mutate(
        { userId: confirmTarget.user.id, payload: { isActive: true } },
        { onSettled: () => setConfirmTarget(null) },
      );
    } else if (confirmTarget.action === 'role' && confirmTarget.newRole) {
      updateUserMutation.mutate(
        { userId: confirmTarget.user.id, payload: { role: confirmTarget.newRole } },
        { onSettled: () => setConfirmTarget(null) },
      );
    }
  };

  const isActionLoading = updateUserMutation.isPending || deleteUserMutation.isPending;

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <PageHeader
        title="User Administration"
        subtitle="Manage user accounts, roles, access states, and register new team members"
        actions={
          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="gap-2 shadow-2xs font-semibold"
          >
            <UserPlus className="size-4" />
            Add User
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <Card className="border-border shadow-2xs">
        <CardContent className="p-3.5">
          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-8.5 h-8.5 text-xs sm:text-sm border-border bg-slate-50/50 hover:bg-white focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="w-[125px]">
                <Select
                  value={roleFilter}
                  onValueChange={(val) => {
                    setRoleFilter(val);
                    setPage(1);
                  }}
                >
                  <SelectTrigger size="sm" className="h-8.5 text-xs font-medium border-slate-200 bg-slate-50/60">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent align="start">
                    <SelectItem value="ALL">All Roles</SelectItem>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[125px]">
                <Select
                  value={statusFilter}
                  onValueChange={(val) => {
                    setStatusFilter(val);
                    setPage(1);
                  }}
                >
                  <SelectTrigger size="sm" className="h-8.5 text-xs font-medium border-slate-200 bg-slate-50/60">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent align="start">
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      {isPending ? (
        <TableSkeleton rows={8} cols={5} title="Loading user accounts..." />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : data.data.length === 0 ? (
        <EmptyState
          title="No users match your criteria"
          description="Try clearing search or filters to see registered accounts."
          action={
            <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-2">
              <UserPlus className="size-4" />
              Add First User
            </Button>
          }
        />
      ) : (
        <Card className="relative border-border shadow-2xs overflow-hidden">
          {/* Top Indeterminate Loading Progress Bar */}
          {isFetching && (
            <div className="absolute inset-x-0 top-0 h-1 z-30 overflow-hidden bg-primary/15">
              <div className="h-full bg-primary animate-indeterminate w-1/3" />
            </div>
          )}

          {/* Floating Status Badge when fetching */}
          {isFetching && (
            <div className="absolute top-2.5 right-4 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 border border-primary/20 text-[11px] font-semibold text-primary shadow-xs backdrop-blur-xs animate-in fade-in-50 duration-150">
              <Loader2 className="size-3 animate-spin text-primary" />
              <span>Updating users...</span>
            </div>
          )}

          <div className={`overflow-x-auto transition-opacity duration-200 ${isFetching ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-border">
                  <TableHead className="pl-5 text-xs font-bold uppercase tracking-wider text-slate-500">
                    User
                  </TableHead>
                  <TableHead className="w-36 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Role
                  </TableHead>
                  <TableHead className="w-32 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </TableHead>
                  <TableHead className="hidden md:table-cell text-xs font-bold uppercase tracking-wider text-slate-500">
                    Joined
                  </TableHead>
                  <TableHead className="text-right pr-5 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((item, idx) => {
                  const isSelf = item.id === currentUserId;
                  return (
                    <TableRow
                      key={item.id}
                      className={`transition-colors hover:bg-indigo-50/40 border-b border-border/60 last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}
                    >
                      <TableCell className="pl-5 py-3">
                        <div className="flex items-center gap-3">
                          <UserAvatar name={item.name} size="md" />
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-xs sm:text-sm text-foreground flex items-center gap-1.5">
                              {item.name}
                              {isSelf && (
                                <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-primary/30 text-primary bg-primary/5">
                                  You
                                </Badge>
                              )}
                              {item.role === 'ADMIN' && !isSelf && (
                                <Shield className="size-3 text-amber-500" />
                              )}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">{item.email}</span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-3">
                        {isSelf ? (
                          <Badge
                            variant={item.role === 'ADMIN' ? 'default' : 'secondary'}
                            className="font-semibold text-xs"
                          >
                            {item.role}
                          </Badge>
                        ) : (
                          <Select
                            value={item.role}
                            onValueChange={(newRole) => handleRoleChange(item, newRole as UserRole)}
                            disabled={isActionLoading}
                          >
                            <SelectTrigger size="sm" className="h-7 text-xs font-semibold w-[95px] border-slate-200 bg-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent align="start">
                              <SelectItem value="USER">USER</SelectItem>
                              <SelectItem value="ADMIN">ADMIN</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>

                      <TableCell className="py-3">
                        {item.isActive ? (
                          <Badge
                            variant="outline"
                            className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 text-[11px] font-semibold"
                          >
                            <CheckCircle className="size-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-slate-100 text-slate-500 border-slate-200 gap-1 text-[11px] font-semibold"
                          >
                            <XCircle className="size-3" />
                            Inactive
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="hidden md:table-cell py-3 text-xs text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </TableCell>

                      <TableCell className="text-right pr-5 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Details */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDetailsTargetId(item.id)}
                            className="size-7.5 p-0 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            title="View details & activity"
                          >
                            <Eye className="size-3.5" />
                          </Button>

                          {/* Edit User */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditTarget(item)}
                            className="size-7.5 p-0 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            title="Edit user profile"
                          >
                            <Pencil className="size-3.5" />
                          </Button>

                          {/* Deactivate / Activate Toggle */}
                          {!isSelf && (
                            <Button
                              variant={item.isActive ? 'outline' : 'default'}
                              size="sm"
                              onClick={() => handleToggleStatus(item)}
                              disabled={isActionLoading}
                              className={`h-7 px-2.5 text-xs font-medium gap-1 ${
                                item.isActive
                                  ? 'text-destructive hover:bg-destructive/10 border-destructive/30 hover:border-destructive/60'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white border-0'
                              }`}
                              title={item.isActive ? 'Deactivate user' : 'Reactivate user'}
                            >
                              {item.isActive ? (
                                <>
                                  <UserX className="size-3" />
                                  <span className="hidden sm:inline">Deactivate</span>
                                </>
                              ) : (
                                <>
                                  <UserCheck className="size-3" />
                                  <span className="hidden sm:inline">Activate</span>
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="p-3.5 border-t border-border bg-slate-50/50">
            <Pagination
              page={data.meta.page}
              totalPages={data.meta.totalPages}
              totalItems={data.meta.total}
              limit={data.meta.limit}
              isFetching={isFetching}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </Card>
      )}

      {/* Create User Dialog */}
      <CreateUserDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

      {/* Edit User Dialog */}
      <EditUserDialog
        user={editTarget}
        open={Boolean(editTarget)}
        onOpenChange={(open) => !open && setEditTarget(null)}
      />

      {/* User Details & Stats Dialog */}
      <UserDetailsDialog
        userId={detailsTargetId}
        open={Boolean(detailsTargetId)}
        onOpenChange={(open) => !open && setDetailsTargetId(null)}
        onEditClick={(u) => setEditTarget(u)}
      />

      {/* Status Toggle Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(confirmTarget)}
        onOpenChange={(open) => !open && setConfirmTarget(null)}
        title={
          confirmTarget?.action === 'deactivate'
            ? 'Deactivate User Account?'
            : confirmTarget?.action === 'activate'
            ? 'Activate User Account?'
            : 'Change User Role?'
        }
        description={
          confirmTarget?.action === 'deactivate'
            ? `Are you sure you want to deactivate ${confirmTarget.user.name}? Their account will be disabled and all active sessions will be terminated immediately.`
            : confirmTarget?.action === 'activate'
            ? `Are you sure you want to reactivate ${confirmTarget.user.name}'s account? They will be able to log in again.`
            : `Are you sure you want to change ${confirmTarget?.user.name}'s role to ${confirmTarget?.newRole}?`
        }
        confirmText={confirmTarget?.action === 'deactivate' ? 'Deactivate' : 'Update'}
        isDestructive={confirmTarget?.action === 'deactivate'}
        isLoading={isActionLoading}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
