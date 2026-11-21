import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'start' | 'center';
}

export const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: SectionHeadingProps) => (
  <div
    data-reveal
    className={cn(
      'grid max-w-2xl gap-4',
      align === 'center' && 'mx-auto justify-items-center text-center',
    )}
  >
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    <h2 className="text-3xl leading-[1.1] font-semibold text-balance sm:text-4xl lg:text-[2.75rem]">
      {title}
    </h2>
    {subtitle && (
      <p className="text-muted-foreground text-lg text-pretty">{subtitle}</p>
    )}
  </div>
);
