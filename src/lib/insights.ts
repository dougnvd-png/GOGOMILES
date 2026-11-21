import {
  dayKey,
  daysBetween,
  formatDayKey,
  localHour,
  shiftDayKey,
} from '@/lib/format';
import {
  itemStatusLabels,
  itemStatuses,
  type Item,
  type ItemStatus,
} from '@/lib/items';

export const periodOptions = [7, 30, 90] as const;
export type PeriodDays = (typeof periodOptions)[number];

export interface DailyPoint {
  day: string;
  label: string;
  created: number;
  done: number;
}

export interface PeriodTotals {
  created: number;
  done: number;
  /** Média de dias entre criar e concluir. null quando nada foi concluído no período. */
  averageDaysToFinish: number | null;
}

export interface PeriodSummary {
  current: PeriodTotals;
  previous: PeriodTotals;
  /** Variação em porcentagem, ou null quando não há período anterior para comparar. */
  createdChange: number | null;
  doneChange: number | null;
  averageDaysToFinishChange: number | null;
}

export interface StatusSlice {
  status: ItemStatus;
  label: string;
  count: number;
  share: number;
}

export interface WeekdayBar {
  weekday: string;
  count: number;
}

export interface Deadline {
  item: Item;
  /** Negativo quando o prazo já passou. */
  daysLeft: number;
}

const weekdayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const percent = (part: number, total: number) =>
  total === 0 ? 0 : Math.round((part / total) * 100);

const relativeChange = (current: number, previous: number) =>
  previous === 0 ? null : Math.round(((current - previous) / previous) * 100);

const dayInMs = 24 * 60 * 60 * 1000;

/** Verdadeiro quando o momento caiu entre `from` e `to` dias atrás (0 é hoje). */
const isWithin = (moment: string, now: Date, from: number, to: number) => {
  const age = daysBetween(dayKey(moment), dayKey(now));
  return age >= from && age <= to;
};

const createdWithin = (items: Item[], now: Date, from: number, to: number) =>
  items.filter((item) => isWithin(item.createdAt, now, from, to));

const completedWithin = (items: Item[], now: Date, from: number, to: number) =>
  items.filter(
    (item) =>
      item.completedAt !== null && isWithin(item.completedAt, now, from, to),
  );

const averageDaysToFinish = (completed: Item[]) => {
  if (completed.length === 0) {
    return null;
  }
  const total = completed.reduce(
    (sum, item) =>
      sum +
      (Date.parse(item.completedAt ?? item.createdAt) -
        Date.parse(item.createdAt)) /
        dayInMs,
    0,
  );
  return Math.round((total / completed.length) * 10) / 10;
};

const totalsFor = (
  items: Item[],
  now: Date,
  from: number,
  to: number,
): PeriodTotals => {
  const completed = completedWithin(items, now, from, to);
  return {
    created: createdWithin(items, now, from, to).length,
    done: completed.length,
    averageDaysToFinish: averageDaysToFinish(completed),
  };
};

export const greetingFor = (now: Date) => {
  const hour = localHour(now);
  if (hour < 12) {
    return 'Bom dia';
  }
  return hour < 18 ? 'Boa tarde' : 'Boa noite';
};

export const buildDailySeries = (
  items: Item[],
  days: PeriodDays,
  now: Date,
): DailyPoint[] => {
  const today = dayKey(now);
  const points = new Map<string, DailyPoint>();
  for (let age = days - 1; age >= 0; age -= 1) {
    const day = shiftDayKey(today, -age);
    points.set(day, { day, label: formatDayKey(day), created: 0, done: 0 });
  }
  for (const item of items) {
    const createdPoint = points.get(dayKey(item.createdAt));
    if (createdPoint) {
      createdPoint.created += 1;
    }
    const donePoint = item.completedAt
      ? points.get(dayKey(item.completedAt))
      : undefined;
    if (donePoint) {
      donePoint.done += 1;
    }
  }
  return [...points.values()];
};

export const summarizePeriod = (
  items: Item[],
  days: PeriodDays,
  now: Date,
): PeriodSummary => {
  const current = totalsFor(items, now, 0, days - 1);
  const previous = totalsFor(items, now, days, days * 2 - 1);
  return {
    current,
    previous,
    createdChange: relativeChange(current.created, previous.created),
    doneChange: relativeChange(current.done, previous.done),
    averageDaysToFinishChange:
      current.averageDaysToFinish === null ||
      previous.averageDaysToFinish === null
        ? null
        : relativeChange(
            current.averageDaysToFinish,
            previous.averageDaysToFinish,
          ),
  };
};

export const statusBreakdown = (items: Item[]): StatusSlice[] =>
  itemStatuses.map((status) => {
    const count = items.filter((item) => item.status === status).length;
    return {
      status,
      label: itemStatusLabels[status],
      count,
      share: percent(count, items.length),
    };
  });

export const weekdayBreakdown = (
  items: Item[],
  days: PeriodDays,
  now: Date,
): WeekdayBar[] => {
  const counts = weekdayLabels.map(() => 0);
  for (const item of createdWithin(items, now, 0, days - 1)) {
    const weekday = new Date(`${dayKey(item.createdAt)}T12:00:00Z`).getUTCDay();
    counts[weekday] += 1;
  }
  const mondayFirst = [1, 2, 3, 4, 5, 6, 0];
  return mondayFirst.map((weekday) => ({
    weekday: weekdayLabels[weekday],
    count: counts[weekday],
  }));
};

export const pendingItems = (items: Item[]) =>
  items.filter((item) => item.status !== 'done');

export const upcomingDeadlines = (
  items: Item[],
  now: Date,
  limit: number,
): Deadline[] => {
  const today = dayKey(now);
  return pendingItems(items)
    .flatMap((item) =>
      item.dueDate
        ? [{ item, daysLeft: daysBetween(today, item.dueDate) }]
        : [],
    )
    .sort((first, second) => first.daysLeft - second.daysLeft)
    .slice(0, limit);
};

export const overdueCount = (items: Item[], now: Date) => {
  const today = dayKey(now);
  return pendingItems(items).filter(
    (item) => item.dueDate !== null && item.dueDate < today,
  ).length;
};

export const describeDeadline = (daysLeft: number) => {
  if (daysLeft < -1) {
    return `Venceu há ${-daysLeft} dias`;
  }
  if (daysLeft === -1) {
    return 'Venceu ontem';
  }
  if (daysLeft === 0) {
    return 'Vence hoje';
  }
  if (daysLeft === 1) {
    return 'Vence amanhã';
  }
  return `Vence em ${daysLeft} dias`;
};
