import type { ComponentProps } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type ActionButtonProps = ComponentProps<typeof Button> & {
  isLoading?: boolean;
};

export function ActionButton({
  isLoading,
  disabled,
  children,
  className,
  ...props
}: ActionButtonProps) {
  return (
    <Button
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={className}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />}
      {children}
    </Button>
  );
}

