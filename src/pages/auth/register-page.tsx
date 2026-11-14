import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Bug, KeyRound, Mail, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TextField } from '@/components/controls/text-field';
import { ActionButton } from '@/components/controls/action-button';
import { useRegister } from '@/features/auth/hooks/use-register';
import { registerSchema, type RegisterValues } from '@/features/auth/schemas';
import { applyApiErrors, messageForError } from '@/helpers/error-messages';
import { ROUTES } from '@/constants';

export default function RegisterPage() {
  const { control, handleSubmit, setError } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const [formError, setFormError] = useState<string | null>(null);
  const registerMutation = useRegister();

  const onSubmit = handleSubmit((values) => {
    setFormError(null);
    registerMutation.mutate(values, {
      onError: (err) => {
        applyApiErrors(err, setError);
        setFormError(messageForError(err));
      },
    });
  });

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
            <Bug className="size-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
            <CardDescription className="text-sm mt-1">
              Join your team to collaborate and track issues seamlessly
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {formError && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs sm:text-sm font-medium text-destructive"
            >
              {formError}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Full Name"
                  placeholder="Jane Doe"
                  autoComplete="name"
                  prefixIcon={<User className="size-4" />}
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
                  label="Email address"
                  placeholder="jane@example.com"
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
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  hint="Must contain at least 8 characters with letters and numbers"
                  prefixIcon={<KeyRound className="size-4" />}
                  error={fieldState.error?.message}
                />
              )}
            />

            <ActionButton
              type="submit"
              className="w-full font-semibold"
              isLoading={registerMutation.isPending}
            >
              Register & Sign In
            </ActionButton>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
          <div>
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="font-semibold text-primary hover:underline">
              Sign In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

