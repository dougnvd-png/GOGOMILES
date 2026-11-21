import { appConfig } from '@/config/app';
import { cn } from '@/lib/utils';

interface BrandMarkProps {
  className?: string;
  showName?: boolean;
}

export const BrandMark = ({ className, showName = true }: BrandMarkProps) => (
  <span
    className={cn(
      'flex items-center gap-2.5 font-semibold tracking-tight',
      className,
    )}
  >
    <span
      aria-hidden
      className="brand-surface brand-glow grid size-8 shrink-0 place-items-center rounded-[0.65rem] text-sm font-bold"
    >
      {appConfig.name.trim().charAt(0).toUpperCase()}
    </span>
    {showName && <span className="truncate">{appConfig.name}</span>}
  </span>
);
