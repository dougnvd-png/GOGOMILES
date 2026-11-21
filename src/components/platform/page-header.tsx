import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: ReactNode;
  /** Rótulo pequeno acima do título. */
  eyebrow?: string;
  description?: ReactNode;
  actions?: ReactNode;
  /** Data e hora da última atualização das informações da tela. */
  updatedAt?: ReactNode;
}

export const PageHeader = ({
  title,
  eyebrow,
  description,
  actions,
  updatedAt,
}: PageHeaderProps) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="grid gap-2">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="text-3xl font-semibold text-balance sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="text-muted-foreground max-w-2xl text-pretty">
          {description}
        </p>
      )}
      {updatedAt}
    </div>
    {actions && (
      <div className="flex flex-wrap items-center gap-2">{actions}</div>
    )}
  </div>
);
