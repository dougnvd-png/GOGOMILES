import Link from 'next/link';
import { Bell } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { getRadar, todayKey } from '@/data/radar';
import { formatNumber } from '@/lib/format';
import { describeEnd, openPromos, starStatuses } from '@/lib/miles/home';
import { cn } from '@/lib/utils';
import { getUserData } from '@/server/queries/user-docs';

const visibleLimit = 5;

/** Avisos do cabeçalho: destinos estrela na meta e bônus que acabam hoje ou amanhã. */
export const NotificationsMenu = async () => {
  const [radar, user] = await Promise.all([getRadar(), getUserData()]);
  const today = todayKey();
  const alerts = [
    ...starStatuses(radar, user.estrelas, today)
      .filter((entry) => entry.withinGoal && entry.best)
      .map((entry) => ({
        id: `star-${entry.star.key}`,
        title: `${entry.star.nome} na meta`,
        detail: `${formatNumber(entry.best?.price.milhas ?? 0)} milhas saindo de ${entry.best?.origin}`,
        urgent: false,
      })),
    ...openPromos(radar, today)
      .filter((entry) => entry.daysLeft !== null && entry.daysLeft <= 1)
      .map((entry) => ({
        id: entry.promo.id,
        title: `${entry.promo.de} → ${entry.promo.para}`,
        detail: `Até ${entry.promo.bonusMax ?? '?'}% de bônus, ${describeEnd(entry.daysLeft)}`,
        urgent: (entry.daysLeft ?? 1) <= 0,
      })),
  ];
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
              ? `Avisos: ${alerts.length} ${alerts.length === 1 ? 'item pede' : 'itens pedem'} atenção`
              : 'Avisos: nada urgente'
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
            Destinos estrela na meta e bônus que acabam hoje ou amanhã.
          </p>
        </div>
        {visible.length === 0 ? (
          <p className="text-muted-foreground px-4 py-6 text-center text-sm">
            Nada urgente no momento.
          </p>
        ) : (
          <ul className="grid gap-0.5 p-2">
            {visible.map((alert) => (
              <li key={alert.id} className="flex items-start gap-3 rounded-lg px-2 py-2">
                <span
                  aria-hidden
                  className={cn(
                    'mt-1.5 size-2 shrink-0 rounded-full',
                    alert.urgent ? 'bg-destructive' : 'bg-warning',
                  )}
                />
                <span className="grid min-w-0 gap-0.5">
                  <span className="truncate text-sm font-medium">{alert.title}</span>
                  <span className="text-muted-foreground text-xs">{alert.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="border-t p-2">
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href="/app">
              {alerts.length > visible.length
                ? `Ver os ${alerts.length} na visão geral`
                : 'Abrir a visão geral'}
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
