'use client';

import { useId } from 'react';
import { Bar, BarChart as BarChartRoot, Cell, XAxis } from 'recharts';

import { singleSeriesConfig } from '@/components/charts/chart-theme';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { cn } from '@/lib/utils';

interface BarChartProps {
  data: { label: string; value: number }[];
  label: string;
  className?: string;
}

/** Barras verticais. A barra de maior valor fica em destaque. */
export const BarChart = ({ data, label, className }: BarChartProps) => {
  const reducedMotion = useReducedMotion();
  const gradientId = useId();
  const highest = Math.max(...data.map((point) => point.value));

  return (
    <ChartContainer
      config={singleSeriesConfig(label)}
      className={cn('aspect-auto h-44 w-full', className)}
    >
      <BarChartRoot data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-value)" stopOpacity={1} />
            <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0.35} />
          </linearGradient>
        </defs>
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
        <Bar
          dataKey="value"
          radius={[8, 8, 3, 3]}
          maxBarSize={36}
          isAnimationActive={!reducedMotion}
            animationDuration={1100}
            animationEasing="ease-out"
        >
          {data.map((point) => (
            <Cell
              key={point.label}
              fill={`url(#${gradientId})`}
              fillOpacity={point.value === highest && highest > 0 ? 1 : 0.5}
            />
          ))}
        </Bar>
      </BarChartRoot>
    </ChartContainer>
  );
};
