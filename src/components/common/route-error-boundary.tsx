import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';

export function RouteErrorBoundary() {
  const error = useRouteError();

  let errorMessage = 'An unexpected application error occurred.';
  let errorTitle = 'Something went wrong';

  if (isRouteErrorResponse(error)) {
    errorTitle = `${error.status} ${error.statusText}`;
    errorMessage = error.data?.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4 shadow-xs">
        <AlertTriangle className="size-7" />
      </div>
      <h2 className="text-xl font-bold tracking-tight text-foreground">{errorTitle}</h2>
      <p className="mt-1.5 max-w-md text-sm text-muted-foreground">{errorMessage}</p>

      <div className="mt-6 flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 size-3.5" />
          Reload Page
        </Button>
        <Button asChild size="sm">
          <Link to={ROUTES.DASHBOARD}>
            <Home className="mr-2 size-3.5" />
            Go to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}

