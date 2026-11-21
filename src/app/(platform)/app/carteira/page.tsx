import type { Metadata } from 'next';

import { Wallet } from '@/components/miles/wallet';
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
      />
      <Wallet data={data} />
    </>
  );
}
