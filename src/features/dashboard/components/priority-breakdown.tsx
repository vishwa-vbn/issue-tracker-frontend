import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowDown, ArrowUp, AlertTriangle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';

interface PriorityBreakdownProps {
  byPriority: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export function PriorityBreakdown({ byPriority }: PriorityBreakdownProps) {
  const total = byPriority.low + byPriority.medium + byPriority.high + byPriority.critical;

  const priorities = [
    {
      key: 'CRITICAL',
      label: 'Critical',
      count: byPriority.critical,
      color: 'bg-red-500',
      textColor: 'text-red-700',
      icon: AlertCircle,
    },
    {
      key: 'HIGH',
      label: 'High',
      count: byPriority.high,
      color: 'bg-orange-500',
      textColor: 'text-orange-700',
      icon: AlertTriangle,
    },
    {
      key: 'MEDIUM',
      label: 'Medium',
      count: byPriority.medium,
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      icon: ArrowUp,
    },
    {
      key: 'LOW',
      label: 'Low',
      count: byPriority.low,
      color: 'bg-slate-400',
      textColor: 'text-slate-600',
      icon: ArrowDown,
    },
  ];

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Priority Distribution</CardTitle>
        <CardDescription className="text-xs">
          Breakdown of all active and resolved issues by urgency
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-1">
        {priorities.map((item) => {
          const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              to={`${ROUTES.ISSUES}?priority=${item.key}`}
              className="group block space-y-1.5 rounded-lg p-1.5 -mx-1.5 hover:bg-accent transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <Icon className={`size-3.5 ${item.textColor}`} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{item.count}</span>
                  <span className="text-muted-foreground w-8 text-right">{percentage}%</span>
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}

