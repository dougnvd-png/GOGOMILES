export const timeZone = 'America/Sao_Paulo';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone,
});
const shortDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  timeZone,
});
const longDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone,
});
const dayKeyFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone,
});
const hourFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  hourCycle: 'h23',
  timeZone,
});
const numberFormatter = new Intl.NumberFormat('pt-BR');
const relativeFormatter = new Intl.RelativeTimeFormat('pt-BR', {
  numeric: 'auto',
});

const dayInMs = 24 * 60 * 60 * 1000;

const toDate = (value: string | Date) =>
  typeof value === 'string' ? new Date(value) : value;

/** Dia local no formato AAAA-MM-DD. */
export const dayKey = (value: string | Date) =>
  dayKeyFormatter.format(toDate(value));

const dayKeyToUtc = (key: string) => Date.parse(`${key}T12:00:00Z`);

export const shiftDayKey = (key: string, days: number) =>
  new Date(dayKeyToUtc(key) + days * dayInMs).toISOString().slice(0, 10);

export const daysBetween = (fromKey: string, toKey: string) =>
  Math.round((dayKeyToUtc(toKey) - dayKeyToUtc(fromKey)) / dayInMs);

export const localHour = (value: string | Date) =>
  Number(hourFormatter.format(toDate(value)));

export const formatDate = (value: string | Date) =>
  dateFormatter.format(toDate(value));

export const formatDayKey = (key: string) =>
  shortDateFormatter.format(new Date(dayKeyToUtc(key))).replace('.', '');

export const formatLongDate = (value: string | Date) =>
  longDateFormatter.format(toDate(value));

export const formatNumber = (value: number) => numberFormatter.format(value);

export const formatRelativeDays = (days: number) =>
  relativeFormatter.format(days, 'day');

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone,
});

/** Data e hora no fuso de São Paulo, como 21/11/2026 09:55. Texto AAAA-MM-DD vira só a data. */
export const formatDateTime = (value: string | Date) => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return formatDate(`${value}T12:00:00Z`);
  }
  return dateTimeFormatter.format(toDate(value)).replace(',', '');
};

/** Verdadeiro quando o texto é só uma data, sem hora registrada. */
export const isDateOnly = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);
