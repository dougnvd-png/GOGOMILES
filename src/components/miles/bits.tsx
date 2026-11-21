import type { ReactNode } from 'react';
import { Plane } from 'lucide-react';

import { airlineOf, findAirlines, type Light } from '@/lib/miles/radar';
import { cn } from '@/lib/utils';

const badgeBase =
  'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold tracking-wide whitespace-nowrap';

/** Selo colorido de uma companhia aérea ou programa. Reconhece o nome dentro de textos como "LATAM Pass". */
export const AirlineBadge = ({ name }: { name: string | undefined }) => {
  const [match] = findAirlines(name);
  const label = match?.name ?? airlineOf(name);
  return (
    <span className={cn(badgeBase, match?.cls ?? 'bg-slate-600 text-white')}>
      <Plane className="size-3" aria-hidden />
      {label}
    </span>
  );
};

/**
 * Mostra um selo para cada companhia citada no texto (ex.: "LATAM e Azul").
 * Sem nenhuma companhia reconhecida, mostra o texto como está.
 */
export const AirlineBadges = ({ text }: { text: string | undefined }) => {
  const found = findAirlines(text);
  if (found.length === 0) {
    return <>{text}</>;
  }
  const extra = String(text ?? '').match(/\(([^)]*)\)/)?.[1];
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      {found.map((item) => (
        <span key={item.name} className={cn(badgeBase, item.cls)}>
          <Plane className="size-3" aria-hidden />
          {item.name}
        </span>
      ))}
      {extra && <span className="text-muted-foreground text-xs font-normal">({extra})</span>}
    </span>
  );
};

const lightStyles: Record<Light, string> = {
  ok: 'bg-success',
  warn: 'bg-warning',
  bad: 'bg-destructive',
};
const lightTextStyles: Record<Light, string> = {
  ok: 'text-success',
  warn: 'text-warning',
  bad: 'text-destructive',
};

export const LightDot = ({ value }: { value: Light }) => (
  <span aria-hidden className={cn('inline-block size-2.5 rounded-full', lightStyles[value])} />
);

export const lightTextClass = (value: Light) => lightTextStyles[value];

export const Tag = ({
  tone = 'muted',
  children,
}: {
  tone?: 'ok' | 'warn' | 'bad' | 'blue' | 'muted';
  children: ReactNode;
}) => (
  <span
    className={cn(
      'inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide whitespace-nowrap',
      tone === 'ok' && 'bg-success/15 text-success',
      tone === 'warn' && 'bg-warning/20 text-warning',
      tone === 'bad' && 'bg-destructive/15 text-destructive',
      tone === 'blue' && 'bg-brand-soft text-brand-ink',
      tone === 'muted' && 'bg-muted text-muted-foreground',
    )}
  >
    {children}
  </span>
);

export const ExternalLink = ({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={cn('text-brand-ink underline-offset-4 hover:underline', className)}
  >
    {children}
  </a>
);

/** Quadro de apoio dentro de um card: item de lista com borda. */
export const Plan = ({
  children,
  highlight,
  className,
}: {
  children: ReactNode;
  highlight?: boolean;
  className?: string;
}) => (
  <div
    className={cn(
      'bg-muted/40 grid gap-1.5 rounded-xl border p-3',
      highlight && 'border-primary/60',
      className,
    )}
  >
    {children}
  </div>
);

export const shortMiles = (miles: number) =>
  miles >= 1000 ? `${(miles / 1000).toFixed(1).replace('.', ',')}k` : String(miles);
