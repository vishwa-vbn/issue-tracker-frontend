import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return '—';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  if (!isValid(date)) return '—';
  return format(date, 'MMM d, yyyy');
}

export function formatDateTime(dateString: string | Date | null | undefined): string {
  if (!dateString) return '—';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  if (!isValid(date)) return '—';
  return format(date, 'MMM d, yyyy h:mm a');
}

export function formatRelativeTime(dateString: string | Date | null | undefined): string {
  if (!dateString) return '—';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  if (!isValid(date)) return '—';
  return formatDistanceToNow(date, { addSuffix: true });
}

