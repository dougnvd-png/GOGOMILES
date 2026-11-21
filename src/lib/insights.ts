import {
  dayKey,
  daysBetween,
  formatDayKey,
  localHour,
  shiftDayKey,
} from '@/lib/format';
import {
  offerPrograms,
  offerStatusLabels,
  offerStatuses,
  type Offer,
  type OfferStatus,
} from '@/lib/offers';

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
  /** Média de dias entre cadastrar e emitir. null quando nada foi emitido no período. */
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
  status: OfferStatus;
  label: string;
  count: number;
  share: number;
}

export interface ProgramBar {
  program: string;
  count: number;
}

export interface WeekdayBar {
  weekday: string;
  count: number;
}

export interface Deadline {
  offer: Offer;
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

const createdWithin = (offers: Offer[], now: Date, from: number, to: number) =>
  offers.filter((offer) => isWithin(offer.createdAt, now, from, to));

const completedWithin = (offers: Offer[], now: Date, from: number, to: number) =>
  offers.filter(
    (offer) =>
      offer.issuedAt !== null && isWithin(offer.issuedAt, now, from, to),
  );

const averageDaysToFinish = (completed: Offer[]) => {
  if (completed.length === 0) {
    return null;
  }
  const total = completed.reduce(
    (sum, offer) =>
      sum +
      (Date.parse(offer.issuedAt ?? offer.createdAt) -
        Date.parse(offer.createdAt)) /
        dayInMs,
    0,
  );
  return Math.round((total / completed.length) * 10) / 10;
};

const totalsFor = (
  offers: Offer[],
  now: Date,
  from: number,
  to: number,
): PeriodTotals => {
  const completed = completedWithin(offers, now, from, to);
  return {
    created: createdWithin(offers, now, from, to).length,
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
  offers: Offer[],
  days: PeriodDays,
  now: Date,
): DailyPoint[] => {
  const today = dayKey(now);
  const points = new Map<string, DailyPoint>();
  for (let age = days - 1; age >= 0; age -= 1) {
    const day = shiftDayKey(today, -age);
    points.set(day, { day, label: formatDayKey(day), created: 0, done: 0 });
  }
  for (const offer of offers) {
    const createdPoint = points.get(dayKey(offer.createdAt));
    if (createdPoint) {
      createdPoint.created += 1;
    }
    const donePoint = offer.issuedAt
      ? points.get(dayKey(offer.issuedAt))
      : undefined;
    if (donePoint) {
      donePoint.done += 1;
    }
  }
  return [...points.values()];
};

export const summarizePeriod = (
  offers: Offer[],
  days: PeriodDays,
  now: Date,
): PeriodSummary => {
  const current = totalsFor(offers, now, 0, days - 1);
  const previous = totalsFor(offers, now, days, days * 2 - 1);
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

export const statusBreakdown = (offers: Offer[]): StatusSlice[] =>
  offerStatuses.map((status) => {
    const count = offers.filter((offer) => offer.status === status).length;
    return {
      status,
      label: offerStatusLabels[status],
      count,
      share: percent(count, offers.length),
    };
  });

export const weekdayBreakdown = (
  offers: Offer[],
  days: PeriodDays,
  now: Date,
): WeekdayBar[] => {
  const counts = weekdayLabels.map(() => 0);
  for (const offer of createdWithin(offers, now, 0, days - 1)) {
    const weekday = new Date(`${dayKey(offer.createdAt)}T12:00:00Z`).getUTCDay();
    counts[weekday] += 1;
  }
  const mondayFirst = [1, 2, 3, 4, 5, 6, 0];
  return mondayFirst.map((weekday) => ({
    weekday: weekdayLabels[weekday],
    count: counts[weekday],
  }));
};

export const programBreakdown = (
  offers: Offer[],
  days: PeriodDays,
  now: Date,
): ProgramBar[] =>
  offerPrograms.map((program) => ({
    program,
    count: createdWithin(offers, now, 0, days - 1).filter(
      (offer) => offer.program === program,
    ).length,
  }));

export const pendingOffers = (offers: Offer[]) =>
  offers.filter((offer) => offer.status !== 'done');

export const upcomingDeadlines = (
  offers: Offer[],
  now: Date,
  limit: number,
): Deadline[] => {
  const today = dayKey(now);
  return pendingOffers(offers)
    .flatMap((offer) =>
      offer.departDate
        ? [{ offer, daysLeft: daysBetween(today, offer.departDate) }]
        : [],
    )
    .sort((first, second) => first.daysLeft - second.daysLeft)
    .slice(0, limit);
};

export const overdueCount = (offers: Offer[], now: Date) => {
  const today = dayKey(now);
  return pendingOffers(offers).filter(
    (offer) => offer.departDate !== null && offer.departDate < today,
  ).length;
};

export const describeDeadline = (daysLeft: number) => {
  if (daysLeft < -1) {
    return `Embarcou há ${-daysLeft} dias`;
  }
  if (daysLeft === -1) {
    return 'Embarcou ontem';
  }
  if (daysLeft === 0) {
    return 'Embarque hoje';
  }
  if (daysLeft === 1) {
    return 'Embarca amanhã';
  }
  return `Embarca em ${daysLeft} dias`;
};
