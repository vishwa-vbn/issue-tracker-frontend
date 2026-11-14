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
import { useCreateUser } from '../hooks/use-create-user';
import { createUserSchema, type CreateUserFormValues } from '../schemas';
import { applyApiErrors } from '@/helpers/error-messages';
import { ROLES, type UserRole } from '@/constants';
import { UserPlus, Shield, User, Mail, Lock } from 'lucide-react';
import { useEffect } from 'react';

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
  const createUserMutation = useCreateUser();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: ROLES.USER,
      isActive: true,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: '',
        email: '',
        password: '',
        role: ROLES.USER,
        isActive: true,
      });
    }
  }, [open, reset]);

  const onSubmit = handleSubmit((data) => {
    createUserMutation.mutate(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role as UserRole,
        isActive: data.isActive,
      },
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserPlus className="size-4.5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">Create New User</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Register a new member or administrator account directly
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 py-1" noValidate>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Full Name"
                placeholder="e.g. Sarah Connor"
                prefixIcon={<User className="size-3.5" />}
                error={fieldState.error?.message}
                autoFocus
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
                placeholder="sarah@example.com"
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
                label="Initial Password"
                placeholder="At least 8 characters"
                prefixIcon={<Lock className="size-3.5" />}
                hint="Minimum 8 characters"
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
                  <Select value={field.value} onValueChange={field.onChange}>
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
                  <div className="flex items-center gap-2.5 h-9 px-3 rounded-lg border border-border bg-slate-50/50">
                    <Checkbox
                      id="create-user-active"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label
                      htmlFor="create-user-active"
                      className="text-xs font-medium cursor-pointer select-none"
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
              disabled={createUserMutation.isPending}
            >
              Cancel
            </Button>
            <ActionButton
              type="submit"
              size="sm"
              isLoading={createUserMutation.isPending || isSubmitting}
            >
              Create Account
            </ActionButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

