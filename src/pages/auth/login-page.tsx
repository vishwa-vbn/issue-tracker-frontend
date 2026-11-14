import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Bug, KeyRound, Mail, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/controls/text-field';
import { ActionButton } from '@/components/controls/action-button';
import { useLogin } from '@/features/auth/hooks/use-login';
import { loginSchema, type LoginValues } from '@/features/auth/schemas';
import { applyApiErrors, messageForError } from '@/helpers/error-messages';
import { ROUTES } from '@/constants';
import { useState } from 'react';

export default function LoginPage() {
  const { control, handleSubmit, setError, setValue } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const [formError, setFormError] = useState<string | null>(null);
  const loginMutation = useLogin();

  const onSubmit = handleSubmit((values) => {
    setFormError(null);
    loginMutation.mutate(values, {
      onError: (err) => {
        applyApiErrors(err, setError);
        setFormError(messageForError(err));
      },
    });
  });

  const fillDemo = () => {
    setValue('email', 'demo.user@example.com', { shouldValidate: true });
    setValue('password', 'Passw0rdOK', { shouldValidate: true });
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Background decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 size-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 size-96 rounded-full bg-indigo-200/20 blur-3xl" />
      </div>

      <Card className="relative w-full max-w-md shadow-xl border-border/80 bg-card/95 backdrop-blur">
        <CardHeader className="space-y-4 text-center pt-8 pb-6">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            <Bug className="size-7" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
            <CardDescription className="text-sm mt-1.5">
              Sign in to manage and track your project issues
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-4">
          {formError && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/8 p-3.5 text-sm font-medium text-destructive"
            >
              <span className="mt-0.5 shrink-0">⚠</span>
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
                  label="Email address"
                  placeholder="you@company.com"
                  autoComplete="email"
                  prefixIcon={<Mail className="size-4" />}
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
                  prefixIcon={<KeyRound className="size-4" />}
                  error={fieldState.error?.message}
                />
              )}
            />

            <ActionButton
              type="submit"
              className="w-full font-semibold h-10 mt-1"
              isLoading={loginMutation.isPending}
            >
              Sign In
            </ActionButton>
          </form>

          <div className="mt-5 pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fillDemo}
              className="w-full text-xs gap-2 border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5 text-muted-foreground"
            >
              <Sparkles className="size-3.5 text-primary" />
              Fill Demo Credentials (demo.user@example.com)
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2.5 border-t border-border/60 py-5 px-6 text-center text-xs text-muted-foreground bg-slate-50/50 rounded-b-xl">
          <div>
            Don't have an account?{' '}
            <Link to={ROUTES.REGISTER} className="font-semibold text-primary hover:underline underline-offset-2">
              Create an account
            </Link>
          </div>
          <div>
            System administrator?{' '}
            <Link to={ROUTES.ADMIN_LOGIN} className="font-semibold text-primary hover:underline underline-offset-2">
              Admin Portal →
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
