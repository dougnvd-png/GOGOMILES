import type { Metadata } from 'next';

import { Wallet } from '@/components/miles/wallet';
import { LastUpdated } from '@/components/miles/last-updated';
import { PageHeader } from '@/components/platform/page-header';
import { getUserData } from '@/server/queries/user-docs';

export const metadata: Metadata = { title: 'Minha carteira' };

export default async function WalletPage() {
  const data = await getUserData();
  return (
    <>
      <PageHeader
        eyebrow="Área privada"
        title="Minha carteira"
        description="Seus saldos de pontos e milhas, seu perfil nos programas, as rotas vigiadas e os planos salvos."
        updatedAt={<LastUpdated entries={[{ label: 'Saldos', at: data.savedAt.saldo }, { label: 'Perfil', at: data.savedAt.perfil }, { label: 'Rotas vigiadas', at: data.savedAt.vigia }, { label: 'Planos', at: data.savedAt.plano }]} />}
      />
      <Wallet data={data} />
    </>
  );
}
