import { useId, useState, type ComponentProps, type ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/cn';

export type TextFieldProps = Omit<ComponentProps<typeof Input>, 'prefix'> & {
  label: string;
  error?: string;
  hint?: string;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
};

export function TextField({
  label,
  error,
  hint,
  id,
  type,
  prefixIcon,
  suffixIcon,
  className,
  ...props
}: TextFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;

  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Label htmlFor={fieldId} className={cn(error && 'text-destructive')}>
        {label}
      </Label>
      <div className="relative flex items-center">
        {prefixIcon && (
          <div className="absolute left-3 text-muted-foreground pointer-events-none flex items-center">
            {prefixIcon}
          </div>
        )}
        <Input
          id={fieldId}
          type={effectiveType}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(
            prefixIcon && 'pl-9',
            (isPassword || suffixIcon) && 'pr-9',
            error && 'border-destructive focus-visible:ring-destructive',
            className,
          )}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        ) : suffixIcon ? (
          <div className="absolute right-3 text-muted-foreground pointer-events-none flex items-center">
            {suffixIcon}
          </div>
        ) : null}
      </div>
      {hint && !error && (
        <p id={`${fieldId}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${fieldId}-error`} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

