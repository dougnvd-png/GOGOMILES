import Link from 'next/link';
import { Bell } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { describeDeadline, upcomingDeadlines } from '@/lib/insights';
import { cn } from '@/lib/utils';
import { listItems } from '@/server/queries/items';

const warningWindowDays = 3;
const visibleLimit = 5;

/** Avisos do cabeçalho: itens pendentes com prazo vencido ou perto de vencer. */
export const NotificationsMenu = async () => {
  const items = await listItems();
  const alerts = upcomingDeadlines(items, new Date(), items.length).filter(
    ({ daysLeft }) => daysLeft <= warningWindowDays,
  );
  const visible = alerts.slice(0, visibleLimit);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={
            alerts.length > 0
              ? `Avisos: ${alerts.length} prazos pedem atenção`
              : 'Avisos: nenhum prazo próximo'
          }
        >
          <Bell />
          {alerts.length > 0 && (
            <span
              aria-hidden
              className="bg-primary ring-background absolute top-2 right-2 size-2 rounded-full ring-2"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b px-4 py-3">
          <p className="text-sm font-semibold">Avisos</p>
          <p className="text-muted-foreground text-xs">
            Prazos vencidos ou que vencem em até {warningWindowDays} dias.
          </p>
        </div>
        {visible.length === 0 ? (
          <p className="text-muted-foreground px-4 py-6 text-center text-sm">
            Nenhum prazo próximo. Tudo em dia.
          </p>
        ) : (
          <ul className="grid gap-0.5 p-2">
            {visible.map(({ item, daysLeft }) => (
              <li
                key={item.id}
                className="flex items-start gap-3 rounded-lg px-2 py-2"
              >
                <span
                  aria-hidden
                  className={cn(
                    'mt-1.5 size-2 shrink-0 rounded-full',
                    daysLeft < 0 ? 'bg-destructive' : 'bg-warning',
                  )}
                />
                <span className="grid min-w-0 gap-0.5">
                  <span className="truncate text-sm font-medium">
                    {item.title}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {describeDeadline(daysLeft)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="border-t p-2">
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href="/app/itens">
              {alerts.length > visible.length
                ? `Ver os ${alerts.length} na lista de itens`
                : 'Abrir a lista de itens'}
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
