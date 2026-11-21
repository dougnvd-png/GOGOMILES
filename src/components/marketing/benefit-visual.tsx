import type { CSSProperties } from 'react';
import { Bell, Check, Lock, Search } from 'lucide-react';

import { Sparkline } from '@/components/charts/sparkline';
import type { BenefitVisual as BenefitVisualKind } from '@/config/landing';
import { cycleIndex } from '@/lib/motion';
import { cn } from '@/lib/utils';

const line = 'bg-foreground/20 h-2 rounded-full';
const tile = 'bg-card rounded-xl border shadow-surface';
const dimmed = { '--rest-opacity': 0.6 } as CSSProperties;

/** Três cadastros que vão sendo concluídos, um por vez. */
const ListVisual = () => (
  <div className="grid w-full max-w-64 gap-2">
    {['w-28', 'w-36', 'w-24'].map((width, index) => (
      <div key={width} className={cn(tile, 'flex items-center gap-3 p-2.5')}>
        <span className="relative grid size-5 shrink-0 place-items-center rounded-full border">
          <span
            style={cycleIndex(index)}
            className="brand-surface cycle motion-loop absolute -inset-px grid place-items-center rounded-full"
          >
            <Check className="size-3" strokeWidth={3} />
          </span>
        </span>
        <span className={cn(line, width)} />
        <span className="bg-brand-soft ml-auto h-4 w-12 rounded-full" />
      </div>
    ))}
  </div>
);

/** Uma busca sendo digitada e os resultados aparecendo. */
const SearchVisual = () => (
  <div className="grid w-full max-w-64 gap-2">
    <div className={cn(tile, 'flex items-center gap-2 rounded-full px-3 py-2')}>
      <Search className="text-muted-foreground size-4 shrink-0" />
      <span className={cn(line, 'type-in motion-loop w-20')} />
      <span className="bg-primary h-4 w-px animate-pulse" />
    </div>
    <div
      style={cycleIndex(0)}
      className={cn(
        tile,
        'result-in motion-loop border-primary/40 flex items-center gap-3 p-2.5',
      )}
    >
      <span className="bg-primary size-2 rounded-full" />
      <span className={cn(line, 'w-32')} />
    </div>
    <div
      style={{ ...cycleIndex(1), ...dimmed }}
      className={cn(
        tile,
        'result-in motion-loop flex items-center gap-3 p-2.5 opacity-60',
      )}
    >
      <span className="bg-foreground/25 size-2 rounded-full" />
      <span className={cn(line, 'w-24')} />
    </div>
  </div>
);

/** Um gráfico que se desenha. */
const ChartVisual = () => (
  <div className={cn(tile, 'grid w-full max-w-64 gap-2 p-3')}>
    <div className="flex items-center justify-between">
      <span className={cn(line, 'w-16')} />
      <span className="bg-success/15 h-4 w-10 rounded-full" />
    </div>
    <Sparkline
      values={[3, 4, 3, 6, 5, 8, 7, 9, 8, 12, 11, 14]}
      className="draw-loop motion-loop h-16"
    />
  </div>
);

/** Três contas, cada uma com o próprio acesso. O destaque passa de uma para outra. */
const AccessVisual = () => (
  <div className="flex w-full max-w-64 items-center justify-center gap-3">
    {['A', 'M', 'R'].map((initial, index) => (
      <div
        key={initial}
        className={cn(tile, 'grid flex-1 justify-items-center gap-2 p-3')}
      >
        <span className="bg-brand-soft text-brand-ink relative grid size-9 place-items-center rounded-full text-sm font-semibold">
          {initial}
          <span
            style={cycleIndex(index)}
            className={cn(
              'brand-surface brand-glow cycle-turn motion-loop absolute inset-0 grid place-items-center rounded-full',
              index !== 1 && 'opacity-0',
            )}
          >
            {initial}
          </span>
        </span>
        <Lock className="text-muted-foreground size-3.5" />
      </div>
    ))}
  </div>
);

/** Um aviso chegando, com o sino tocando. */
const AlertVisual = () => (
  <div className="grid w-full max-w-64 gap-2">
    <div className={cn(tile, 'slide-note motion-loop flex items-start gap-3 p-3')}>
      <span className="brand-surface brand-glow grid size-8 shrink-0 place-items-center rounded-lg">
        <Bell className="bell-ring motion-loop size-4" />
      </span>
      <div className="grid flex-1 gap-2 pt-1">
        <span className={cn(line, 'w-28')} />
        <span className={cn(line, 'w-20 opacity-60')} />
      </div>
    </div>
    <div className={cn(tile, 'mx-4 h-8 opacity-50')} />
  </div>
);

/** A mesma tela no computador e no celular. */
const DevicesVisual = () => (
  <div className="flex w-full max-w-64 items-end justify-center gap-3">
    <div className={cn(tile, 'grid h-24 flex-1 content-start gap-2 p-3')}>
      <span className={cn(line, 'w-12')} />
      <span className="bg-brand-soft h-8 rounded-lg" />
      <span className={cn(line, 'w-20 opacity-60')} />
    </div>
    <div
      className={cn(
        tile,
        'float-a motion-loop grid h-20 w-12 content-start gap-1.5 rounded-lg p-2',
      )}
    >
      <span className="bg-brand-soft h-6 rounded-md" />
      <span className={cn(line, 'h-1.5 w-6')} />
      <span className={cn(line, 'h-1.5 w-4 opacity-60')} />
    </div>
  </div>
);

const visuals: Record<BenefitVisualKind, () => React.JSX.Element> = {
  list: ListVisual,
  search: SearchVisual,
  chart: ChartVisual,
  access: AccessVisual,
  alert: AlertVisual,
  devices: DevicesVisual,
};

/** Mini ilustração animada de um benefício, desenhada com os tokens do tema. */
export const BenefitVisual = ({ kind }: { kind: BenefitVisualKind }) => {
  const Visual = visuals[kind];
  return (
    <div
      aria-hidden
      className="bg-muted/40 grid min-h-40 place-items-center overflow-hidden rounded-xl border p-5"
    >
      <Visual />
    </div>
  );
};
