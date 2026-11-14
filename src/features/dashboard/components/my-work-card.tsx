import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserCheck, Clock, FilePlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { useAppSelector } from '@/store';

interface MyWorkCardProps {
  mine: {
    assigned: number;
    assignedOpen: number;
    reported: number;
  };
}

export function MyWorkCard({ mine }: MyWorkCardProps) {
  const currentUserId = useAppSelector((s) => s.auth.user?.id);

  const workItems = [
    {
      title: 'Assigned to me',
      count: mine.assigned,
      icon: UserCheck,
      bgClass: 'bg-indigo-50 border-indigo-200',
      iconClass: 'text-indigo-600',
      href: currentUserId ? `${ROUTES.ISSUES}?assigneeId=${currentUserId}` : ROUTES.ISSUES,
      description: 'All tasks on your plate',
    },
    {
      title: 'Assigned & Open',
      count: mine.assignedOpen,
      icon: Clock,
      bgClass: 'bg-amber-50 border-amber-200',
      iconClass: 'text-amber-600',
      href: currentUserId ? `${ROUTES.ISSUES}?assigneeId=${currentUserId}&status=OPEN` : ROUTES.ISSUES,
      description: 'Need your attention',
    },
    {
      title: 'Reported by me',
      count: mine.reported,
      icon: FilePlus,
      bgClass: 'bg-emerald-50 border-emerald-200',
      iconClass: 'text-emerald-600',
      href: `${ROUTES.ISSUES}?reportedByMe=true`,
      description: 'Tickets you opened',
    },
  ];

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-3 pt-5 px-5">
        <CardTitle className="text-base font-semibold">My Work</CardTitle>
        <CardDescription className="text-xs">
          Your personal assignments and submitted tickets
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-1 px-5 pb-5">
        {workItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              to={item.href}
              className="flex flex-col justify-between rounded-xl border p-4 hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm transition-all duration-150 group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                  {item.title}
                </span>
                <div className={`flex size-8 items-center justify-center rounded-lg border ${item.bgClass}`}>
                  <Icon className={`size-4 ${item.iconClass}`} />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {item.count}
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
