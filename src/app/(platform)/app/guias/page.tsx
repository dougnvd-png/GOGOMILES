import type { Metadata } from 'next';
import { GraduationCap, MapPin } from 'lucide-react';

import { ExternalLink, Plan, Tag } from '@/components/miles/bits';
import { LastUpdated } from '@/components/miles/last-updated';
import { PageHeader } from '@/components/platform/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRadar } from '@/data/radar';
import { formatDateTime } from '@/lib/format';
import { latestOf } from '@/lib/miles/radar';

export const metadata: Metadata = { title: 'Guias e manual' };

const tagTone = (tag: string | undefined) =>
  tag === 'MITO' ? 'bad' : tag === 'EVITE' ? 'warn' : 'ok';

export default function GuidesPage() {
  const radar = getRadar();
  const tips = [...radar.dicas].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
  return (
    <>
      <PageHeader
        eyebrow="Aprenda e planeje"
        title="Guias e manual"
        description="O manual do caçador de milhas e guias de destino com aeroportos, planos de emissão e fontes."
        updatedAt={<LastUpdated entries={[{ label: 'Radar (manual e dicas)', at: radar.meta.ultimaVarredura }, { label: 'Guia de destino mais recente', at: latestOf(radar.guias.map((guide) => guide.atualizado)) }]} />}
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="text-brand-ink size-4" aria-hidden />
            Manual do caçador de milhas
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-2">
          {tips.map((tip) => (
            <Plan key={tip.id}>
              <div className="flex flex-wrap items-center justify-between gap-2 font-medium">
                <span>
                  {tip.emoji ?? ''} {tip.titulo}
                </span>
                {tip.tag && <Tag tone={tagTone(tip.tag)}>{tip.tag}</Tag>}
              </div>
              <p className="text-sm">{tip.texto}</p>
              {tip.exemplo && (
                <p className="text-muted-foreground text-sm">
                  Exemplo: {tip.exemplo}
                </p>
              )}
            </Plan>
          ))}
        </CardContent>
      </Card>
      {radar.guias.map((guide) => (
        <Card key={guide.id}>
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center gap-2">
              <MapPin className="text-brand-ink size-4" aria-hidden />
              {guide.nome}
              {guide.quando ? ` — ${guide.quando}` : ''}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm">
            {guide.recomendacao && <p>{guide.recomendacao}</p>}
            {guide.calendario && (
              <p className="bg-muted/40 rounded-lg border border-dashed p-3">
                <strong>Calendário: </strong>
                {guide.calendario}
              </p>
            )}
            {guide.aeroportos && (
              <div className="grid gap-2">
                <h3 className="font-semibold">Aeroportos de saída</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {guide.aeroportos.map((airport) => (
                    <Plan key={airport.codigo}>
                      <div className="flex items-center justify-between gap-2 font-medium">
                        <span>
                          {airport.codigo} · {airport.nome}
                        </span>
                        <Tag
                          tone={
                            airport.nota === 'melhor'
                              ? 'ok'
                              : airport.nota === 'bom'
                                ? 'blue'
                                : 'muted'
                          }
                        >
                          {(airport.nota ?? '').toUpperCase()}
                        </Tag>
                      </div>
                      <p className="text-muted-foreground">{airport.rota}</p>
                    </Plan>
                  ))}
                </div>
              </div>
            )}
            {guide.planos && (
              <div className="grid gap-2">
                <h3 className="font-semibold">Planos de emissão</h3>
                {guide.planos.map((plan) => (
                  <Plan key={plan.titulo}>
                    <div className="flex flex-wrap items-center justify-between gap-2 font-medium">
                      <span>{plan.titulo}</span>
                      <span className="text-brand-ink">{plan.custo}</span>
                    </div>
                    <p className="text-muted-foreground">{plan.resumo}</p>
                    {plan.pontos && (
                      <ul className="list-disc pl-5">
                        {plan.pontos.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    )}
                  </Plan>
                ))}
              </div>
            )}
            {guide.dicas && (
              <div className="grid gap-2">
                <h3 className="font-semibold">Dicas</h3>
                <ul className="list-disc pl-5">
                  {guide.dicas.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
            {guide.fontes && (
              <div className="grid gap-2">
                <h3 className="font-semibold">Fontes</h3>
                <ul className="list-disc pl-5">
                  {guide.fontes.map((source) => (
                    <li key={source.url}>
                      <ExternalLink href={source.url}>{source.titulo}</ExternalLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {guide.atualizado && (
              <p className="text-muted-foreground text-xs">
                Atualizado em {formatDateTime(guide.atualizado)}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </>
  );
}
