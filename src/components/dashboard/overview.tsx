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
import { ItemStatusBadge } from '@/components/items/item-status-badge';
import { NewItemDialog } from '@/components/items/new-item-dialog';
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
import { formatDate, formatLongDate, formatNumber } from '@/lib/format';
import {
  buildDailySeries,
  describeDeadline,
  greetingFor,
  overdueCount,
  pendingItems,
  periodOptions,
  statusBreakdown,
  summarizePeriod,
  upcomingDeadlines,
  weekdayBreakdown,
  type PeriodDays,
} from '@/lib/insights';
import type { Item, ItemStatus } from '@/lib/items';
import { cn } from '@/lib/utils';

const statusColors: Record<ItemStatus, string> = {
  open: chartColors.open,
  in_progress: chartColors.progress,
  done: chartColors.done,
};

const flowSeries: ChartSeries[] = [
  { key: 'created', label: 'Criados', color: chartColors.primary },
  { key: 'done', label: 'Concluídos', color: chartColors.done },
];

const formatDays = (days: number | null) => {
  if (days === null) {
    return 'Sem dados';
  }
  return `${days.toLocaleString('pt-BR')} ${days === 1 ? 'dia' : 'dias'}`;
};

const shortcuts = [
  {
    title: 'Ver todos os itens',
    description: 'Busque, filtre e ordene a lista completa.',
    href: '/app/itens',
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
    return 'Nenhum item pendente no momento.';
  }
  const total = `${formatNumber(pending)} ${pending === 1 ? 'item pendente' : 'itens pendentes'}`;
  return overdue > 0
    ? `${total}, ${formatNumber(overdue)} com prazo vencido.`
    : `${total}, nenhum com prazo vencido.`;
};

interface OverviewProps {
  items: Item[];
  /** Primeiro nome de quem está logado. Vazio no modo demonstração. */
  firstName: string;
  /** Momento da renderização no servidor, para o navegador calcular o mesmo resultado. */
  now: string;
}

export const Overview = ({ items, firstName, now }: OverviewProps) => {
  const [period, setPeriod] = useState<PeriodDays>(30);
  const today = useMemo(() => new Date(now), [now]);

  const summary = useMemo(
    () => summarizePeriod(items, period, today),
    [items, period, today],
  );
  const series = useMemo(
    () => buildDailySeries(items, period, today),
    [items, period, today],
  );
  const weekdays = useMemo(
    () => weekdayBreakdown(items, period, today),
    [items, period, today],
  );
  const breakdown = useMemo(() => statusBreakdown(items), [items]);
  const deadlines = useMemo(
    () => upcomingDeadlines(items, today, 5),
    [items, today],
  );
  const pending = pendingItems(items).length;
  const overdue = overdueCount(items, today);
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
          <NewItemDialog />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Novos itens"
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
          label="Concluídos"
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
          label="Tempo médio para concluir"
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
              aria-label="Itens concluídos em relação aos criados no período"
              className="h-1.5"
            />
          }
        />
        <MetricCard
          label="Pendentes agora"
          value={formatNumber(pending)}
          icon={Inbox}
          detail={
            overdue > 0 ? (
              <span className="text-destructive font-medium">
                {formatNumber(overdue)} com prazo vencido
              </span>
            ) : (
              'Nenhum prazo vencido'
            )
          }
          visual={
            <Progress
              value={items.length ? (pending / items.length) * 100 : 0}
              aria-label="Parte dos itens que ainda está pendente"
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
              Itens criados e concluídos por dia, nos últimos {period} dias.
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
            <CardDescription>Todos os itens, por situação.</CardDescription>
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
                {formatNumber(items.length)}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">itens</p>
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
            <CardTitle>Dias mais movimentados</CardTitle>
            <CardDescription>
              Itens criados por dia da semana no período.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4">
            <BarChart
              label="Itens criados"
              data={weekdays.map((bar) => ({
                label: bar.weekday,
                value: bar.count,
              }))}
            />
          </CardContent>
        </Card>

        <Card className="gap-4 lg:col-span-4">
          <CardHeader>
            <CardTitle>Próximos prazos</CardTitle>
            <CardDescription>Itens pendentes, do mais urgente.</CardDescription>
          </CardHeader>
          <CardContent>
            {deadlines.length === 0 ? (
              <EmptyState
                icon={CalendarClock}
                title="Nenhum prazo pendente"
                description="Itens com prazo aparecem aqui até serem concluídos."
                className="py-4"
              />
            ) : (
              <ul className="grid gap-3">
                {deadlines.map(({ item, daysLeft }) => (
                  <li key={item.id} className="flex items-center gap-3">
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
                        {item.title}
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
            <CardTitle>Atividade recente</CardTitle>
            <CardDescription>Os últimos itens cadastrados.</CardDescription>
            <CardAction>
              <Button asChild variant="ghost" size="sm" className="-mr-2">
                <Link href="/app/itens">
                  Ver todos
                  <ArrowUpRight />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title="Nenhum item ainda"
                description="Crie o primeiro item para ver a atividade aqui."
                className="py-4"
              />
            ) : (
              <ul className="grid gap-3">
                {items.slice(0, 5).map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="grid min-w-0 gap-0.5">
                      <span className="truncate text-sm font-medium">
                        {item.title}
                      </span>
                      <span className="text-muted-foreground text-xs tabular-nums">
                        {item.category} · {formatDate(item.createdAt)}
                      </span>
                    </span>
                    <ItemStatusBadge status={item.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <section aria-label="Atalhos" className="grid gap-4 sm:grid-cols-3">
        <NewItemDialog>
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
              <span className="text-sm font-medium">Novo item</span>
              <span className="text-muted-foreground text-xs">
                Cadastre em poucos segundos.
              </span>
            </span>
          </button>
        </NewItemDialog>
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
