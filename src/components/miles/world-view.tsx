'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Link2, Plane, Snowflake, Sun } from 'lucide-react';

import { ExternalLink, Plan, Tag } from '@/components/miles/bits';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber } from '@/lib/format';
import {
  flightLink,
  programName,
  type Destaque,
  type Ideia,
  type Parceira,
  type VooMundo,
} from '@/lib/miles/radar';

const regions = ['Todas', 'América do Sul', 'Caribe e Américas', 'EUA', 'Europa', 'Executiva'];

interface WorldViewProps {
  flights: VooMundo[];
  highlights: Destaque[];
  partners: Parceira[];
  snow: Ideia[];
  caribbean: Ideia[];
}

const planHref = (destination: string | undefined, origin = 'Brasília (BSB)') =>
  `/app/planejar?origem=${encodeURIComponent(origin)}&destino=${encodeURIComponent(destination ?? '')}`;

const IdeaCard = ({ idea }: { idea: Ideia }) => (
  <Plan>
    <div className="flex flex-wrap items-center justify-between gap-2 font-medium">
      <span>
        {idea.emoji ?? ''} {idea.titulo}
      </span>
      <span className="text-brand-ink text-xs">{idea.meta}</span>
    </div>
    <p className="text-sm">{idea.porque}</p>
    <p className="text-muted-foreground text-sm">Como ir com milhas: {idea.caminho}</p>
    {idea.quando && (
      <p className="text-muted-foreground text-sm">Melhor época: {idea.quando}</p>
    )}
    <Button asChild variant="outline" size="sm" className="w-fit">
      <Link href={planHref(idea.destino)}>Planejar</Link>
    </Button>
  </Plan>
);

export const WorldView = ({ flights, highlights, partners, snow, caribbean }: WorldViewProps) => {
  const [region, setRegion] = useState('Todas');
  const visible = flights
    .filter((flight) => region === 'Todas' || flight.regiao === region)
    .sort((a, b) => a.milhas - b.milhas);

  return (
    <div className="grid gap-6">
      <div role="radiogroup" aria-label="Região" className="flex flex-wrap gap-2">
        {regions.map((name) => (
          <Button
            key={name}
            type="button"
            size="sm"
            variant={region === name ? 'default' : 'outline'}
            role="radio"
            aria-checked={region === name}
            onClick={() => {
              setRegion(name);
            }}
          >
            {name === 'Todas' ? 'Todas as regiões' : name}
          </Button>
        ))}
      </div>

      {highlights.map((highlight) => (
        <Card key={highlight.id} className="border-primary/50">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Tag tone={highlight.verificado ? 'ok' : 'warn'}>
                {highlight.verificado ? '✅ VERIFICADO AO VIVO' : '⭐ MELHOR DA SEMANA'}
              </Tag>
              <span className="text-muted-foreground text-xs">{highlight.selo}</span>
            </div>
            <CardTitle className="text-lg">{highlight.titulo}</CardTitle>
            <p className="brand-text text-2xl font-semibold tabular-nums">{highlight.total}</p>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <p>{highlight.detalhe}</p>
            {highlight.dica && (
              <p className="bg-muted/40 rounded-lg border border-dashed p-3">
                <strong>Por que é ótimo: </strong>
                {highlight.dica}
              </p>
            )}
            {highlight.url && <ExternalLink href={highlight.url}>Ver alerta</ExternalLink>}
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            <Plane className="text-brand-ink size-4" aria-hidden />
            Voos promocionais
            <Tag tone="ok">
              {visible.length} {visible.length === 1 ? 'voo' : 'voos'}
            </Tag>
          </CardTitle>
          <CardDescription>
            ✅ consultado ao vivo no site da companhia. 📰 disponibilidade publicada em
            alerta de blog: confira no site antes de transferir pontos. Some as taxas de
            embarque, que no internacional costumam ficar entre R$ 150 e R$ 600 por trecho.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-2">
          {visible.length === 0 && (
            <p className="text-muted-foreground text-sm">Nenhum voo nesta região agora.</p>
          )}
          {visible.map((flight) => {
            const link = flightLink(flight);
            return (
              <Plan key={flight.id}>
                <div className="flex items-center justify-between gap-2 font-medium">
                  <span>
                    {flight.origem.replace(/ \(.*\)/, '')} → {flight.destino}
                  </span>
                  <span className="brand-text whitespace-nowrap tabular-nums">
                    {formatNumber(flight.milhas)} milhas
                  </span>
                </div>
                <p className="text-muted-foreground text-xs">
                  {flight.verificado ? `✅ verificado ao vivo em ${flight.verificado} · ` : '📰 alerta de blog (sem data própria, vale a data do radar) · '}
                  {flight.programa}
                  {flight.cia ? ` · voa ${flight.cia}` : ''} · {flight.quando}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Tag tone={flight.regiao === 'Executiva' ? 'warn' : 'blue'}>{flight.regiao}</Tag>
                  {flight.nota && <span className="text-xs">{flight.nota}</span>}
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {link && (
                    <Button asChild size="sm">
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        Abrir na {programName(flight.programa)}
                      </a>
                    </Button>
                  )}
                  {!flight.verificado && flight.url && (
                    <ExternalLink href={flight.url} className="text-xs">
                      ver alerta
                    </ExternalLink>
                  )}
                  <Button asChild variant="outline" size="sm">
                    <Link href={planHref(flight.destino, flight.origem)}>Planejar</Link>
                  </Button>
                </div>
              </Plan>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border-warning/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="text-brand-ink size-4" aria-hidden />
            Parceiras com tabela fixa e bons resgates
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-2">
          {partners.map((partner) => (
            <Plan key={partner.id}>
              <div className="flex flex-wrap items-center justify-between gap-2 font-medium">
                <span>
                  {partner.programa} → {partner.parceiras}
                </span>
                {partner.alerta ? (
                  <Tag tone="bad">{partner.alerta}</Tag>
                ) : (
                  <Tag tone={partner.fixa ? 'ok' : 'blue'}>
                    {partner.fixa ? 'TABELA FIXA' : 'PREÇO DINÂMICO'}
                  </Tag>
                )}
              </div>
              {partner.regra && <p className="text-sm">{partner.regra}</p>}
              {partner.valores && partner.valores.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-muted-foreground text-left text-xs">
                        <th className="py-1 font-medium">Rota / cabine</th>
                        <th className="py-1 text-right font-medium">Hoje</th>
                        <th className="py-1 text-right font-medium">
                          {partner.colDepois ?? 'A partir de 23/11'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {partner.valores.map((value) => (
                        <tr key={value.rota} className="border-t">
                          <td className="py-1 text-xs">{value.rota}</td>
                          <td className="py-1 text-right tabular-nums">{value.hoje ?? '—'}</td>
                          <td className="py-1 text-right tabular-nums">{value.depois ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {partner.melhorUso && (
                <p className="text-muted-foreground text-sm">Melhor uso: {partner.melhorUso}</p>
              )}
              {partner.comoEmitir && (
                <p className="text-muted-foreground text-sm">Como emitir: {partner.comoEmitir}</p>
              )}
              {partner.url && <ExternalLink href={partner.url}>fonte</ExternalLink>}
            </Plan>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Snowflake className="text-brand-ink size-4" aria-hidden />
            Neve e frio
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-2">
          {snow.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="text-brand-ink size-4" aria-hidden />
            Caribe e América Central
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-2">
          {caribbean.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </CardContent>
      </Card>
      <p className="text-muted-foreground text-xs">
        Faixas de milhas são estimativas de bom preço. Use o Planejar para montar a rota e confirme no
        site do programa.
      </p>
    </div>
  );
};
