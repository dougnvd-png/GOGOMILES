import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  /** Linha abaixo do número: variação, comparação ou observação curta. */
  detail?: ReactNode;
  /** Elemento visual no rodapé do card, como um mini gráfico. */
  visual?: ReactNode;
}

export const MetricCard = ({
  label,
  value,
  icon: Icon,
  detail,
  visual,
}: MetricCardProps) => (
  <Card className="gap-0 overflow-hidden py-0">
    <CardContent className="grid gap-3 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm font-medium">{label}</p>
        <span
          aria-hidden
          className="bg-brand-soft text-brand-ink grid size-8 shrink-0 place-items-center rounded-lg"
        >
          <Icon className="size-4" />
        </span>
      </div>
      <p className="text-3xl leading-none font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      {detail && (
        <div className="text-muted-foreground flex min-h-5 flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          {detail}
        </div>
      )}
    </CardContent>
    {visual && <div className="mt-auto px-5 pb-4">{visual}</div>}
  </Card>
);
