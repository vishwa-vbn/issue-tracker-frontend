import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { messageForError } from '@/helpers/error-messages';
import { cn } from '@/utils/cn';

interface ErrorStateProps {
  error?: unknown;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ error, message, onRetry, className }: ErrorStateProps) {
  const displayMessage = message || (error ? messageForError(error) : 'Something went wrong.');

  return (
    <div
      className={cn(
        'flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center animate-in fade-in-50',
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
        <AlertTriangle className="size-6" />
      </div>
      <h3 className="text-base font-semibold text-foreground tracking-tight">Unable to load data</h3>
      <p className="mt-1.5 max-w-md text-sm text-muted-foreground">{displayMessage}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="mt-5 gap-2 border-border"
        >
          <RefreshCw className="size-3.5" />
          Try again
        </Button>
      )}
    </div>
  );
}

