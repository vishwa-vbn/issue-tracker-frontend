import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/utils/cn';
import { TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  description?: string;
  href?: string;
  trend?: string;
  colorClass?: string;
}

export function StatCard({
  title,
  value,
  icon,
  description,
  href,
  trend,
  colorClass = 'text-primary bg-primary/10',
}: StatCardProps) {
  const content = (
    <Card
      className={cn(
        'border-border shadow-sm transition-all duration-200',
        href && 'cursor-pointer hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5',
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
              {title}
            </p>
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              {value.toLocaleString()}
            </span>
            {description && (
              <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
            )}
            {trend && (
              <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-emerald-600">
                <TrendingUp className="size-3" />
                {trend}
              </span>
            )}
          </div>
          <div
            className={cn(
              'flex size-11 shrink-0 items-center justify-center rounded-xl border',
              colorClass,
            )}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link to={href} className="block">{content}</Link>;
  }

  return content;
}
