'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { Flag, Plane, Star, Target, Zap, Compass } from 'lucide-react';
import { toast } from 'sonner';

import { AirportInput } from '@/components/miles/airport-input';
import {
  AirlineBadge,
  ExternalLink,
  LightDot,
  Plan,
  Tag,
  lightTextClass,
} from '@/components/miles/bits';
import { PriceGrid, type GridCell } from '@/components/miles/price-grid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatNumber } from '@/lib/format';
import {
  brDate,
  cityName,
  codeFrom,
  daysUntil,
  flightLink,
  iata,
  light,
  lightText,
  monthSearch,
  programKeys,
  programName,
  ruler,
  type Achado,
  type Campanha,
  type Destaque,
  type Ideia,
  type PriceData,
} from '@/lib/miles/radar';
import type { Estrela } from '@/lib/miles/user-data';
import { deleteUserDoc, saveUserDoc } from '@/server/actions/user-docs';

const hubs = [
  { id: 'Todas', label: 'Todas as saídas' },
  { id: 'GYN', label: 'Goiânia (GYN)' },
  { id: 'BSB', label: 'Brasília (BSB)' },
  { id: 'VCP', label: 'Campinas (VCP)' },
];
const homeAirports = [
  { code: 'GYN', label: 'Goiânia (GYN)' },
  { code: 'BSB', label: 'Brasília (BSB)' },
];

interface BrazilViewProps {
  data: PriceData;
  today: string;
  achados: Achado[];
  highlights: Destaque[];
  campaigns: Campanha[];
  ideas: Ideia[];
  stars: Estrela[];
}

