import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TextField } from '@/components/controls/text-field';
import { ActionButton } from '@/components/controls/action-button';
import { useUpdateUser } from '../hooks/use-update-user';
import { editUserSchema, type EditUserFormValues } from '../schemas';
import { applyApiErrors } from '@/helpers/error-messages';
import { ROLES, type UserRole } from '@/constants';
import type { UserSummary } from '../types';
import { UserCheck, Shield, User, Mail, KeyRound, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';
import { useAppSelector } from '@/store';

interface EditUserDialogProps {
  user: UserSummary | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({ user, open, onOpenChange }: EditUserDialogProps) {
  const currentUserId = useAppSelector((s) => s.auth.user?.id);
  const isSelf = user?.id === currentUserId;
  const updateUserMutation = useUpdateUser();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting },
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: ROLES.USER,
      isActive: true,
    },
  });

  useEffect(() => {
    if (user && open) {
      reset({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        isActive: user.isActive,
      });
    }
  }, [user, open, reset]);

  const onSubmit = handleSubmit((data) => {
    if (!user) return;

    const payload: {
      name: string;
      email: string;
      role?: UserRole;
      isActive?: boolean;
      password?: string;
    } = {
      name: data.name,
      email: data.email,
    };

    if (!isSelf) {
      payload.role = data.role as UserRole;
      payload.isActive = data.isActive;
    }

    if (data.password && data.password.trim().length >= 8) {
      payload.password = data.password.trim();
    }

    updateUserMutation.mutate(
      { userId: user.id, payload },
      {
        onSuccess: () => {
          onOpenChange(false);
          reset();
        },
        onError: (err) => {
          applyApiErrors(err, setError);
        },
      },
    );
  });

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
              <UserCheck className="size-4.5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">Edit User Profile</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Update user credentials, role permissions, or reset password
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isSelf && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
            <AlertTriangle className="size-4 shrink-0 text-amber-600" />
            <span>You are editing your own account. Role and active status cannot be self-modified.</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4 py-1" noValidate>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Full Name"
                placeholder="Full Name"
                prefixIcon={<User className="size-3.5" />}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="email"
                label="Email Address"
                placeholder="user@example.com"
                prefixIcon={<Mail className="size-3.5" />}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="password"
                label="Reset Password (Optional)"
                placeholder="Leave blank to keep unchanged"
                prefixIcon={<KeyRound className="size-3.5" />}
                hint="Only fill this if you want to reset the user's password"
                error={fieldState.error?.message}
              />
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Account Role</Label>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSelf}
                  >
                    <SelectTrigger className="h-9 text-xs font-medium">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ROLES.USER}>
                        <div className="flex items-center gap-2">
                          <User className="size-3 text-slate-500" />
                          <span>Standard User</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={ROLES.ADMIN}>
                        <div className="flex items-center gap-2">
                          <Shield className="size-3 text-amber-500" />
                          <span>Administrator</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />

            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col justify-end space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Account Status</Label>
                  <div className={`flex items-center gap-2.5 h-9 px-3 rounded-lg border border-border ${isSelf ? 'opacity-50 cursor-not-allowed bg-slate-100' : 'bg-slate-50/50'}`}>
                    <Checkbox
                      id="edit-user-active"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSelf}
                    />
                    <Label
                      htmlFor="edit-user-active"
                      className={`text-xs font-medium select-none ${isSelf ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      Active Account
                    </Label>
                  </div>
                </div>
              )}
            />
          </div>

          <DialogFooter className="pt-3 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={updateUserMutation.isPending}
            >
              Cancel
            </Button>
            <ActionButton
              type="submit"
              size="sm"
              isLoading={updateUserMutation.isPending || isSubmitting}
            >
              Save Changes
            </ActionButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

