'use client';

import { useMemo, useState, useTransition } from 'react';
import { ArrowLeftRight, Bell, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';

import { AirportInput } from '@/components/miles/airport-input';
import { AirlineBadge, ExternalLink, LightDot, Plan, Tag, lightTextClass } from '@/components/miles/bits';
import { PriceGrid, type GridCell } from '@/components/miles/price-grid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { formatDateTime, formatNumber } from '@/lib/format';
import {
  azulLink,
  brDate,
  cityName,
  codeFrom,
  dayPrices,
  knownRoutes,
  latestOf,
  latamLink,
  light,
  lightText,
  programKeys,
  programLink,
  programName,
  ruler,
  smilesLink,
  type PriceData,
} from '@/lib/miles/radar';
import type { Vigia } from '@/lib/miles/user-data';
import { saveUserDoc } from '@/server/actions/user-docs';

interface CalendarViewProps {
  data: PriceData;
  today: string;
  watches: Vigia[];
  initialFrom?: string;
  initialTo?: string;
}

const monthOf = (day: string) => day.slice(0, 7);
const addMonths = (month: string, delta: number) => {
  const [year, number] = month.split('-').map(Number);
  const date = new Date(year, number - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

export const CalendarView = ({ data, today, watches, initialFrom = '', initialTo = '' }: CalendarViewProps) => {
  const [fromText, setFromText] = useState(initialFrom);
  const [toText, setToText] = useState(initialTo);
  const [program, setProgram] = useState('Todos');
  const [selected, setSelected] = useState<string | null>(null);
  const [manualMonth, setManualMonth] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const o = codeFrom(fromText) ?? '';
  const d = codeFrom(toText) ?? '';
  const prices = useMemo(
    () => (o && d ? dayPrices(data, o, d, program) : {}),
    [data, o, d, program],
  );
  const days = Object.keys(prices).filter((day) => day >= today).sort();
  const rule = ruler(o, d);
  const minimum = days.length ? Math.min(...days.map((day) => prices[day][0].milhas)) : 0;

  const lastChecked = latestOf(
    (data.historico.find((history) => history.id === `${o}-${d}`)?.pontos ?? []).map(
      (point) => point.consultado,
    ),
  );

  const month = manualMonth ?? (days[0] ? monthOf(days[0]) : monthOf(today));
  const months = [month, addMonths(month, 1)];

  const cells: Record<string, GridCell> = {};
  for (const day of days) {
    cells[day] = { miles: prices[day][0].milhas, light: light(prices[day][0].milhas, rule.ref) };
  }

  const watching = watches.some((watch) => codeFrom(watch.origem) === o && codeFrom(watch.destino) === d);
  const hasDays = days.length > 0;
  const similar = useMemo(() => {
    if (hasDays) {
      return [];
    }
    const routes = knownRoutes(data, today);
    return routes
      .filter((route) => (route.d === d || route.o === o) && !(route.o === o && route.d === d))
      .sort((a, b) => Number(b.d === d) - Number(a.d === d) || a.min - b.min)
      .slice(0, 6);
  }, [data, today, o, d, hasDays]);

  const pick = (from: string, to: string) => {
    setFromText(from);
    setToText(to);
    setSelected(null);
    setManualMonth(null);
  };

  const watchRoute = () => {
    startTransition(async () => {
      const result = await saveUserDoc({
        kind: 'vigia',
        key: `${o}-${d}`,
        data: { origem: fromText.trim(), destino: toText.trim(), datas: 'calendário', meta: 0 },
      });
      if (result.ok) {
        toast.success('Rota vigiada. Ela entra na varredura quando a busca automática for ligada.');
      } else {
        toast.error(result.error);
      }
    });
  };

  const selectedPrices = selected ? (prices[selected] ?? []) : [];

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="text-brand-ink size-4" aria-hidden />
            Calendário de preços em milhas
          </CardTitle>
          <CardDescription>
            Menor preço encontrado por dia, só ida, por trecho. Verde é bom preço, amarelo é
            aceitável e vermelho é caro, pela régua de viabilidade da rota. Toque num dia para ver
            os detalhes e abrir a busca no site da companhia.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="cal-from">Saindo de</FieldLabel>
              <AirportInput
                id="cal-from"
                value={fromText}
                onChange={setFromText}
                onPick={() => {
                  setSelected(null);
                  setManualMonth(null);
                }}
                placeholder="Ex.: Brasília (BSB)"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="cal-to">Indo para</FieldLabel>
              <AirportInput
                id="cal-to"
                value={toText}
                onChange={setToText}
                onPick={() => {
                  setSelected(null);
                  setManualMonth(null);
                }}
                placeholder="Ex.: Natal – Pipa (NAT)"
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
                }}
              >
                {name === 'Todos' ? 'Todos os programas' : name}
              </Button>
            ))}
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                pick(toText, fromText);
              }}
            >
              <ArrowLeftRight />
              Inverter (volta)
            </Button>
          </div>
        </CardContent>
      </Card>

      {!o || !d ? (
        <Card>
          <CardContent className="text-muted-foreground py-8 text-center text-sm">
            Escolha a origem e o destino na lista, com o código do aeroporto.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardDescription aria-live="polite">
              {days.length > 0
                ? `${days.length} ${days.length === 1 ? 'dia' : 'dias'} com preço · mais barato ${formatNumber(minimum)} milhas · régua ${rule.nome}: bom até ${formatNumber(rule.ref)}`
                : `Nenhum preço registrado ainda para ${o} → ${d}.`}
              {lastChecked && ` · última consulta ao vivo desta rota em ${formatDateTime(lastChecked)} (hora não registrada)`}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {days.length === 0 && (
              <Plan highlight>
                <p className="font-medium">
                  Ainda sem preços de {o} → {d}
                </p>
                <p className="text-sm">
                  Este trajeto ainda não foi consultado. Abra a busca de uma data direto no site da
                  companhia ou marque a rota para a varredura preencher o calendário.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    ['LATAM', latamLink(o, d, today)],
                    ['Azul', azulLink(o, d, today)],
                    ['Smiles', smilesLink(o, d, today)],
                  ].map(([name, href]) => (
                    <Button key={name} asChild variant="outline" size="sm">
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        Buscar na {name}
                      </a>
                    </Button>
                  ))}
                </div>
                {similar.length > 0 && (
                  <div className="grid gap-2 pt-2">
                    <p className="text-muted-foreground text-xs">Trajetos parecidos com preço:</p>
                    <div className="flex flex-wrap gap-2">
                      {similar.map((route) => (
                        <Button
                          key={`${route.o}-${route.d}`}
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            pick(cityName(route.o), cityName(route.d));
                          }}
                        >
                          {route.o}→{route.d} · {formatNumber(route.min)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </Plan>
            )}

            {days.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {days.slice(0, 24).map((day) => {
                  const miles = prices[day][0].milhas;
                  return (
                    <Button
                      key={day}
                      type="button"
                      size="xs"
                      variant={day === selected ? 'default' : 'outline'}
                      onClick={() => {
                        setManualMonth(monthOf(day));
                        setSelected(day);
                      }}
                    >
                      <LightDot value={light(miles, rule.ref)} />
                      {day.slice(8)}/{day.slice(5, 7)} · {formatNumber(miles)}
                    </Button>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-label="Mês anterior"
                onClick={() => {
                  setManualMonth(addMonths(month, -1));
                }}
              >
                ‹
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-label="Próximo mês"
                onClick={() => {
                  setManualMonth(addMonths(month, 1));
                }}
              >
                ›
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {months.map((value) => (
                <PriceGrid
                  key={value}
                  month={value}
                  cells={cells}
                  today={today}
                  selected={selected}
                  onSelect={setSelected}
                />
              ))}
            </div>

            {selected && (
              <Plan>
                <div className="flex flex-wrap items-center justify-between gap-2 font-medium">
                  <span>
                    {o} → {d} ·{' '}
                    {new Date(`${selected}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'short' })}{' '}
                    {brDate(selected)}
                  </span>
                  {selectedPrices.length > 0 ? (
                    <span className="brand-text tabular-nums">
                      {formatNumber(selectedPrices[0].milhas)} milhas
                    </span>
                  ) : (
                    <Tag>sem preço registrado</Tag>
                  )}
                </div>
                {selectedPrices.map((price) => {
                  const tone = light(price.milhas, rule.ref);
                  return (
                    <div key={`${price.prog}-${price.milhas}`} className="flex flex-wrap items-center gap-2 text-sm">
                      <AirlineBadge name={price.prog} />
                      <LightDot value={tone} />
                      <strong className={lightTextClass(tone)}>{formatNumber(price.milhas)} milhas</strong>
                      <span className="text-muted-foreground">
                        {lightText[tone]} · {price.fonte}
                      </span>
                      <ExternalLink
                        href={
                          price.live && price.url
                            ? price.url
                            : programLink(price.prog, o, d, selected)
                        }
                      >
                        abrir na {programName(price.prog)}
                      </ExternalLink>
                    </div>
                  );
                })}
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button asChild size="sm">
                    <a href={latamLink(o, d, selected)} target="_blank" rel="noopener noreferrer">
                      Buscar na LATAM
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <a href={azulLink(o, d, selected)} target="_blank" rel="noopener noreferrer">
                      Azul
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <a href={smilesLink(o, d, selected)} target="_blank" rel="noopener noreferrer">
                      Smiles
                    </a>
                  </Button>
                </div>
              </Plan>
            )}

            <div>
              <Button type="button" variant="outline" size="sm" disabled={watching || isPending} onClick={watchRoute}>
                <Bell />
                {watching ? 'Trajeto já está vigiado' : 'Vigiar este trajeto'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      <p className="text-muted-foreground text-xs">
        De onde vêm os preços: buscas ao vivo da varredura (✅) e alertas de blogs (📰). Dias sem
        preço ainda não foram consultados. O GO GO MILES só mostra e leva você ao site da
        companhia: a compra é sempre feita lá, e o preço pode mudar a qualquer momento.
      </p>
    </div>
  );
};
