import type { Metadata } from 'next';
import { Plane } from 'lucide-react';

import { AirlineBadges, ExternalLink } from '@/components/miles/bits';
import { LastUpdated } from '@/components/miles/last-updated';
import { PageHeader } from '@/components/platform/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getRadar } from '@/data/radar';
import { formatDate, formatNumber } from '@/lib/format';
import { latestOf } from '@/lib/miles/radar';

export const metadata: Metadata = { title: 'Oportunidades' };

export default function OpportunitiesPage() {
  const radar = getRadar();
  const list = [...radar.oportunidades].sort((a, b) =>
    String(b.encontrado ?? '').localeCompare(String(a.encontrado ?? '')),
  );
  return (
    <>
      <PageHeader
        eyebrow="Emissões em milhas"
        title="Oportunidades"
        description="Oportunidades de emissão encontradas em alertas e nos sites das companhias. Confirme o preço no site antes de transferir pontos."
        updatedAt={<LastUpdated entries={[{ label: 'Radar de oportunidades', at: radar.meta.ultimaVarredura }, { label: 'Oportunidade mais recente encontrada', at: latestOf(radar.oportunidades.map((item) => item.encontrado)) }]} />}
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="text-brand-ink size-4" aria-hidden />
            Oportunidades encontradas
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rota</TableHead>
                <TableHead>Programa · companhia</TableHead>
                <TableHead className="text-right">Milhas por trecho</TableHead>
                <TableHead>Datas</TableHead>
                <TableHead>Encontrada em</TableHead>
                <TableHead>
                  <span className="sr-only">Fonte</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-72 font-medium whitespace-normal">
                    {item.origem} → {item.destino}
                    {item.nota && (
                      <p className="text-muted-foreground mt-1 text-xs font-normal">
                        {item.nota}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">
                    <AirlineBadges text={`${item.programa ?? ''} ${item.cia ?? ''}`} />
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatNumber(item.milhas)}
                  </TableCell>
                  <TableCell className="max-w-56 text-xs whitespace-normal">
                    {item.datas}
                  </TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">
                    {item.encontrado
                      ? formatDate(`${item.encontrado}T12:00:00Z`)
                      : '—'}
                  </TableCell>
                  <TableCell>
                    {item.url && <ExternalLink href={item.url}>fonte</ExternalLink>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
