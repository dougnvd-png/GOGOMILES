import type { Metadata } from 'next';
import { Lightbulb, MapPinned } from 'lucide-react';

import { AirlineBadges, ExternalLink, Plan, Tag } from '@/components/miles/bits';
import { LastUpdated } from '@/components/miles/last-updated';
import { PageHeader } from '@/components/platform/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getRadar } from '@/data/radar';

export const metadata: Metadata = { title: 'Stopover' };

export default async function StopoverPage() {
  const radar = await getRadar();
  const stops = [...radar.stopovers].sort(
    (a, b) => (a.ordem ?? 0) - (b.ordem ?? 0),
  );
  return (
    <>
      <PageHeader
        eyebrow="Paradas no caminho"
        title="Stopover"
        description="Stopover é uma parada de mais de 24 horas no meio da viagem. Conexão é a troca de avião no mesmo dia."
        updatedAt={<LastUpdated entries={[{ label: 'Radar de regras e promoções', at: radar.meta.ultimaVarredura }]} />}
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPinned className="text-brand-ink size-4" aria-hidden />
            O que cada programa permite
          </CardTitle>
          <CardDescription>
            Confirme sempre a regra oficial antes de emitir.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-2">
          {stops.map((stop) => (
            <Plan key={stop.id}>
              <div className="flex flex-wrap items-center justify-between gap-2 font-medium">
                <span className="flex flex-wrap items-center gap-2">
                  <AirlineBadges text={stop.programa.split(' · ')[0]} />
                  {[...stop.programa.split(' · ').slice(1), stop.cidade].join(' · ')}
                </span>
                <Tag
                  tone={
                    stop.milhas === 'sim'
                      ? 'ok'
                      : stop.milhas === 'nao'
                        ? 'bad'
                        : 'warn'
                  }
                >
                  {stop.milhas === 'sim'
                    ? 'VALE COM MILHAS'
                    : stop.milhas === 'nao'
                      ? 'SÓ PASSAGEM PAGA'
                      : 'CONFIRMAR'}
                </Tag>
              </div>
              {stop.regra && <p className="text-sm">{stop.regra}</p>}
              {stop.dica && (
                <p className="text-muted-foreground text-sm">Dica: {stop.dica}</p>
              )}
              {stop.url && (
                <ExternalLink href={stop.url} className="text-sm">
                  regra oficial / fonte
                </ExternalLink>
              )}
            </Plan>
          ))}
        </CardContent>
      </Card>
      <Card className="border-primary/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="text-brand-ink size-4" aria-hidden />
            O stopover dos programas brasileiros
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          Smiles, Azul e LATAM Pass cobram por trecho. Dá para montar a parada
          emitindo os trechos separados, por exemplo São Paulo → Lisboa num dia
          e Lisboa → Roma três dias depois. O custo é a soma dos trechos e muitas
          vezes fica igual ao da conexão. Cada trecho tem as próprias taxas e
          você retira e despacha a bagagem de novo.
        </CardContent>
      </Card>
    </>
  );
}
