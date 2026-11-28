import type { Metadata } from 'next';

import { CalendarView } from '@/components/miles/calendar-view';
import { LastUpdated } from '@/components/miles/last-updated';
import { PageHeader } from '@/components/platform/page-header';
import { getRadarLive, todayKey } from '@/data/radar';
import { toPriceData } from '@/lib/miles/radar';
import { getUserData } from '@/server/queries/user-docs';

export const metadata: Metadata = { title: 'Calendário' };

const maxLength = 60;

export default async function CalendarPage({
  searchParams,
}: PageProps<'/app/calendario'>) {
  const [{ origem, destino }, user] = await Promise.all([searchParams, getUserData()]);
  const radar = await getRadarLive();
  const text = (value: string | string[] | undefined) =>
    typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
  return (
    <>
      <PageHeader
        eyebrow="Preços por dia"
        title="Calendário"
        description="Veja o menor valor em milhas de cada dia de uma rota, por programa."
        updatedAt={<LastUpdated entries={[{ label: 'Radar de promoções e alertas', at: radar.meta.ultimaVarredura }, { label: 'Busca ao vivo nos sites', at: radar.meta.aoVivo }]} />}
      />
      <CalendarView
        key={`${text(origem)}-${text(destino)}`}
        data={toPriceData(radar)}
        today={todayKey()}
        watches={user.vigias}
        initialFrom={text(origem) || (text(destino) ? 'Goiânia (GYN)' : '')}
        initialTo={text(destino)}
      />
    </>
  );
}
