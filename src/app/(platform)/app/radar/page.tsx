import type { Metadata } from 'next';
import { Thermometer, TrendingUp } from 'lucide-react';

import { ExternalLink, Tag } from '@/components/miles/bits';
import { PageHeader } from '@/components/platform/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getRadar, todayKey } from '@/data/radar';
import { formatDate } from '@/lib/format';
import { daysUntil, isActivePromo } from '@/lib/miles/radar';

export const metadata: Metadata = { title: 'Radar de bônus' };

const verdictTone = (verdict: string | undefined, active: boolean) => {
  if (!active) {
    return 'muted' as const;
  }
  if (verdict === 'excelente') {
    return 'ok' as const;
  }
  if (verdict === 'bom') {
    return 'blue' as const;
  }
  return verdict === 'fraco' ? ('bad' as const) : ('warn' as const);
};

export default function RadarPage() {
  const radar = getRadar();
  const today = todayKey();
  const promos = [...radar.promos].sort(
    (a, b) =>
      Number(isActivePromo(b, today)) - Number(isActivePromo(a, today)) ||
      (daysUntil(a.fim, today) ?? 99) - (daysUntil(b.fim, today) ?? 99),
  );
  const open = promos.filter((promo) => isActivePromo(promo, today));

  return (
    <>
      <PageHeader
        eyebrow="Transferências bonificadas"
        title="Radar de bônus"
        description={
          radar.meta.resumo ??
          'Promoções de transferência de pontos dos bancos para as companhias.'
        }
      />
      {open.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {open.map((promo) => {
            const left = daysUntil(promo.fim, today);
            return (
              <Card key={promo.id} className="gap-2">
                <CardHeader>
                  <CardTitle className="text-base">
                    {promo.de} → {promo.para}
                  </CardTitle>
                  <CardDescription>
                    Até {promo.bonusMax ?? '?'}% · {promo.veredito ?? ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tag tone={left !== null && left <= 1 ? 'bad' : 'warn'}>
                    {left === null
                      ? 'prazo a confirmar'
                      : left <= 0
                        ? 'termina hoje'
                        : left === 1
                          ? 'termina amanhã'
                          : `termina em ${left} dias`}
                  </Tag>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-brand-ink size-4" aria-hidden />
            Todas as campanhas
          </CardTitle>
          <CardDescription>
            Valores de 2025 e 2026. Confirme as regras na página da campanha
            antes de transferir.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rota</TableHead>
                <TableHead className="text-right">Bônus máx.</TableHead>
                <TableHead>Faixas</TableHead>
                <TableHead>Termina</TableHead>
                <TableHead>Veredito</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promos.map((promo) => {
                const active = isActivePromo(promo, today);
                const verdict = active ? (promo.veredito ?? '') : 'encerrada';
                return (
                  <TableRow key={promo.id}>
                    <TableCell className="max-w-56 font-medium whitespace-normal">
                      {promo.de} → {promo.para}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {promo.bonusMax != null ? `${promo.bonusMax}%` : '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-96 text-xs whitespace-normal">
                      {promo.seuBonus ?? promo.faixas ?? ''}
                      {promo.nota && <p className="mt-1">{promo.nota}</p>}
                      {promo.url && (
                        <ExternalLink href={promo.url}>ver campanha</ExternalLink>
                      )}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {promo.fim ? formatDate(`${promo.fim}T12:00:00Z`) : '—'}
                    </TableCell>
                    <TableCell>
                      <Tag tone={verdictTone(promo.veredito, active)}>
                        {verdict.toUpperCase() || '—'}
                      </Tag>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="text-brand-ink size-4" aria-hidden />
            Termômetro: quando vale transferir
          </CardTitle>
          <CardDescription>
            Faixas observadas nas campanhas de 2025 e 2026. Abaixo do gatilho,
            espere a próxima.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rota</TableHead>
                <TableHead className="text-right">Comum</TableHead>
                <TableHead className="text-right">Gatilho</TableHead>
                <TableHead className="text-right">Excelente</TableHead>
                <TableHead>Frequência</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...radar.benchmarks]
                .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
                .map((bench) => (
                  <TableRow key={bench.id}>
                    <TableCell className="font-medium">
                      {bench.de} → {bench.para}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {bench.comum ?? '—'}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {bench.gatilho ?? '—'}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {bench.excelente ?? '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-96 text-xs whitespace-normal">
                      {bench.frequencia}
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
