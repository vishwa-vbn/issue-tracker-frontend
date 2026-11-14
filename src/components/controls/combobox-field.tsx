import { useState, useId } from 'react';
import { Check, ChevronsUpDown, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { UserAvatar } from './user-avatar';
import { cn } from '@/utils/cn';

export interface ComboboxOption {
  value: string;
  label: string;
  email?: string;
}

export interface ComboboxFieldProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  unassignedLabel?: string;
  allowUnassigned?: boolean;
  error?: string;
  hint?: string;
  disabled?: boolean;
  id?: string;
}

export function ComboboxField({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select user...',
  searchPlaceholder = 'Search users...',
  emptyText = 'No users found.',
  unassignedLabel = 'Unassigned',
  allowUnassigned = true,
  error,
  hint,
  disabled,
  id,
}: ComboboxFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;

  const [open, setOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Label htmlFor={fieldId} className={cn('text-xs font-semibold text-slate-700', error && 'text-destructive')}>
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={fieldId}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            disabled={disabled}
            className={cn(
              'w-full justify-between font-normal text-left h-9 text-xs sm:text-sm bg-white border-slate-200 hover:border-slate-300 shadow-2xs px-3',
              !value && 'text-muted-foreground',
              error && 'border-destructive focus:ring-destructive',
            )}
          >
            {value && selectedOption ? (
              <span className="flex items-center gap-2 truncate">
                <UserAvatar name={selectedOption.label} size="xs" />
                <span className="truncate font-medium text-slate-800">
                  {selectedOption.label}
                </span>
                {selectedOption.email && (
                  <span className="text-[11px] text-muted-foreground truncate">
                    ({selectedOption.email})
                  </span>
                )}
              </span>
            ) : (
              <span className="flex items-center gap-2 text-muted-foreground text-xs">
                <UserX className="size-3.5" />
                <span>{placeholder || unassignedLabel}</span>
              </span>
            )}
            <ChevronsUpDown className="ml-2 size-3.5 shrink-0 text-slate-400" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0 shadow-lg border-border" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} className="h-8.5 text-xs" />
            <CommandList className="max-h-60 p-1">
              <CommandEmpty className="py-3 text-center text-xs text-muted-foreground">{emptyText}</CommandEmpty>
              <CommandGroup>
                {allowUnassigned && (
                  <CommandItem
                    value="unassigned"
                    onSelect={() => {
                      onChange(null);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between cursor-pointer py-1.5 px-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-100"
                  >
                    <span className="flex items-center gap-2">
                      <UserX className="size-3.5 text-muted-foreground" />
                      <span>{unassignedLabel}</span>
                    </span>
                    {!value && <Check className="size-3.5 text-primary" />}
                  </CommandItem>
                )}
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={`${option.label} ${option.email || ''}`}
                    onSelect={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between cursor-pointer py-1.5 px-2 rounded-md hover:bg-slate-100"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <UserAvatar name={option.label} size="xs" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-medium text-slate-800 truncate">
                          {option.label}
                        </span>
                        {option.email && (
                          <span className="text-[10px] text-muted-foreground truncate">
                            {option.email}
                          </span>
                        )}
                      </div>
                    </span>
                    {value === option.value && <Check className="size-3.5 text-primary shrink-0" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
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
