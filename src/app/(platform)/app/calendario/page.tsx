import type { Metadata } from 'next';

import { CalendarView } from '@/components/miles/calendar-view';
import { PageHeader } from '@/components/platform/page-header';
import { getRadar, todayKey } from '@/data/radar';
import { toPriceData } from '@/lib/miles/radar';
import { getUserData } from '@/server/queries/user-docs';

export const metadata: Metadata = { title: 'Calendário' };

const maxLength = 60;

export default async function CalendarPage({
  searchParams,
}: PageProps<'/app/calendario'>) {
  const [{ origem, destino }, user] = await Promise.all([searchParams, getUserData()]);
  const text = (value: string | string[] | undefined) =>
    typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
  return (
    <>
      <PageHeader
        eyebrow="Preços por dia"
        title="Calendário"
        description="Veja o menor valor em milhas de cada dia de uma rota, por programa."
      />
      <CalendarView
        data={toPriceData(getRadar())}
        today={todayKey()}
        watches={user.vigias}
        initialFrom={text(origem)}
        initialTo={text(destino)}
      />
    </>
  );
}
