import type { CSSProperties } from 'react';
import {
  CalendarDays,
  Flag,
  LayoutDashboard,
  Megaphone,
  Plane,
  TrendingUp,
} from 'lucide-react';

import { MetricCard } from '@/components/dashboard/metric-card';
import { AirlineBadge } from '@/components/miles/bits';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { appConfig } from '@/config/app';
import { getRadar } from '@/data/radar';
import { formatNumber } from '@/lib/format';
import { cheapestFrom, homeOrigins, openCampaigns, openPromos } from '@/lib/miles/home';
import { brDate, cityName } from '@/lib/miles/radar';

// Sem desfoque nos cards internos: desfoque aninhado em um elemento inclinado
// falha em alguns navegadores.
const previewStyle = { '--surface-blur': 'none' } as CSSProperties;

const railIcons = [
  { name: 'overview', icon: LayoutDashboard },
  { name: 'brasil', icon: Flag },
  { name: 'calendario', icon: CalendarDays },
];

const shortCity = (code: string) => cityName(code).replace(/ \([A-Z]{3}\)$/, '');

/**
 * Prévia do painel na página inicial, com os dados do radar na data da última
 * varredura. Usa os mesmos componentes da área logada.
 */
export const DashboardPreview = () => {
  const radar = getRadar();
  const day = (radar.meta.ultimaVarredura ?? new Date().toISOString()).slice(0, 10);
  const cheapest = cheapestFrom(radar, homeOrigins, day, 4);
  const promos = openPromos(radar, day);
  const campaigns = openCampaigns(radar, day);

  return (
    <div
      aria-hidden
      inert
      style={previewStyle}
      className="relative mx-auto mt-14 w-full max-w-6xl [perspective:2400px] sm:mt-20"
    >
      <div className="brand-surface glow-pulse absolute inset-x-[12%] -top-10 -z-10 h-64 rounded-full opacity-35 blur-[110px]" />
      <div className="surface preview-tilt overflow-hidden rounded-3xl p-2">
        <div className="flex items-center gap-2 px-3 pt-1 pb-3">
          <span className="bg-foreground/15 size-2.5 rounded-full" />
          <span className="bg-foreground/15 size-2.5 rounded-full" />
          <span className="bg-foreground/15 size-2.5 rounded-full" />
          <span className="text-muted-foreground ml-2 truncate text-xs">{appConfig.name}</span>
        </div>
        <div className="bg-background/60 flex gap-3 rounded-2xl border p-3 text-left sm:p-4">
          <div className="hidden w-12 shrink-0 flex-col items-center gap-2 pt-1 md:flex">
            {railIcons.map(({ name, icon: Icon }, index) => (
              <span
                key={name}
                className={
                  index === 0
                    ? 'brand-surface brand-glow grid size-9 place-items-center rounded-xl'
                    : 'text-muted-foreground grid size-9 place-items-center rounded-xl'
                }
              >
                <Icon className="size-4" />
              </span>
            ))}
          </div>
          <div className="grid min-w-0 flex-1 gap-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <MetricCard
                label="Menor preço visto"
                value={cheapest[0] ? formatNumber(cheapest[0].price.milhas) : '—'}
                icon={Plane}
                detail="milhas, saindo de casa"
              />
              <MetricCard
                label="Bônus de transferência"
                value={formatNumber(promos.length)}
                icon={TrendingUp}
                detail="ativos na última varredura"
              />
              <div className="hidden sm:block">
                <MetricCard
                  label="Campanhas no ar"
                  value={formatNumber(campaigns.length)}
                  icon={Megaphone}
                  detail="das companhias e programas"
                />
              </div>
            </div>
            <Card className="gap-3">
              <CardHeader>
                <CardTitle>Menores preços saindo de Goiânia e Brasília</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                {cheapest.map((best) => (
                  <div
                    key={best.destination}
                    className="bg-muted/40 flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3 py-2 text-sm"
                  >
                    <span className="font-medium">
                      {shortCity(best.origin)} → {shortCity(best.destination)}
                    </span>
                    <span className="flex items-center gap-2">
                      <AirlineBadge name={best.price.prog} />
                      <strong className="tabular-nums">
                        {formatNumber(best.price.milhas)} milhas
                      </strong>
                      <span className="text-muted-foreground hidden text-xs sm:inline">
                        {brDate(best.day)}
                      </span>
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="from-background pointer-events-none absolute inset-x-0 -bottom-2 h-2/5 bg-gradient-to-t to-transparent" />
    </div>
  );
};
