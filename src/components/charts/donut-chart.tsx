'use client';

import type { ReactNode } from 'react';
import { Cell, Pie, PieChart } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { cn } from '@/lib/utils';

export interface DonutSlice {
  key: string;
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  slices: DonutSlice[];
  /** Conteúdo no centro da rosca, como o total. */
  children?: ReactNode;
  className?: string;
}

export const DonutChart = ({ slices, children, className }: DonutChartProps) => {
  const reducedMotion = useReducedMotion();
  const config: ChartConfig = Object.fromEntries(
    slices.map((slice) => [slice.key, { label: slice.label, color: slice.color }]),
  );
  const isEmpty = slices.every((slice) => slice.value === 0);

  return (
    <div className={cn('relative mx-auto aspect-square w-full max-w-52', className)}>
      <ChartContainer config={config} className="aspect-square w-full">
        <PieChart>
          {!isEmpty && (
            <ChartTooltip content={<ChartTooltipContent nameKey="key" hideLabel />} />
          )}
          <Pie
            data={isEmpty ? [{ key: 'empty', value: 1 }] : slices}
            dataKey="value"
            nameKey="key"
            innerRadius="72%"
            outerRadius="100%"
            paddingAngle={isEmpty ? 0 : 3}
            cornerRadius={6}
            strokeWidth={0}
            startAngle={90}
            endAngle={-270}
            isAnimationActive={!reducedMotion}
            animationDuration={1100}
            animationEasing="ease-out"
          >
            {isEmpty ? (
              <Cell fill="var(--muted)" />
            ) : (
              slices.map((slice) => <Cell key={slice.key} fill={slice.color} />)
            )}
          </Pie>
        </PieChart>
      </ChartContainer>
      {children && (
        <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
          {children}
        </div>
      )}
    </div>
  );
};
