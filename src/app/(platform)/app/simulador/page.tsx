import type { Metadata } from 'next';

import { Simulator } from '@/components/miles/simulator';
import { LastUpdated } from '@/components/miles/last-updated';
import { PageHeader } from '@/components/platform/page-header';
import { getUserData } from '@/server/queries/user-docs';

export const metadata: Metadata = { title: 'Simulador' };

export default async function SimulatorPage() {
  const { saldos, savedAt: saved } = await getUserData();
  const savedAt = saved.saldo;
  const cpm: Record<string, number> = {};
  const balances: Record<string, number> = {};
  for (const [id, saldo] of Object.entries(saldos)) {
    cpm[id] = saldo.cpm;
    balances[id] = saldo.saldo;
  }
  return (
    <>
      <PageHeader
        eyebrow="Contas rápidas"
        title="Simulador"
        description="Veja quanto rende uma transferência com bônus e se compensa usar milhas ou pagar em dinheiro."
        updatedAt={<LastUpdated entries={[{ label: 'Saldos e milheiros da carteira', at: savedAt }]} />}
      />
      <Simulator cpmOverrides={cpm} balances={balances} />
    </>
  );
}
