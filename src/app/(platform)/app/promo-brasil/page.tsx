import type { Metadata } from 'next';

import { BrazilView } from '@/components/miles/brazil-view';
import { LastUpdated } from '@/components/miles/last-updated';
import { PageHeader } from '@/components/platform/page-header';
import { getRadar, todayKey } from '@/data/radar';
import {
  toPriceData,
  type Achado,
  type Campanha,
  type Destaque,
  type Ideia,
} from '@/lib/miles/radar';
import { getUserData } from '@/server/queries/user-docs';

export const metadata: Metadata = { title: 'Promo Brasil' };

const byOrder = <T extends { ordem?: number }>(a: T, b: T) =>
  (a.ordem ?? 0) - (b.ordem ?? 0);

export default async function BrazilPage() {
  const radar = await getRadar();
  const user = await getUserData();
  return (
    <>
      <PageHeader
        eyebrow="Passagens pelo Brasil"
        title="Promo Brasil"
        description="Passagens promocionais com milhas saindo de Goiânia, Brasília e Campinas. Toque em Planejar para montar a rota completa."
        updatedAt={<LastUpdated entries={[{ label: 'Radar de promoções e alertas', at: radar.meta.ultimaVarredura }, { label: 'Busca ao vivo nos sites', at: radar.meta.aoVivo }]} />}
      />
      <BrazilView
        data={toPriceData(radar)}
        today={todayKey()}
        achados={radar.brasil.filter((item): item is Achado => item.tipo === 'achado')}
        highlights={radar.brasil
          .filter((item): item is Destaque => item.tipo === 'destaque')
          .sort(byOrder)}
        campaigns={radar.brasil
          .filter((item): item is Campanha => item.tipo === 'campanha')
          .sort(byOrder)}
        ideas={radar.brasil
          .filter((item): item is Ideia => item.tipo === 'ideia')
          .sort(byOrder)}
        stars={user.estrelas}
      />
    </>
  );
}
