import type { Metadata } from 'next';

import { Planner } from '@/components/miles/planner';
import { LastUpdated } from '@/components/miles/last-updated';
import { PageHeader } from '@/components/platform/page-header';
import { getRadarLive, todayKey } from '@/data/radar';
import { isPlannerConfigured } from '@/lib/env';
import { planRequestSchema, type PlanResult } from '@/lib/miles/plan';
import { toPriceData } from '@/lib/miles/radar';
import { getUserData } from '@/server/queries/user-docs';

export const metadata: Metadata = { title: 'Planejar viagem' };

const maxLength = 60;

export default async function PlanPage({ searchParams }: PageProps<'/app/planejar'>) {
  const [{ origem, destino, plano }, user] = await Promise.all([
    searchParams,
    getUserData(),
  ]);
  const radar = await getRadarLive();
  const text = (value: string | string[] | undefined) =>
    typeof value === 'string' ? value.trim().slice(0, maxLength) : '';

  let saved: { request: ReturnType<typeof planRequestSchema.parse>; plan: PlanResult; at: string } | null = null;
  const key = text(plano);
  if (key) {
    const found = user.planos.find((item) => item.key === key);
    const request = found ? planRequestSchema.safeParse(found.pedido) : null;
    if (found && request?.success) {
      saved = { request: request.data, plan: found.resultado as PlanResult, at: found.criado };
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Agente de viagens"
        title="Planejar viagem"
        description="Diga para onde quer ir. O agente cruza o pedido com o radar de promoções e monta a estratégia: aeroportos, programas, paradas, stopover e bônus."
        updatedAt={<LastUpdated entries={[{ label: 'Radar usado pelo agente', at: radar.meta.ultimaVarredura }, { label: 'Busca ao vivo nos sites', at: radar.meta.aoVivo }]} />}
      />
      <Planner
        data={toPriceData(radar)}
        today={todayKey()}
        plannerReady={isPlannerConfigured()}
        initial={{ origem: text(origem), destino: text(destino) }}
        saved={saved}
        radarAt={radar.meta.ultimaVarredura}
      />
    </>
  );
}
