import type { Metadata } from 'next';

import { Planner } from '@/components/miles/planner';
import { PageHeader } from '@/components/platform/page-header';
import { getRadar, todayKey } from '@/data/radar';
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
  const text = (value: string | string[] | undefined) =>
    typeof value === 'string' ? value.trim().slice(0, maxLength) : '';

  let saved: { request: ReturnType<typeof planRequestSchema.parse>; plan: PlanResult } | null = null;
  const key = text(plano);
  if (key) {
    const found = user.planos.find((item) => item.key === key);
    const request = found ? planRequestSchema.safeParse(found.pedido) : null;
    if (found && request?.success) {
      saved = { request: request.data, plan: found.resultado as PlanResult };
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Agente de viagens"
        title="Planejar viagem"
        description="Diga para onde quer ir. O agente cruza o pedido com o radar de promoções e monta a estratégia: aeroportos, programas, paradas, stopover e bônus."
      />
      <Planner
        data={toPriceData(getRadar())}
        today={todayKey()}
        plannerReady={isPlannerConfigured()}
        initial={{ origem: text(origem), destino: text(destino) }}
        saved={saved}
      />
    </>
  );
}
