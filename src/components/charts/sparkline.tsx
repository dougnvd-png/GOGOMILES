import { useId } from 'react';

import { cn } from '@/lib/utils';

interface SparklineProps {
  values: number[];
  className?: string;
}

const width = 120;
const height = 36;
const inset = 3;

/** Mini gráfico de linha em SVG, sem eixos. Decorativo: o número fica ao lado. */
export const Sparkline = ({ values, className }: SparklineProps) => {
  const gradientId = useId();
  if (values.length < 2) {
    return null;
  }
  const highest = Math.max(...values, 1);
  const step = (width - inset * 2) / (values.length - 1);
  const points = values.map((value, index) => ({
    x: inset + index * step,
    y: height - inset - (value / highest) * (height - inset * 2),
  }));
  const line = points
    .map((point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }
      const previous = points[index - 1];
      const middle = (previous.x + point.x) / 2;
      return `C ${middle} ${previous.y}, ${middle} ${point.y}, ${point.x} ${point.y}`;
    })
    .join(' ');
  const last = points[points.length - 1];

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn('draw-in h-9 w-full overflow-visible text-primary', className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity={0.35} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path
        d={`${line} L ${last.x} ${height} L ${inset} ${height} Z`}
        fill={`url(#${gradientId})`}
      />
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};
