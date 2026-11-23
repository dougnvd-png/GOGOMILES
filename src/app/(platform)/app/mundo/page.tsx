import type { Metadata } from 'next';

import { WorldView } from '@/components/miles/world-view';
import { LastUpdated } from '@/components/miles/last-updated';
import { PageHeader } from '@/components/platform/page-header';
import { getRadarLive } from '@/data/radar';
import type { Destaque, Ideia, Parceira, VooMundo } from '@/lib/miles/radar';

export const metadata: Metadata = { title: 'Mundo' };

const byOrder = <T extends { ordem?: number }>(a: T, b: T) =>
  (a.ordem ?? 0) - (b.ordem ?? 0);

export default async function WorldPage() {
  const radar = await getRadarLive();
  const { mundo } = radar;
  return (
    <>
      <PageHeader
        eyebrow="Passagens internacionais"
        title="Mundo"
        description="América do Sul, Caribe, EUA, Europa e executiva. Valores por trecho, só ida, já com desconto de Clube ou Diamante quando houver."
        updatedAt={<LastUpdated entries={[{ label: 'Radar de promoções e alertas', at: radar.meta.ultimaVarredura }, { label: 'Busca ao vivo nos sites', at: radar.meta.aoVivo }]} />}
      />
      <WorldView
        flights={mundo.filter((item): item is VooMundo => item.tipo === 'voo')}
        highlights={mundo
          .filter((item): item is Destaque => item.tipo === 'destaque')
          .sort(byOrder)}
        partners={mundo
          .filter((item): item is Parceira => item.tipo === 'parceira')
          .sort(byOrder)}
        snow={mundo
          .filter((item): item is Ideia => item.tipo === 'neve')
          .sort(byOrder)}
        caribbean={mundo
          .filter((item): item is Ideia => item.tipo === 'caribe')
          .sort(byOrder)}
      />
    </>
  );
}
