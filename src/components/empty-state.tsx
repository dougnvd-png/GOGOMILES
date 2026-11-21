import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => (
  <div
    className={cn(
      'grid justify-items-center gap-3 px-6 py-10 text-center',
      className,
    )}
  >
    <span
      aria-hidden
      className="bg-brand-soft text-brand-ink grid size-11 place-items-center rounded-2xl"
    >
      <Icon className="size-5" />
    </span>
    <div className="grid gap-1">
      <p className="font-medium">{title}</p>
      {description && (
        <p className="text-muted-foreground max-w-sm text-sm text-pretty">
          {description}
        </p>
      )}
    </div>
    {action}
  </div>
);