const monthLabel = (month: string) => {
  const text = new Date(`${month}-15T12:00:00`).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const planHref = (origin: string, destination: string) =>
  `/app/planejar?origem=${encodeURIComponent(origin)}&destino=${encodeURIComponent(destination)}`;

/* ---------- busca por aeroporto e mês ---------- */

const MonthSearch = ({ data, today }: { data: PriceData; today: string }) => {
  const months = useMemo(() => {
    const [year, month] = today.split('-').map(Number);
    return Array.from({ length: 12 }, (_, index) => {
      const date = new Date(year, month - 1 + index, 1);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    });
  }, [today]);
  const [originText, setOriginText] = useState('Goiânia (GYN)');
  const [month, setMonth] = useState(months[1]);
  const [max, setMax] = useState('20000');
  const [program, setProgram] = useState('Todos');
  const [day, setDay] = useState<string | null>(null);
  const [searched, setSearched] = useState(true);

  const o = codeFrom(originText) ?? '';
  const ceiling = Number(max) || 20000;
  const hits = useMemo(
    () => (searched && o ? monthSearch(data, o, month, ceiling, program, today) : []),
    [data, o, month, ceiling, program, today, searched],
  );

  const byDay: Record<string, typeof hits> = {};
  for (const hit of hits) {
    (byDay[hit.dia] ??= []).push(hit);
  }
  const cells: Record<string, GridCell> = {};
  for (const [dayKey, list] of Object.entries(byDay)) {
    const best = list.reduce((a, b) => (a.milhas <= b.milhas ? a : b));
    cells[dayKey] = { miles: best.milhas, light: light(best.milhas, ruler(o, best.d).ref) };
  }
  const visible = day ? hits.filter((hit) => hit.dia === day) : hits;
  const groups: Record<string, typeof hits> = {};
  for (const hit of visible) {
    (groups[hit.d] ??= []).push(hit);
  }
  const sorted = Object.entries(groups)
    .map(([d, list]) => ({
      d,
      list: [...list].sort((a, b) => a.dia.localeCompare(b.dia) || a.milhas - b.milhas),
    }))
    .sort(
      (a, b) =>
        Math.min(...a.list.map((x) => x.milhas)) - Math.min(...b.list.map((x) => x.milhas)),
    );
  const others = months
    .filter((value) => value !== month)
    .map((value) => ({ value, list: monthSearch(data, o, value, ceiling, program, today) }))
    .filter((entry) => entry.list.length > 0);

  return (
    <Card className="border-primary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="text-brand-ink size-4" aria-hidden />
          Buscar por aeroporto e mês
        </CardTitle>
        <CardDescription>
          Escolha de onde sai, o mês e o teto de milhas. Aparecem todos os destinos e todos os
          dias do mês com preço igual ou abaixo do teto. Valores por trecho, só ida.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="bb-origin">Saindo de</FieldLabel>
            <AirportInput
              id="bb-origin"
              value={originText}
              onChange={setOriginText}
              onPick={() => {
                setDay(null);
                setSearched(true);
              }}
              placeholder="Ex.: Goiânia (GYN)"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="bb-month">Mês da viagem</FieldLabel>
            <Select
              value={month}
              onValueChange={(value) => {
                setMonth(value);
                setDay(null);
              }}
            >
              <SelectTrigger id="bb-month" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((value) => (
                  <SelectItem key={value} value={value}>
                    {monthLabel(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="bb-max">Até quantas milhas por trecho</FieldLabel>
            <Input
              id="bb-max"
              inputMode="numeric"
              value={max}
              onChange={(event) => {
                setMax(event.target.value.replace(/\D/g, ''));
                setDay(null);
              }}
            />
          </Field>
        </div>
        <div role="radiogroup" aria-label="Programa" className="flex flex-wrap gap-2">
          {['Todos', ...programKeys].map((name) => (
            <Button
              key={name}
              type="button"
              size="sm"
              role="radio"
              aria-checked={program === name}
              variant={program === name ? 'default' : 'outline'}
              onClick={() => {
                setProgram(name);
                setDay(null);
              }}
            >
              {name === 'Todos' ? 'Todos os programas' : name}
            </Button>
          ))}
        </div>

        {!o ? (
          <p className="text-muted-foreground text-sm">
            Escolha o aeroporto de saída na lista, como Goiânia (GYN).
          </p>
        ) : hits.length === 0 ? (
          <div className="grid gap-2">
            <p className="font-medium">
              Nada até {formatNumber(ceiling)} milhas saindo de {o} em {monthLabel(month)}
            </p>
            <p className="text-muted-foreground text-sm">
              Ainda não há preço registrado nesse filtro. Tente outro mês, aumente o teto ou troque
              o programa.
            </p>
            {others.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {others.map((entry) => (
                  <Button
                    key={entry.value}
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setMonth(entry.value);
                      setDay(null);
                    }}
                  >
                    {monthLabel(entry.value)} · {entry.list.length}{' '}
                    {entry.list.length === 1 ? 'opção' : 'opções'} · desde{' '}
                    {formatNumber(Math.min(...entry.list.map((hit) => hit.milhas)))}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <p className="text-muted-foreground text-sm" aria-live="polite">
              {hits.length} {hits.length === 1 ? 'opção' : 'opções'} em{' '}
              {new Set(hits.map((hit) => hit.d)).size} destino(s) · mais barato{' '}
              {formatNumber(Math.min(...hits.map((hit) => hit.milhas)))} milhas. Toque num dia para
              filtrar.
            </p>
            <div className="max-w-md">
              <PriceGrid month={month} cells={cells} today={today} selected={day} onSelect={(value) => { if (cells[value]) { setDay(day === value ? null : value); } }} />
            </div>
            {day && (
              <p className="text-sm">
                Só o dia {brDate(day)}{' '}
                <Button type="button" size="xs" variant="outline" onClick={() => { setDay(null); }}>
                  Mostrar o mês inteiro
                </Button>
              </p>
            )}
            <div className="grid gap-3 lg:grid-cols-2">
              {sorted.map(({ d, list }) => {
                const min = Math.min(...list.map((hit) => hit.milhas));
                const rule = ruler(o, d);
                return (
                  <Plan key={d}>
                    <div className="flex items-center justify-between gap-2 font-medium">
                      <span>
                        {o} → {cityName(d)}
                      </span>
                      <span className={`whitespace-nowrap ${lightTextClass(light(min, rule.ref))}`}>
                        desde {formatNumber(min)}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {list.length} {list.length === 1 ? 'dia' : 'dias'} até {formatNumber(ceiling)} ·
                      régua {rule.nome}: bom até {formatNumber(rule.ref)}
                    </p>
                    {list.map((hit) => {
                      const tone = light(hit.milhas, rule.ref);
                      return (
                        <div key={`${hit.dia}-${hit.prog}`} className="flex flex-wrap items-center gap-2 text-sm">
                          <AirlineBadge name={hit.prog} />
                          <strong>
                            {hit.dia.slice(8)}/{hit.dia.slice(5, 7)} (
                            {new Date(`${hit.dia}T12:00:00`)
                              .toLocaleDateString('pt-BR', { weekday: 'short' })
                              .replace('.', '')}
                            )
                          </strong>
                          <span className={`font-bold ${lightTextClass(tone)}`}>
                            <LightDot value={tone} /> {formatNumber(hit.milhas)}
                          </span>
                          <span className="text-muted-foreground text-xs">{hit.fonte}</span>
                          <ExternalLink href={hit.url ?? flightLink({ origem: `(${o})`, destino: `(${d})`, programa: hit.prog, quando: brDate(hit.dia) }) ?? '#'}>
                            abrir na {programName(hit.prog)}
                          </ExternalLink>
                        </div>
                      );
                    })}
                    <Button asChild size="xs" variant="outline" className="w-fit">
                      <Link href={`/app/calendario?origem=${encodeURIComponent(cityName(o))}&destino=${encodeURIComponent(cityName(d))}`}>
                        Calendário da rota
                      </Link>
                    </Button>
                  </Plan>
                );
              })}
            </div>
            <p className="text-muted-foreground text-xs">
              Só aparecem dias que a varredura ou os blogs já registraram. O preço em milhas muda a
              qualquer momento: confira no site antes de transferir pontos.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

/* ---------- destinos estrela ---------- */

const StarDestinations = ({ stars, achados }: { stars: Estrela[]; achados: Achado[] }) => {
  const [name, setName] = useState('');
  const [airports, setAirports] = useState('');
  const [goal, setGoal] = useState('');
  const [origins, setOrigins] = useState<string[]>(['GYN', 'BSB']);
  const [isPending, startTransition] = useTransition();

  const hitsFor = (star: Estrela) =>
    achados
      .filter(
        (hit) =>
          star.aeroportos.includes(iata(hit.destino)) &&
          (star.origens.length ? star.origens : ['GYN', 'BSB']).includes(iata(hit.origem)),
      )
      .sort((a, b) => a.milhas - b.milhas);

  const add = () => {
    const codes = airports
      .toUpperCase()
      .split(/[^A-Z]+/)
      .filter((code) => code.length === 3);
    if (!name.trim() || codes.length === 0) {
      toast.error('Preencha o nome e ao menos um código de aeroporto (3 letras).');
      return;
    }
    startTransition(async () => {
      const result = await saveUserDoc({
        kind: 'estrela',
        key: crypto.randomUUID(),
        data: { nome: name.trim(), aeroportos: codes, origens: origins, meta: Number(goal) || 0 },
      });
      if (result.ok) {
        toast.success('Destino marcado.');
        setName('');
        setAirports('');
        setGoal('');
      } else {
        toast.error(result.error);
      }
    });
  };

  const remove = (key: string) => {
    startTransition(async () => {
      const result = await deleteUserDoc({ kind: 'estrela', key });
      if (!result.ok) {
        toast.error(result.error);
      }
    });
  };

  return (
    <Card className="border-primary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="text-brand-ink size-4" aria-hidden />
          Meus destinos estrela
          {stars.length > 0 && <Tag tone="blue">{stars.length} destinos</Tag>}
        </CardTitle>
        <CardDescription>
          Monitorados saindo das cidades marcadas. O GO GO MILES cruza com todas as promoções
          encontradas e destaca quando o preço chega na sua meta.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {stars.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nenhum destino estrela ainda. Use o formulário abaixo.
          </p>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {stars.map((star) => {
              const hits = hitsFor(star);
              const best = hits[0];
              const starOrigins = (star.origens.length ? star.origens : ['GYN', 'BSB']).join(' ou ');
              return (
                <Plan key={star.key}>
                  <div className="flex items-center justify-between gap-2 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Star className="size-4" aria-hidden />
                      {star.nome}
                    </span>
                    {best ? (
                      <Tag tone="ok">{formatNumber(best.milhas)} milhas</Tag>
                    ) : (
                      <Tag tone="blue">monitorando</Tag>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Aeroportos: {star.aeroportos.join(', ')} · saindo de {starOrigins}
                    {star.meta ? ` · meta ${formatNumber(star.meta)} por trecho` : ''}
                  </p>
                  {hits.slice(0, 3).map((hit) => {
                    const link = flightLink(hit);
                    return (
                      <p key={hit.id} className="text-sm">
                        {hit.verificado ? '✅ ' : '📰 '}
                        {iata(hit.origem)}→{iata(hit.destino)} · {formatNumber(hit.milhas)} ·{' '}
                        {hit.programa} · {hit.quando}{' '}
                        {link && <ExternalLink href={link}>abrir na {programName(hit.programa)}</ExternalLink>}
                      </p>
                    );
                  })}
                  {best && star.meta > 0 && best.milhas <= star.meta && (
                    <Tag tone="ok">🎯 abaixo da sua meta</Tag>
                  )}
                  {!best && (
                    <p className="text-muted-foreground text-sm">
                      Nenhuma promoção encontrada ainda saindo de {starOrigins}.
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button asChild size="xs" variant="outline">
                      <Link href={planHref(star.origens[0] === 'BSB' ? 'Brasília (BSB)' : 'Goiânia (GYN)', `${star.nome} (${star.aeroportos[0]})`)}>
                        Planejar
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      size="xs"
                      variant="outline"
                      disabled={isPending}
                      onClick={() => {
                        remove(star.key);
                      }}
                    >
                      Remover
                    </Button>
                  </div>
                </Plan>
              );
            })}
          </div>
        )}
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium">＋ Adicionar destino estrela</summary>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="star-name">Destino (nome)</FieldLabel>
              <Input id="star-name" value={name} maxLength={60} placeholder="Ex.: Jericoacoara CE" onChange={(e) => { setName(e.target.value); }} />
            </Field>
            <Field>
              <FieldLabel htmlFor="star-airports">Aeroportos (códigos, separados por vírgula)</FieldLabel>
              <Input id="star-airports" value={airports} placeholder="Ex.: JJD, FOR" onChange={(e) => { setAirports(e.target.value); }} />
            </Field>
            <Field>
              <FieldLabel htmlFor="star-goal">Meta por trecho (milhas, opcional)</FieldLabel>
              <Input id="star-goal" inputMode="numeric" value={goal} placeholder="Ex.: 10000" onChange={(e) => { setGoal(e.target.value.replace(/\D/g, '')); }} />
            </Field>
            <fieldset className="grid gap-2">
              <legend className="text-sm font-medium">Saindo de</legend>
              <div className="flex flex-wrap gap-2">
                {homeAirports.map((airport) => (
                  <Button
                    key={airport.code}
                    type="button"
                    size="sm"
                    aria-pressed={origins.includes(airport.code)}
                    variant={origins.includes(airport.code) ? 'default' : 'outline'}
                    onClick={() => {
                      setOrigins((current) =>
                        current.includes(airport.code)
                          ? current.filter((code) => code !== airport.code)
                          : [...current, airport.code],
                      );
                    }}
                  >
                    {airport.label}
                  </Button>
                ))}
              </div>
            </fieldset>
          </div>
          <Button type="button" className="mt-3" disabled={isPending} onClick={add}>
            <Star />
            Marcar destino
          </Button>
        </details>
      </CardContent>
    </Card>
  );
};

/* ---------- tela ---------- */

export const BrazilView = ({
  data,
  today,
  achados,
  highlights,
  campaigns,
  ideas,
  stars,
}: BrazilViewProps) => {
  const [hub, setHub] = useState('Todas');
  const hubOk = (item: { origem?: string; hubs?: string[] }) =>
    hub === 'Todas' || `${item.origem ?? ''} ${(item.hubs ?? []).join(' ')}`.includes(hub);
  const visibleFlights = achados.filter(hubOk).sort((a, b) => a.milhas - b.milhas);
  const openCampaigns = campaigns.filter((campaign) => {
    const left = daysUntil(campaign.fim, today);
    return left === null || left >= 0;
  });

  return (
    <div className="grid gap-6">
      <div role="radiogroup" aria-label="Saída" className="flex flex-wrap gap-2">
        {hubs.map((item) => (
          <Button
            key={item.id}
            type="button"
            size="sm"
            role="radio"
            aria-checked={hub === item.id}
            variant={hub === item.id ? 'default' : 'outline'}
            onClick={() => {
              setHub(item.id);
            }}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <MonthSearch data={data} today={today} />
      <StarDestinations stars={stars} achados={achados} />

      {highlights.map((highlight) => (
        <Card key={highlight.id} className="border-primary/50">
          <CardHeader>
            <Tag tone="ok">✅ VERIFICADO AO VIVO · {highlight.verificado}</Tag>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="text-brand-ink size-4" aria-hidden />
              {highlight.titulo}
            </CardTitle>
            <p className="brand-text text-2xl font-semibold tabular-nums">{highlight.total}</p>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <p>{highlight.detalhe}</p>
            {highlight.trechos?.map((leg) => (
              <Plan key={leg.rota}>
                <div className="flex items-center justify-between gap-2 font-medium">
                  <span>{leg.rota}</span>
                  <span className="brand-text tabular-nums">{formatNumber(leg.milhas)} milhas</span>
                </div>
                <p className="text-muted-foreground text-xs">{leg.info}</p>
                {leg.url && (
                  <Button asChild size="sm" className="w-fit">
                    <a href={leg.url} target="_blank" rel="noopener noreferrer">
                      Abrir este voo no site
                    </a>
                  </Button>
                )}
              </Plan>
            ))}
            {highlight.dica && (
              <p className="bg-muted/40 rounded-lg border border-dashed p-3">
                <strong>Por que é ótimo: </strong>
                {highlight.dica}
              </p>
            )}
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            <Plane className="text-brand-ink size-4" aria-hidden />
            Voos reais com milhas
            <Tag tone="ok">
              {visibleFlights.length} {visibleFlights.length === 1 ? 'voo' : 'voos'}
            </Tag>
          </CardTitle>
          <CardDescription>
            ✅ consultado ao vivo no site da companhia. 📰 disponibilidade publicada em alerta de
            blog: confira no site antes de transferir pontos. O preço em milhas muda a qualquer
            momento.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-2">
          {visibleFlights.length === 0 && (
            <p className="text-muted-foreground text-sm">
              {hub === 'VCP'
                ? 'Campinas ainda não entrou na varredura ao vivo.'
                : 'Nenhum voo verificado para esta saída ainda.'}
            </p>
          )}
          {visibleFlights.map((flight) => {
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
                  {flight.verificado ? '✅ verificado ao vivo · ' : '📰 alerta publicado · '}
                  {flight.programa} · {flight.quando}
                </p>
                {flight.nota && <p className="text-sm">{flight.nota}</p>}
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
                  <Button asChild size="sm" variant="outline">
                    <Link href={planHref(flight.origem, flight.destino)}>Planejar</Link>
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
            <Zap className="text-brand-ink size-4" aria-hidden />
            Campanhas no ar
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {openCampaigns.length === 0 && (
            <p className="text-muted-foreground text-sm">Nenhuma campanha nacional registrada agora.</p>
          )}
          {openCampaigns.map((campaign) => (
            <Plan key={campaign.id}>
              <div className="flex flex-wrap items-center justify-between gap-2 font-medium">
                <span>{campaign.titulo}</span>
                <Tag tone="warn">{campaign.fim ? `até ${brDate(campaign.fim)}` : 'no ar'}</Tag>
              </div>
              <p className="text-sm">{campaign.detalhe}</p>
              {campaign.url && <ExternalLink href={campaign.url}>ver oferta</ExternalLink>}
            </Plan>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="text-brand-ink size-4" aria-hidden />
            Ideias de viagem
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-2">
          {ideas.filter(hubOk).map((idea) => (
            <Plan key={idea.id}>
              <div className="flex flex-wrap items-center justify-between gap-2 font-medium">
                <span>
                  {idea.emoji ?? '📍'} {idea.titulo}
                </span>
                <span className="text-brand-ink text-xs">{idea.meta}</span>
              </div>
              <p className="text-sm">{idea.porque}</p>
              <p className="text-muted-foreground text-sm">Melhor caminho: {idea.caminho}</p>
              {idea.quando && (
                <p className="text-muted-foreground text-sm">Melhor época: {idea.quando}</p>
              )}
              <Button asChild size="sm" variant="outline" className="w-fit">
                <Link
                  href={planHref(
                    hub === 'Todas'
                      ? 'Goiânia (GYN)'
                      : ({ GYN: 'Goiânia (GYN)', BSB: 'Brasília (BSB)', VCP: 'Campinas – Viracopos (VCP)' } as Record<string, string>)[hub],
                    idea.destino ?? '',
                  )}
                >
                  Planejar
                </Link>
              </Button>
            </Plan>
          ))}
        </CardContent>
      </Card>
      <p className="text-muted-foreground text-xs">
        <Flag className="mr-1 inline size-3" aria-hidden />
        Saídas de Goiânia, Brasília e Campinas. {lightText.ok}, {lightText.warn} e {lightText.bad}{' '}
        seguem a régua de viabilidade de cada rota.
      </p>
    </div>
  );
};
