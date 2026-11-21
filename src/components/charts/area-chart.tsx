'use client';

import { useId } from 'react';
import {
  Area,
  AreaChart as AreaChartRoot,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { cn } from '@/lib/utils';

export interface ChartSeries {
  /** Nome do campo em cada ponto de `data`. */
  key: string;
  label: string;
  color: string;
}

interface AreaChartProps {
  /** Cada ponto tem `label` (eixo horizontal) e um número por série. */
  data: ({ label: string } & Record<string, number | string>)[];
  series: ChartSeries[];
  className?: string;
}

export const AreaChart = ({ data, series, className }: AreaChartProps) => {
  const reducedMotion = useReducedMotion();
  const gradientId = useId();
  const tickInterval = Math.max(0, Math.ceil(data.length / 7) - 1);
  const config: ChartConfig = Object.fromEntries(
    series.map(({ key, label, color }) => [key, { label, color }]),
  );

  return (
    <ChartContainer
      config={config}
      className={cn('aspect-auto h-64 w-full', className)}
    >
      <AreaChartRoot
        data={data}
        margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
      >
        <defs>
          {series.map(({ key }) => (
            <linearGradient
              key={key}
              id={`${gradientId}-${key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor={`var(--color-${key})`}
                stopOpacity={0.4}
              />
              <stop
                offset="100%"
                stopColor={`var(--color-${key})`}
                stopOpacity={0}
              />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 6" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          interval={tickInterval}
        />
        <YAxis
          width={28}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          tickMargin={4}
        />
        <ChartTooltip
          cursor={{ strokeDasharray: '3 4' }}
          content={<ChartTooltipContent indicator="line" />}
        />
        {series.map(({ key }) => (
          <Area
            key={key}
            dataKey={key}
            type="monotone"
            isAnimationActive={!reducedMotion}
            animationDuration={1100}
            animationEasing="ease-out"
            stroke={`var(--color-${key})`}
            strokeWidth={2}
            fill={`url(#${gradientId}-${key})`}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        ))}
      </AreaChartRoot>
    </ChartContainer>
  );
};

export const ChartLegend = ({ series }: { series: ChartSeries[] }) => (
  <ul className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
    {series.map(({ key, label, color }) => (
      <li key={key} className="flex items-center gap-1.5">
        <span
          aria-hidden
          className="size-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        {label}
      </li>
    ))}
  </ul>
);
