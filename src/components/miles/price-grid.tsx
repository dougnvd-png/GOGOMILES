'use client';

import { cn } from '@/lib/utils';
import { shortMiles } from '@/components/miles/bits';
import type { Light } from '@/lib/miles/radar';

export interface GridCell {
  miles: number;
  light: Light;
}

interface PriceGridProps {
  /** Mês no formato AAAA-MM. */
  month: string;
  cells: Record<string, GridCell>;
  today: string;
  selected: string | null;
  onSelect: (day: string) => void;
}

const lightText: Record<Light, string> = {
  ok: 'text-success font-bold',
  warn: 'text-warning',
  bad: 'text-destructive',
};

/** Um mês em grade, com o menor preço de cada dia e a cor da régua de viabilidade. */
export const PriceGrid = ({ month, cells, today, selected, onSelect }: PriceGridProps) => {
  const first = new Date(`${month}-01T12:00:00`);
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const title = first.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="grid gap-2">
      <h3 className="text-center text-sm font-semibold capitalize">{title}</h3>
      <div className="grid grid-cols-7 gap-1">
        {'DSTQQSS'.split('').map((weekday, index) => (
          <div key={index} className="text-muted-foreground py-1 text-center text-[11px]">
            {weekday}
          </div>
        ))}
        {Array.from({ length: first.getDay() }, (_, index) => (
          <div key={`blank-${index}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const number = index + 1;
          const day = `${month}-${String(number).padStart(2, '0')}`;
          const cell = cells[day];
          const past = day < today;
          return (
            <button
              key={day}
              type="button"
              disabled={past || (!cell && false)}
              onClick={() => {
                onSelect(day);
              }}
              aria-pressed={day === selected}
              aria-label={
                cell
                  ? `${number}, menor preço ${cell.miles} milhas`
                  : `${number}, sem preço registrado`
              }
              className={cn(
                'focus-visible:ring-ring/50 min-h-11 rounded-lg border border-transparent px-0.5 py-1 text-center outline-none focus-visible:ring-[3px]',
                !past && 'hover:border-border',
                past && 'opacity-30',
                day === selected && 'border-primary bg-brand-soft',
              )}
            >
              <div className="text-sm font-bold">{number}</div>
              <div
                className={cn(
                  'text-[11px] tabular-nums',
                  cell ? lightText[cell.light] : 'text-muted-foreground',
                )}
              >
                {cell ? shortMiles(cell.miles) : '·'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
