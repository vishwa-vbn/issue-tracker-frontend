import { useId, type ComponentProps } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/cn';

export type TextAreaFieldProps = ComponentProps<typeof Textarea> & {
  label: string;
  error?: string;
  hint?: string;
  maxLength?: number;
};

export function TextAreaField({
  label,
  error,
  hint,
  id,
  maxLength,
  value,
  className,
  ...props
}: TextAreaFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;

  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between">
        <Label htmlFor={fieldId} className={cn(error && 'text-destructive')}>
          {label}
        </Label>
        {maxLength && (
          <span className="text-xs text-muted-foreground">
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
      <Textarea
        id={fieldId}
        value={value}
        maxLength={maxLength}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={cn(
          error && 'border-destructive focus-visible:ring-destructive',
          className,
        )}
        {...props}
      />
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

