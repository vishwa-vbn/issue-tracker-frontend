import { useAppSelector } from '@/store';
import { Loader2, Server } from 'lucide-react';

export function ServerWakingBanner() {
  const isWaking = useAppSelector((s) => s.ui.serverWaking);

  if (!isWaking) return null;

  return (
    <div className="sticky top-0 z-50 flex items-center justify-center gap-2.5 bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 text-xs md:text-sm font-medium text-amber-900 backdrop-blur transition-all">
      <Server className="size-4 shrink-0 text-amber-700 animate-pulse" />
      <span>
        Waking the server — initial cold starts on free hosting can take up to a minute. Please wait...
      </span>
      <Loader2 className="size-3.5 shrink-0 animate-spin text-amber-700" />
    </div>
  );
}

