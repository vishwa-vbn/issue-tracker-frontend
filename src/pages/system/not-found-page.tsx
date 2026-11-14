import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-background">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
        <FileQuestion className="size-8" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground">404</h1>
      <h2 className="mt-2 text-xl font-semibold text-foreground">Page Not Found</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button asChild>
          <Link to={ROUTES.DASHBOARD}>
            <ArrowLeft className="mr-2 size-4" />
            Go to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}

