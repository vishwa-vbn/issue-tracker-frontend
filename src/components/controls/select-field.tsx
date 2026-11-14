import { useId } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/cn';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFieldProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  options: readonly SelectOption[] | SelectOption[];
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  error,
  hint,
  disabled,
  className,
  id,
}: SelectFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Label htmlFor={fieldId} className={cn(error && 'text-destructive')}>
        {label}
      </Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          id={fieldId}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(
            error && 'border-destructive focus:ring-destructive',
            className,
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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

