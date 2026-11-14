import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  onBack?: () => void;
  actions?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  backTo,
  onBack,
  actions,
  children,
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  const showBackButton = !!backTo || !!onBack;

  return (
    <div className="flex flex-col gap-4 pb-5 mb-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              aria-label="Go back"
              className="size-9 p-0 shrink-0 mt-0.5 rounded-lg hover:bg-slate-100 border border-transparent hover:border-border"
            >
              <ArrowLeft className="size-4" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[26px]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{subtitle}</p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2.5 sm:self-center shrink-0">
            {actions}
          </div>
        )}
      </div>

      {children}
    </div>
  );
}
