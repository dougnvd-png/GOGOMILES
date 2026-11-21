import { Clock } from 'lucide-react';

import { formatDateTime, isDateOnly } from '@/lib/format';

export interface UpdateEntry {
  label: string;
  /** Momento ISO ou data AAAA-MM-DD. Vazio quando a informação ainda não foi registrada. */
  at: string | null | undefined;
}

/** Linha com a data e a hora da última atualização de cada informação da tela. */
export const LastUpdated = ({ entries }: { entries: UpdateEntry[] }) => (
  <p className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
    <Clock className="size-3.5" aria-hidden />
    {entries.map((entry) => (
      <span key={entry.label}>
        {entry.label}:{' '}
        <time
          dateTime={entry.at ?? undefined}
          className="text-foreground font-medium tabular-nums"
        >
          {entry.at ? formatDateTime(entry.at) : 'ainda sem registro'}
        </time>
        {entry.at && isDateOnly(entry.at) && ' (hora não registrada)'}
      </span>
    ))}
  </p>
);
