import type { ChartConfig } from '@/components/ui/chart';

/** Cores dos gráficos. Vêm dos tokens do tema definidos em globals.css. */
export const chartColors = {
  primary: 'var(--chart-1)',
  accent: 'var(--chart-2)',
  tertiary: 'var(--chart-3)',
  open: 'var(--status-open)',
  progress: 'var(--status-progress)',
  done: 'var(--status-done)',
} as const;

export const singleSeriesConfig = (label: string): ChartConfig => ({
  value: { label, color: chartColors.primary },
});
