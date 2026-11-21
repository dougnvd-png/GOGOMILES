import type { CSSProperties } from 'react';
import {
  CircleCheck,
  Timer,
  LayoutDashboard,
  ListChecks,
  Settings,
  Sparkles,
} from 'lucide-react';

import { AreaChart, type ChartSeries } from '@/components/charts/area-chart';
import { chartColors } from '@/components/charts/chart-theme';
import { DonutChart } from '@/components/charts/donut-chart';
import { Sparkline } from '@/components/charts/sparkline';
import { MetricCard } from '@/components/dashboard/metric-card';
import { Trend } from '@/components/dashboard/trend';
import { ItemStatusBadge } from '@/components/items/item-status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { appConfig } from '@/config/app';
import { formatNumber } from '@/lib/format';
import {
  buildDailySeries,
  statusBreakdown,
  summarizePeriod,
} from '@/lib/insights';
import { createSampleItems, sampleReferenceDate } from '@/lib/sample-items';

const previewPeriod = 30;
const flowSeries: ChartSeries[] = [
  { key: 'created', label: 'Criados', color: chartColors.primary },
  { key: 'done', label: 'Concluídos', color: chartColors.done },
];
// Sem desfoque nos cards internos: desfoque aninhado em um elemento inclinado
// falha em alguns navegadores.
const previewStyle = { '--surface-blur': 'none' } as CSSProperties;
// Os cartões flutuantes ficam sobre o painel, então usam um fundo quase opaco.
const floatingStyle = { backgroundColor: 'var(--popover)' } as CSSProperties;

const railIcons = [
  { name: 'overview', icon: LayoutDashboard },
  { name: 'items', icon: ListChecks },
  { name: 'settings', icon: Settings },
];

/**
 * Prévia do painel na página inicial. Usa os mesmos componentes da área logada
 * com os itens de exemplo, então acompanha qualquer mudança visual do painel.
 */
export const DashboardPreview = () => {
  const items = createSampleItems(sampleReferenceDate);
  const summary = summarizePeriod(items, previewPeriod, sampleReferenceDate);
  const series = buildDailySeries(items, previewPeriod, sampleReferenceDate);
  const breakdown = statusBreakdown(items);
  const latestDone = items.find((item) => item.status === 'done') ?? items[0];
  const colors = {
    open: chartColors.open,
    in_progress: chartColors.progress,
    done: chartColors.done,
  };

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
          <span className="text-muted-foreground ml-2 truncate text-xs">
            {appConfig.name}
          </span>
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
                label="Novos itens"
                value={formatNumber(summary.current.created)}
                icon={Sparkles}
                detail={<Trend change={summary.createdChange} />}
                visual={
                  <Sparkline values={series.map((point) => point.created)} />
                }
              />
              <MetricCard
                label="Concluídos"
                value={formatNumber(summary.current.done)}
                icon={CircleCheck}
                detail={<Trend change={summary.doneChange} />}
                visual={
                  <Sparkline
                    values={series.map((point) => point.done)}
                    className="text-status-done"
                  />
                }
              />
              <div className="hidden sm:block">
                <MetricCard
                  label="Tempo médio para concluir"
                  value={`${(summary.current.averageDaysToFinish ?? 0).toLocaleString('pt-BR')} dias`}
                  icon={Timer}
                  detail={
                    <Trend
                      change={summary.averageDaysToFinishChange}
                      lowerIsBetter
                    />
                  }
                  visual={
                    <Sparkline
                      values={series.map((point) => point.created + point.done)}
                      className="text-chart-2"
                    />
                  }
                />
              </div>
            </div>
            <div className="grid gap-3 lg:grid-cols-12">
              <Card className="gap-3 lg:col-span-8">
                <CardHeader>
                  <CardTitle>Movimento</CardTitle>
                </CardHeader>
                <CardContent className="px-3">
                  <AreaChart
                    className="h-52"
                    series={flowSeries}
                    data={series.map(({ label, created, done }) => ({
                      label,
                      created,
                      done,
                    }))}
                  />
                </CardContent>
              </Card>
              <Card className="hidden gap-3 lg:col-span-4 lg:flex">
                <CardHeader>
                  <CardTitle>Situação</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <DonutChart
                    className="max-w-36"
                    slices={breakdown.map((slice) => ({
                      key: slice.status,
                      label: slice.label,
                      value: slice.count,
                      color: colors[slice.status],
                    }))}
                  >
                    <p className="text-2xl leading-none font-semibold tabular-nums">
                      {formatNumber(items.length)}
                    </p>
                  </DonutChart>
                  <ul className="grid gap-2">
                    {items.slice(0, 2).map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between gap-2"
                      >
                        <span className="truncate text-xs font-medium">
                          {item.title}
                        </span>
                        <ItemStatusBadge status={item.status} />
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <div
        style={floatingStyle}
        className="surface float-a absolute -top-9 left-10 z-10 hidden items-center gap-3 rounded-2xl p-3 pr-4 lg:flex"
      >
        <span className="brand-surface brand-glow grid size-9 shrink-0 place-items-center rounded-xl">
          <CircleCheck className="size-4" />
        </span>
        <div className="grid gap-0.5 text-left">
          <p className="max-w-40 truncate text-xs font-medium">
            {latestDone.title}
          </p>
          <p className="text-muted-foreground text-xs">Concluído agora</p>
        </div>
      </div>
      <div
        style={floatingStyle}
        className="surface float-b absolute top-44 -right-10 z-10 hidden items-center gap-2.5 rounded-2xl p-3 pr-4 xl:flex"
      >
        <Trend change={summary.doneChange} />
        <p className="text-xs font-medium">Concluídos no período</p>
      </div>
      <div className="from-background pointer-events-none absolute inset-x-0 -bottom-2 h-2/5 bg-gradient-to-t to-transparent" />
    </div>
  );
};
