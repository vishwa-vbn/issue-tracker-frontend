import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4 shadow-sm">
        <ShieldAlert className="size-8" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Access Restricted</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        You do not have administrative privileges to view or modify this resource.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button asChild variant="default">
          <Link to={ROUTES.DASHBOARD}>
            <ArrowLeft className="mr-2 size-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}

