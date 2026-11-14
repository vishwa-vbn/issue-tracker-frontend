import { Loader2 } from 'lucide-react';

export function FullPageSplash() {
  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen flex-col items-center justify-center bg-background p-4 select-none">
      <div className="flex flex-col items-center gap-3.5 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-2xs">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold tracking-tight text-foreground">Issue Tracker</h2>
          <p className="text-xs text-muted-foreground">Loading workspace...</p>
        </div>
      </div>
    </div>
  );
}
