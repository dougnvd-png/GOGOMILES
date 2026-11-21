import { offerStatusLabels, type OfferStatus } from '@/lib/offers';
import { cn } from '@/lib/utils';

const statusStyles: Record<OfferStatus, string> = {
  open: 'border-status-open/25 bg-status-open/10 text-status-open',
  in_progress:
    'border-status-progress/25 bg-status-progress/10 text-status-progress',
  done: 'border-status-done/25 bg-status-done/10 text-status-done',
};

export const OfferStatusBadge = ({ status }: { status: OfferStatus }) => (
  <span
    className={cn(
      'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
      statusStyles[status],
    )}
  >
    <span aria-hidden className="size-1.5 rounded-full bg-current" />
    {offerStatusLabels[status]}
  </span>
);
