import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

import { cn } from '@/lib/utils';

interface TrendProps {
  /** Variação contra o período anterior. null quando não há base de comparação. */
  change: number | null;
  /** Sufixo do número: '%' para variação relativa, ' p.p.' para pontos percentuais. */
  unit?: string;
  /** Use quando diminuir é bom, como no tempo médio de conclusão. */
  lowerIsBetter?: boolean;
}

const TrendIcon = ({ change }: { change: number }) => {
  const className = 'size-3.5';
  if (change > 0) {
    return <ArrowUpRight aria-hidden className={className} />;
  }
  if (change < 0) {
    return <ArrowDownRight aria-hidden className={className} />;
  }
  return <Minus aria-hidden className={className} />;
};

export const Trend = ({
  change,
  unit = '%',
  lowerIsBetter = false,
}: TrendProps) => {
  if (change === null) {
    return (
      <span className="text-muted-foreground text-xs">Sem período anterior</span>
    );
  }
  const improved = lowerIsBetter ? change < 0 : change > 0;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums',
        change === 0 && 'bg-muted text-muted-foreground',
        change !== 0 && improved && 'bg-success/12 text-success',
        change !== 0 && !improved && 'bg-destructive/12 text-destructive',
      )}
    >
      <TrendIcon change={change} />
      {change > 0 ? '+' : ''}
      {change}
      {unit}
    </span>
  );
};
