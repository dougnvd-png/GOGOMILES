'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  CalendarClock,
  CircleCheck,
  Timer,
  Inbox,
  ListChecks,
  Plus,
  Settings,
  Sparkles,
} from 'lucide-react';

import {
  AreaChart,
  ChartLegend,
  type ChartSeries,
} from '@/components/charts/area-chart';
import { BarChart } from '@/components/charts/bar-chart';
import { chartColors } from '@/components/charts/chart-theme';
import { DonutChart } from '@/components/charts/donut-chart';
import { Sparkline } from '@/components/charts/sparkline';
import { MetricCard } from '@/components/dashboard/metric-card';
import { Trend } from '@/components/dashboard/trend';
import { EmptyState } from '@/components/empty-state';
import { OfferStatusBadge } from '@/components/offers/offer-status-badge';
import { NewOfferDialog } from '@/components/offers/new-offer-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatLongDate, formatNumber } from '@/lib/format';
import {
  buildDailySeries,
  describeDeadline,
  greetingFor,
  overdueCount,
  pendingOffers,
  periodOptions,
  programBreakdown,
  statusBreakdown,
  summarizePeriod,
  upcomingDeadlines,
  type PeriodDays,
} from '@/lib/insights';
import {
  formatMiles,
  offerRoute,
  type Offer,
  type OfferStatus,
} from '@/lib/offers';
import { cn } from '@/lib/utils';

const statusColors: Record<OfferStatus, string> = {
  open: chartColors.open,
  in_progress: chartColors.progress,
  done: chartColors.done,
};

const flowSeries: ChartSeries[] = [
  { key: 'created', label: 'Cadastradas', color: chartColors.primary },
  { key: 'done', label: 'Emitidas', color: chartColors.done },
];

const formatDays = (days: number | null) => {
  if (days === null) {
    return 'Sem dados';
  }
  return `${days.toLocaleString('pt-BR')} ${days === 1 ? 'dia' : 'dias'}`;
};

const shortcuts = [
  {
    title: 'Ver todas as ofertas',
    description: 'Busque por rota, programa e cabine.',
    href: '/app/ofertas',
    icon: ListChecks,
  },
  {
    title: 'Conectar serviços',
    description: 'Login, banco de dados e e-mail.',
    href: '/app/configuracoes',
    icon: Settings,
  },
];

const describePending = (pending: number, overdue: number) => {
  if (pending === 0) {
    return 'Nenhuma oferta pendente no momento.';
  }
  const total = `${formatNumber(pending)} ${pending === 1 ? 'oferta pendente' : 'ofertas pendentes'}`;
  return overdue > 0
    ? `${total}, ${formatNumber(overdue)} com a data de embarque já passada.`
    : `${total}, nenhuma com a data de embarque já passada.`;
};

interface OverviewProps {
  offers: Offer[];
  /** Primeiro nome de quem está logado. Vazio no modo demonstração. */
  firstName: string;
  /** Momento da renderização no servidor, para o navegador calcular o mesmo resultado. */
  now: string;
}

