import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { ShieldCheck, KeyRound, Mail, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/controls/text-field';
import { ActionButton } from '@/components/controls/action-button';
import { useAdminLogin } from '@/features/auth/hooks/use-admin-login';
import { loginSchema, type LoginValues } from '@/features/auth/schemas';
import { applyApiErrors, messageForError } from '@/helpers/error-messages';
import { ROUTES } from '@/constants';

export default function AdminLoginPage() {
  const { control, handleSubmit, setError, setValue } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const [formError, setFormError] = useState<string | null>(null);
  const adminLoginMutation = useAdminLogin();

  const onSubmit = handleSubmit((values) => {
    setFormError(null);
    adminLoginMutation.mutate(values, {
      onError: (err) => {
        applyApiErrors(err, setError);
        setFormError(messageForError(err));
      },
    });
  });

  const fillDemoAdmin = () => {
    setValue('email', 'admin@example.com', { shouldValidate: true });
    setValue('password', 'ChangeMe123', { shouldValidate: true });
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100">
      <Card className="w-full max-w-md shadow-2xl border-slate-800 bg-slate-900 text-slate-100">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40 shadow">
            <ShieldCheck className="size-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white">
              Administrator Portal
            </CardTitle>
            <CardDescription className="text-sm mt-1 text-slate-400">
              Authorized system administration and user management only
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {formError && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs sm:text-sm font-medium text-red-400"
            >
              {formError}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="email"
                  label="Admin Email"
                  placeholder="admin@example.com"
                  autoComplete="email"
                  className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-500"
                  prefixIcon={<Mail className="size-4 text-slate-400" />}
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
                  label="Password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-500"
                  prefixIcon={<KeyRound className="size-4 text-slate-400" />}
                  error={fieldState.error?.message}
                />
              )}
            />

            <ActionButton
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold"
              isLoading={adminLoginMutation.isPending}
            >
              Sign In as Administrator
            </ActionButton>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fillDemoAdmin}
              className="w-full text-xs gap-1.5 border-dashed border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Sparkles className="size-3.5 text-amber-400" />
              Fill Admin Credentials (admin@example.com)
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 border-t border-slate-800 py-4 text-center text-xs text-slate-400">
          <div>
            Regular member?{' '}
            <Link to={ROUTES.LOGIN} className="font-semibold text-amber-400 hover:underline">
              Standard Sign In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

