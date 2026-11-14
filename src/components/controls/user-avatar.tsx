import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/utils/cn';

interface UserAvatarProps {
  name?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZES = {
  xs: {
    container: 'size-5.5',
    text: 'text-[8.5px] font-medium leading-none tracking-tight',
  },
  sm: {
    container: 'size-6.5',
    text: 'text-[9.5px] font-medium leading-none tracking-tight',
  },
  md: {
    container: 'size-7.5',
    text: 'text-[10.5px] font-medium leading-none tracking-tight',
  },
  lg: {
    container: 'size-9',
    text: 'text-xs font-semibold leading-none tracking-tight',
  },
  xl: {
    container: 'size-11',
    text: 'text-sm font-semibold leading-none tracking-tight',
  },
};

function getInitials(name?: string | null): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_PALETTES = [
  { bg: 'bg-indigo-50/90', text: 'text-indigo-700', border: 'border-indigo-200/80' },
  { bg: 'bg-sky-50/90', text: 'text-sky-700', border: 'border-sky-200/80' },
  { bg: 'bg-emerald-50/90', text: 'text-emerald-700', border: 'border-emerald-200/80' },
  { bg: 'bg-violet-50/90', text: 'text-violet-700', border: 'border-violet-200/80' },
  { bg: 'bg-amber-50/90', text: 'text-amber-700', border: 'border-amber-200/80' },
  { bg: 'bg-rose-50/90', text: 'text-rose-700', border: 'border-rose-200/80' },
  { bg: 'bg-teal-50/90', text: 'text-teal-700', border: 'border-teal-200/80' },
  { bg: 'bg-blue-50/90', text: 'text-blue-700', border: 'border-blue-200/80' },
];

function getAvatarPalette(name?: string | null) {
  if (!name) return { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' };
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTES[Math.abs(hash) % AVATAR_PALETTES.length];
}

export function UserAvatar({ name, size = 'md', className }: UserAvatarProps) {
  const initials = getInitials(name);
  const palette = getAvatarPalette(name);
  const sizeConfig = SIZES[size];

  return (
    <Avatar
      className={cn(
        sizeConfig.container,
        'shrink-0 rounded-full border shadow-2xs',
        palette.border,
        className,
      )}
    >
      <AvatarFallback
        className={cn(
          palette.bg,
          palette.text,
          sizeConfig.text,
          'p-0.5 select-none text-center inline-flex items-center justify-center',
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
