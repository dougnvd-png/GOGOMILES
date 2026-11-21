import type { Metadata } from 'next';

import { Simulator } from '@/components/miles/simulator';
import { PageHeader } from '@/components/platform/page-header';
import { getUserData } from '@/server/queries/user-docs';

export const metadata: Metadata = { title: 'Simulador' };

export default async function SimulatorPage() {
  const { saldos } = await getUserData();
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
      />
      <Simulator cpmOverrides={cpm} balances={balances} />
    </>
  );
}