export const Overview = ({ offers, firstName, now }: OverviewProps) => {
  const [period, setPeriod] = useState<PeriodDays>(30);
  const today = useMemo(() => new Date(now), [now]);

  const summary = useMemo(
    () => summarizePeriod(offers, period, today),
    [offers, period, today],
  );
  const series = useMemo(
    () => buildDailySeries(offers, period, today),
    [offers, period, today],
  );
  const programs = useMemo(
    () => programBreakdown(offers, period, today),
    [offers, period, today],
  );
  const breakdown = useMemo(() => statusBreakdown(offers), [offers]);
  const deadlines = useMemo(
    () => upcomingDeadlines(offers, today, 5),
    [offers, today],
  );
  const pending = pendingOffers(offers).length;
  const overdue = overdueCount(offers, today);
  const comparison = `vs. ${period} dias anteriores`;
  const flowRate = summary.current.created
    ? Math.min(100, (summary.current.done / summary.current.created) * 100)
    : 0;

  const handlePeriodChange = (value: string) => {
    setPeriod(Number(value) as PeriodDays);
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid gap-2">
          <p className="eyebrow">{formatLongDate(today)}</p>
          <h1 className="text-3xl font-semibold text-balance sm:text-4xl">
            {greetingFor(today)}
            {firstName && (
              <>
                , <span className="brand-text">{firstName}</span>
              </>
            )}
          </h1>
          <p className="text-muted-foreground text-pretty">
            {describePending(pending, overdue)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Tabs value={String(period)} onValueChange={handlePeriodChange}>
            <TabsList aria-label="Período dos números">
              {periodOptions.map((days) => (
                <TabsTrigger key={days} value={String(days)} className="px-3">
                  {days} dias
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <NewOfferDialog />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Ofertas cadastradas"
          value={formatNumber(summary.current.created)}
          icon={Sparkles}
          detail={
            <>
              <Trend change={summary.createdChange} />
              {summary.createdChange !== null && comparison}
            </>
          }
          visual={<Sparkline values={series.map((point) => point.created)} />}
        />
        <MetricCard
          label="Ofertas emitidas"
          value={formatNumber(summary.current.done)}
          icon={CircleCheck}
          detail={
            <>
              <Trend change={summary.doneChange} />
              {summary.doneChange !== null && comparison}
            </>
          }
          visual={
            <Sparkline
              values={series.map((point) => point.done)}
              className="text-status-done"
            />
          }
        />
        <MetricCard
          label="Tempo até emitir"
          value={formatDays(summary.current.averageDaysToFinish)}
          icon={Timer}
          detail={
            <>
              <Trend change={summary.averageDaysToFinishChange} lowerIsBetter />
              {summary.averageDaysToFinishChange !== null && comparison}
            </>
          }
          visual={
            <Progress
              value={flowRate}
              aria-label="Ofertas emitidas em relação às cadastradas no período"
              className="h-1.5"
            />
          }
        />
        <MetricCard
          label="Ofertas em aberto"
          value={formatNumber(pending)}
          icon={Inbox}
          detail={
            overdue > 0 ? (
              <span className="text-destructive font-medium">
                {formatNumber(overdue)} com embarque já passado
              </span>
            ) : (
              'Nenhum embarque passado'
            )
          }
          visual={
            <Progress
              value={offers.length ? (pending / offers.length) * 100 : 0}
              aria-label="Parte das ofertas que ainda está em aberto"
              className="h-1.5"
            />
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="gap-4 lg:col-span-8">
          <CardHeader>
            <CardTitle>Movimento</CardTitle>
            <CardDescription>
              Ofertas cadastradas e emitidas por dia, nos últimos {period} dias.
            </CardDescription>
            <CardAction>
              <ChartLegend series={flowSeries} />
            </CardAction>
          </CardHeader>
          <CardContent className="px-3 sm:px-4">
            <AreaChart
              series={flowSeries}
              data={series.map(({ label, created, done }) => ({
                label,
                created,
                done,
              }))}
            />
          </CardContent>
        </Card>

        <Card className="gap-4 lg:col-span-4">
          <CardHeader>
            <CardTitle>Situação</CardTitle>
            <CardDescription>Todas as ofertas, por situação.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <DonutChart
              slices={breakdown.map((slice) => ({
                key: slice.status,
                label: slice.label,
                value: slice.count,
                color: statusColors[slice.status],
              }))}
            >
              <p className="text-3xl leading-none font-semibold tabular-nums">
                {formatNumber(offers.length)}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">ofertas</p>
            </DonutChart>
            <ul className="grid gap-2 text-sm">
              {breakdown.map((slice) => (
                <li key={slice.status} className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="size-2 rounded-full"
                    style={{ backgroundColor: statusColors[slice.status] }}
                  />
                  {slice.label}
                  <span className="text-muted-foreground ml-auto tabular-nums">
                    {formatNumber(slice.count)} · {slice.share}%
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="gap-4 lg:col-span-4">
          <CardHeader>
            <CardTitle>Programas</CardTitle>
            <CardDescription>
              Ofertas cadastradas por programa de milhas no período.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4">
            <BarChart
              label="Ofertas cadastradas"
              data={programs.map((bar) => ({
                label: bar.program,
                value: bar.count,
              }))}
            />
          </CardContent>
        </Card>

        <Card className="gap-4 lg:col-span-4">
          <CardHeader>
            <CardTitle>Próximas viagens</CardTitle>
            <CardDescription>Ofertas em aberto, do embarque mais próximo.</CardDescription>
          </CardHeader>
          <CardContent>
            {deadlines.length === 0 ? (
              <EmptyState
                icon={CalendarClock}
                title="Nenhum embarque à vista"
                description="Ofertas com data de ida aparecem aqui até serem emitidas."
                className="py-4"
              />
            ) : (
              <ul className="grid gap-3">
                {deadlines.map(({ offer, daysLeft }) => (
                  <li key={offer.id} className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className={cn(
                        'grid size-9 shrink-0 place-items-center rounded-xl',
                        daysLeft < 0
                          ? 'bg-destructive/12 text-destructive'
                          : 'bg-brand-soft text-brand-ink',
                      )}
                    >
                      <CalendarClock className="size-4" />
                    </span>
                    <span className="grid min-w-0 gap-0.5">
                      <span className="truncate text-sm font-medium">
                        {offerRoute(offer)}
                      </span>
                      <span
                        className={cn(
                          'text-xs',
                          daysLeft < 0
                            ? 'text-destructive'
                            : 'text-muted-foreground',
                        )}
                      >
                        {describeDeadline(daysLeft)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="gap-4 lg:col-span-4">
          <CardHeader>
            <CardTitle>Últimas ofertas</CardTitle>
            <CardDescription>As ofertas cadastradas mais recentemente.</CardDescription>
            <CardAction>
              <Button asChild variant="ghost" size="sm" className="-mr-2">
                <Link href="/app/ofertas">
                  Ver todos
                  <ArrowUpRight />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {offers.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title="Nenhuma oferta ainda"
                description="Cadastre a primeira oferta para vê-la aqui."
                className="py-4"
              />
            ) : (
              <ul className="grid gap-3">
                {offers.slice(0, 5).map((offer) => (
                  <li
                    key={offer.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="grid min-w-0 gap-0.5">
                      <span className="truncate text-sm font-medium">
                        {offerRoute(offer)}
                      </span>
                      <span className="text-muted-foreground text-xs tabular-nums">
                        {offer.program} · {formatMiles(offer.miles)}
                      </span>
                    </span>
                    <OfferStatusBadge status={offer.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <section aria-label="Atalhos" className="grid gap-4 sm:grid-cols-3">
        <NewOfferDialog>
          <button
            type="button"
            className="surface surface-interactive focus-visible:ring-ring/50 flex items-center gap-4 p-4 text-left outline-none focus-visible:ring-[3px]"
          >
            <span
              aria-hidden
              className="brand-surface brand-glow grid size-10 shrink-0 place-items-center rounded-xl"
            >
              <Plus className="size-5" />
            </span>
            <span className="grid gap-0.5">
              <span className="text-sm font-medium">Nova oferta</span>
              <span className="text-muted-foreground text-xs">
                Guarde um voo em promoção.
              </span>
            </span>
          </button>
        </NewOfferDialog>
        {shortcuts.map(({ title, description, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="surface surface-interactive focus-visible:ring-ring/50 flex items-center gap-4 p-4 outline-none focus-visible:ring-[3px]"
          >
            <span
              aria-hidden
              className="bg-brand-soft text-brand-ink grid size-10 shrink-0 place-items-center rounded-xl"
            >
              <Icon className="size-5" />
            </span>
            <span className="grid gap-0.5">
              <span className="text-sm font-medium">{title}</span>
              <span className="text-muted-foreground text-xs">
                {description}
              </span>
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
};
