'use client';

import { useState, useTransition, type FormEvent } from 'react';
import {
  Bell,
  CheckSquare,
  Coins,
  Compass,
  Lightbulb,
  MapPin,
  OctagonMinus,
  Plane,
  Route,
  Shuffle,
  Target,
} from 'lucide-react';
import { toast } from 'sonner';

import { AirportInput } from '@/components/miles/airport-input';
import { AirlineBadge, AirlineBadges, ExternalLink, LightDot, Plan, Tag } from '@/components/miles/bits';
import { DestinationClimate } from '@/components/miles/destination-climate';
import { LastUpdated } from '@/components/miles/last-updated';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { monthFromText } from '@/lib/miles/climate';
import {
  planCabins,
  type PlanRequest,
  type PlanResult,
} from '@/lib/miles/plan';
import {
  brDate,
  codeFrom,
  light,
  lightText,
  airlineOf,
  programName,
  programs,
  realPrices,
  ruler,
  type PriceData,
} from '@/lib/miles/radar';
import { planTrip } from '@/server/actions/plan';
import { saveUserDoc } from '@/server/actions/user-docs';

interface PlannerProps {
  data: PriceData;
  today: string;
  plannerReady: boolean;
  initial: { origem: string; destino: string };
  /** Plano salvo aberto pela carteira. */
  saved: { request: PlanRequest; plan: PlanResult; at: string } | null;
  /** Momento da última varredura do radar usado pelo agente. */
  radarAt?: string;
}

const PriceCard = ({
  data,
  today,
  request,
  plan,
}: {
  data: PriceData;
  today: string;
  request: PlanRequest;
  plan: PlanResult;
}) => {
  const o = codeFrom(request.origem);
  const d = codeFrom(request.destino);
  if (!o || !d) {
    return null;
  }
  const rule = ruler(o, d, request.classe);
  const real = realPrices(data, o, d, today);
  return (
    <Card className="border-primary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="text-brand-ink size-4" aria-hidden />
          Preços em milhas · {o} → {d}
        </CardTitle>
        <p className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
          Régua de viabilidade ({rule.nome}): <LightDot value="ok" /> até {formatNumber(rule.ref)} ·{' '}
          <LightDot value="warn" /> até {formatNumber(Math.round(rule.ref * 1.5))} ·{' '}
          <LightDot value="bad" /> acima disso. Valores por trecho, por pessoa.
        </p>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <h3 className="text-sm font-semibold">Encontrados de verdade</h3>
          {real.length === 0 && (
            <p className="text-muted-foreground text-sm">
              Nenhum preço real registrado ainda para este trecho. A estimativa abaixo dá a noção.
            </p>
          )}
          {real.slice(0, 6).map((price) => {
            const tone = light(price.milhas, rule.ref);
            return (
              <Plan key={`${price.dia}-${price.programa}-${price.milhas}`} className="py-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="flex flex-wrap items-center gap-2">
                    <AirlineBadge name={price.cia} />
                    {price.dia ? brDate(price.dia) : price.quando} · {price.programa}
                  </span>
                  <span className="flex items-center gap-1.5 font-bold tabular-nums">
                    <LightDot value={tone} />
                    {formatNumber(price.milhas)}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs">
                  {price.fonte} · {lightText[tone]}{' '}
                  {price.url && <ExternalLink href={price.url}>abrir na {programName(price.programa)}</ExternalLink>}
                </p>
              </Plan>
            );
          })}
        </div>
        <div className="grid gap-2">
          <h3 className="text-sm font-semibold">Quem opera e quanto costuma custar</h3>
          <div className="grid gap-3 lg:grid-cols-2">
            {(plan.operadoras ?? []).map((operator) => {
              const notOperating = /não|nao/i.test(operator.opera ?? '');
              const airline = airlineOf(operator.cia);
              const best = real.find((price) => price.cia === airline);
              return (
                <Plan key={`${operator.cia}-${operator.programa}`} className={notOperating ? 'opacity-55' : ''}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-sm">
                      <AirlineBadge name={operator.cia} /> {operator.programa}
                    </span>
                    <Tag tone={notOperating ? 'muted' : /direto/i.test(operator.opera ?? '') ? 'ok' : 'blue'}>
                      {notOperating
                        ? 'não opera'
                        : /direto/i.test(operator.opera ?? '')
                          ? 'voo direto'
                          : `conexão${operator.via ? ` via ${operator.via}` : ''}`}
                    </Tag>
                  </div>
                  {!notOperating && (
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {(
                        [
                          ['promoção', operator.min],
                          ['típico', operator.tipico],
                          ['alta', operator.max],
                        ] as const
                      ).map(([label, value]) => (
                        <div key={label} className="bg-card rounded-lg border p-1.5">
                          <div className="text-muted-foreground text-[10px] uppercase">{label}</div>
                          <div className="text-sm font-bold tabular-nums">
                            {value ? formatNumber(Number(value)) : '—'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {best && (
                    <p className="text-xs">
                      Menor encontrado: {formatNumber(best.milhas)}
                      {best.dia ? ` em ${brDate(best.dia)}` : ''}
                    </p>
                  )}
                  {operator.obs && <p className="text-muted-foreground text-xs">💡 {operator.obs}</p>}
                </Plan>
              );
            })}
          </div>
          <p className="text-muted-foreground text-xs">
            Faixas por companhia são estimativas do agente: o preço dinâmico muda todo dia. Os
            valores com ✅ são buscas reais no site.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const PlanOutput = ({
  data,
  today,
  request,
  plan,
  fromSaved,
  at,
  radarAt,
}: {
  data: PriceData;
  today: string;
  request: PlanRequest;
  plan: PlanResult;
  fromSaved: boolean;
  at: string;
  radarAt?: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [watched, setWatched] = useState(false);

  const save = () => {
    startTransition(async () => {
      const result = await saveUserDoc({
        kind: 'plano',
        key: `plano_${Date.now()}`,
        data: {
          titulo: `${request.origem} → ${request.destino}${request.ida ? ` · ${request.ida}` : ''}`,
          pedido: request,
          resultado: plan,
        },
      });
      if (result.ok) {
        setSaved(true);
        toast.success('Plano salvo na sua carteira.');
      } else {
        toast.error(result.error);
      }
    });
  };

  const watch = () => {
    const o = codeFrom(request.origem);
    const d = codeFrom(request.destino);
    if (!o || !d) {
      toast.error('Escolha origem e destino na lista para vigiar a rota.');
      return;
    }
    startTransition(async () => {
      const result = await saveUserDoc({
        kind: 'vigia',
        key: `${o}-${d}`,
        data: {
          origem: request.origem,
          destino: request.destino,
          datas: [request.ida, request.volta].filter(Boolean).join(' → '),
          meta: 0,
        },
      });
      if (result.ok) {
        setWatched(true);
        toast.success('Rota vigiada.');
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="grid gap-4">
      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="text-brand-ink size-4" aria-hidden />
            {request.origem} → {request.destino}
            {request.parada ? ` (parada: ${request.parada})` : ''}
          </CardTitle>
          <p className="text-muted-foreground text-xs">
            {[request.ida, request.volta].filter(Boolean).join(' → ')} · {request.adultos} adulto(s)
            {request.criancas ? ` + ${request.criancas} criança(s)` : ''} · {request.classe}
          </p>
        </CardHeader>
        <CardContent className="grid gap-3">
          <LastUpdated
            entries={[
              { label: fromSaved ? 'Plano salvo em' : 'Estratégia gerada em', at },
              { label: 'Radar usado', at: radarAt },
            ]}
          />
          {plan.resumo && <p>{plan.resumo}</p>}
          {!fromSaved && (
            <div className="flex flex-wrap gap-2">
              <Button type="button" disabled={saved || isPending} onClick={save}>
                {saved ? '✓ Salvo' : 'Salvar na minha carteira'}
              </Button>
              <Button type="button" variant="outline" disabled={watched || isPending} onClick={watch}>
                <Bell />
                {watched ? '✓ Rota vigiada' : 'Vigiar esta rota'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <PriceCard data={data} today={today} request={request} plan={plan} />

      <div className="grid gap-4 lg:grid-cols-2">
        {plan.aeroportos && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="text-brand-ink size-4" aria-hidden />
                Aeroportos
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {(
                [
                  ['Saída', plan.aeroportos.saida],
                  ['Chegada', plan.aeroportos.chegada],
                ] as const
              ).map(([label, list]) =>
                list && list.length > 0 ? (
                  <div key={label} className="grid gap-2">
                    <h3 className="text-sm font-semibold">{label}</h3>
                    {list.map((airport) => (
                      <Plan key={airport.codigo}>
                        <p className="font-medium">
                          {airport.codigo} · {airport.nome}
                        </p>
                        <p className="text-muted-foreground text-sm">{airport.porque}</p>
                      </Plan>
                    ))}
                  </div>
                ) : null,
              )}
            </CardContent>
          </Card>
        )}
        {((plan.bonus && plan.bonus.length > 0) || plan.datas) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="text-brand-ink size-4" aria-hidden />
                Bônus e datas
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {plan.bonus?.map((bonus) => (
                <Plan key={bonus.acao}>
                  <p className="font-medium">{bonus.acao}</p>
                  <p className="text-muted-foreground text-sm">{bonus.detalhe}</p>
                </Plan>
              ))}
              {plan.datas && (
                <p className="bg-muted/40 rounded-lg border border-dashed p-3 text-sm">
                  <strong>Quando emitir: </strong>
                  {plan.datas}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {plan.rotas && plan.rotas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="text-brand-ink size-4" aria-hidden />
              Rotas e programas
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {plan.rotas.map((route) => (
              <Plan key={route.titulo ?? route.programa} highlight={route.melhor}>
                <div className="flex flex-wrap items-center justify-between gap-2 font-medium">
                  <span>
                    {route.melhor ? '⭐ ' : ''}
                    {route.titulo ?? route.programa}
                  </span>
                  <span className="brand-text">{route.milhasPorTrechoPorPessoa}</span>
                </div>
                <p className="text-muted-foreground text-xs">
                  <AirlineBadges text={`${route.programa ?? ''} ${route.cias ?? ''}`} />
                  {route.taxas ? ` · taxas ${route.taxas}` : ''}
                  {route.totalEstimado ? ` · total ${route.totalEstimado}` : ''}
                </p>
                {route.trechos && (
                  <div className="flex flex-wrap items-center gap-1.5 text-sm font-semibold">
                    {route.trechos.map((leg, index) => (
                      <span key={leg} className="flex items-center gap-1.5">
                        {index > 0 && <span className="text-muted-foreground">·</span>}
                        {leg.split(/→|->/).map((stop, stopIndex) => (
                          <span key={`${stop}-${stopIndex}`} className="flex items-center gap-1.5">
                            {stopIndex > 0 && <span className="text-muted-foreground">→</span>}
                            <span className="bg-card rounded-md border px-2 py-0.5 text-xs">{stop.trim()}</span>
                          </span>
                        ))}
                      </span>
                    ))}
                  </div>
                )}
                {route.pros && (
                  <ul className="text-sm">
                    {route.pros.map((item) => (
                      <li key={item}>✓ {item}</li>
                    ))}
                  </ul>
                )}
                {route.contras && (
                  <ul className="text-muted-foreground text-sm">
                    {route.contras.map((item) => (
                      <li key={item}>✗ {item}</li>
                    ))}
                  </ul>
                )}
              </Plan>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {plan.paradas && plan.paradas.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="text-brand-ink size-4" aria-hidden />
                Paradas sugeridas
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {plan.paradas.map((stop) => (
                <Plan key={stop.cidade}>
                  <div className="flex items-center justify-between gap-2 font-medium">
                    <span>
                      {stop.cidade}
                      {stop.codigo ? ` (${stop.codigo})` : ''}
                    </span>
                    <span className="text-muted-foreground text-xs">{stop.diasSugeridos}</span>
                  </div>
                  <p className="text-sm">{stop.porque}</p>
                  <p className="text-muted-foreground text-sm">{stop.comoEncaixar}</p>
                </Plan>
              ))}
            </CardContent>
          </Card>
        )}
        {plan.stopover && plan.stopover.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <OctagonMinus className="text-brand-ink size-4" aria-hidden />
                Stopover possível
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {plan.stopover.map((stop) => (
                <Plan key={stop.onde}>
                  <p className="font-medium">{stop.onde}</p>
                  <p className="text-sm">{stop.regra}</p>
                  <p className="text-muted-foreground text-sm">{stop.comoFazer}</p>
                </Plan>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {plan.alternativas && plan.alternativas.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shuffle className="text-brand-ink size-4" aria-hidden />
                Aeroportos alternativos e trechos separados
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {plan.alternativas.map((alt) => (
                <Plan key={alt.rota}>
                  <div className="flex items-center justify-between gap-2 font-medium">
                    <span>{alt.rota}</span>
                    <span className="brand-text text-sm">{alt.economia}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{alt.porque}</p>
                </Plan>
              ))}
            </CardContent>
          </Card>
        )}
        {(plan.regras?.length || plan.timing || plan.valeMilha) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="text-brand-ink size-4" aria-hidden />
                Regras, timing e milha x dinheiro
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              {plan.timing && (
                <p className="bg-muted/40 rounded-lg border border-dashed p-3">
                  <strong>Quando emitir: </strong>
                  {plan.timing}
                </p>
              )}
              {plan.valeMilha && (
                <p className="bg-muted/40 rounded-lg border border-dashed p-3">
                  <strong>Milha ou dinheiro: </strong>
                  {plan.valeMilha}
                </p>
              )}
              {plan.regras && (
                <ul className="list-disc pl-5">
                  {plan.regras.map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {((plan.passos && plan.passos.length > 0) || (plan.alertas && plan.alertas.length > 0)) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="text-brand-ink size-4" aria-hidden />
              Passo a passo
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            {plan.passos && (
              <ol className="list-decimal pl-5">
                {plan.passos.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            )}
            {plan.alertas && plan.alertas.length > 0 && (
              <div className="grid gap-1">
                <h3 className="font-semibold">Atenção</h3>
                <ul className="list-disc pl-5">
                  {plan.alertas.map((alert) => (
                    <li key={alert}>{alert}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      <p className="text-muted-foreground text-xs">
        Milhas e taxas são estimativas do agente com base no radar. Confirme disponibilidade e preço
        no site do programa antes de transferir pontos ou emitir. O GO GO MILES nunca compra nem
        emite: a compra é feita no site oficial da companhia.
      </p>
    </div>
  );
};

export const Planner = ({ data, today, plannerReady, initial, saved, radarAt }: PlannerProps) => {
  const [origin, setOrigin] = useState(saved?.request.origem ?? initial.origem);
  const [destination, setDestination] = useState(saved?.request.destino ?? initial.destino);
  const [stop, setStop] = useState(saved?.request.parada ?? '');
  const [depart, setDepart] = useState(saved?.request.ida ?? '');
  const [back, setBack] = useState(saved?.request.volta ?? '');
  const [adults, setAdults] = useState(String(saved?.request.adultos ?? 1));
  const [children, setChildren] = useState(String(saved?.request.criancas ?? 0));
  const [cabin, setCabin] = useState<string>(saved?.request.classe ?? planCabins[0]);
  const [chosen, setChosen] = useState<string[]>(
    saved?.request.programas ?? programs.map((program) => program.nome),
  );
  const [suggestStop, setSuggestStop] = useState(true);
  const [stopover, setStopover] = useState(true);
  const [flex, setFlex] = useState(true);
  const [result, setResult] = useState<{ request: PlanRequest; plan: PlanResult; at: string } | null>(saved);
  const [fromSaved, setFromSaved] = useState(Boolean(saved));
  const [isPending, startTransition] = useTransition();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const request: PlanRequest = {
      origem: origin.trim(),
      destino: destination.trim(),
      parada: stop.trim(),
      ida: depart.trim(),
      volta: back.trim(),
      adultos: Math.max(1, Number(adults) || 1),
      criancas: Math.max(0, Number(children) || 0),
      classe: planCabins.find((value) => value === cabin) ?? planCabins[0],
      programas: chosen,
      sugerirParada: suggestStop,
      stopover,
      flex,
    };
    if (!request.origem || !request.destino) {
      toast.error('Escolha a cidade de partida e o destino.');
      return;
    }
    startTransition(async () => {
      setResult(null);
      const answer = await planTrip(request);
      if (answer.ok) {
        setResult({ request, plan: answer.plan, at: new Date().toISOString() });
        setFromSaved(false);
      } else {
        toast.error(answer.error);
      }
    });
  };

  const toggle = (value: string, list: string[], set: (next: string[]) => void) => {
    set(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="text-brand-ink size-4" aria-hidden />
            Para onde você quer ir?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="plan-origin">Cidade de partida</FieldLabel>
                <AirportInput id="plan-origin" value={origin} onChange={setOrigin} placeholder="Ex.: Goiânia" />
              </Field>
              <Field>
                <FieldLabel htmlFor="plan-destination">Destino</FieldLabel>
                <AirportInput id="plan-destination" value={destination} onChange={setDestination} placeholder="Ex.: Roma" />
              </Field>
              <Field>
                <FieldLabel htmlFor="plan-stop">Parada no caminho (opcional)</FieldLabel>
                <AirportInput id="plan-stop" value={stop} onChange={setStop} placeholder="Ex.: Lisboa, ou deixe vazio" />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-5">
              <Field className="sm:col-span-1">
                <FieldLabel htmlFor="plan-depart">Ida (data ou mês)</FieldLabel>
                <Input id="plan-depart" value={depart} maxLength={40} placeholder="set/2027 ou 10/09/2027" onChange={(e) => { setDepart(e.target.value); }} />
              </Field>
              <Field className="sm:col-span-1">
                <FieldLabel htmlFor="plan-back">Volta</FieldLabel>
                <Input id="plan-back" value={back} maxLength={40} placeholder="vazio = só ida" onChange={(e) => { setBack(e.target.value); }} />
              </Field>
              <Field>
                <FieldLabel htmlFor="plan-adults">Adultos</FieldLabel>
                <Input id="plan-adults" inputMode="numeric" value={adults} onChange={(e) => { setAdults(e.target.value.replace(/\D/g, '')); }} />
              </Field>
              <Field>
                <FieldLabel htmlFor="plan-children">Crianças (2 a 11)</FieldLabel>
                <Input id="plan-children" inputMode="numeric" value={children} onChange={(e) => { setChildren(e.target.value.replace(/\D/g, '')); }} />
              </Field>
              <Field>
                <FieldLabel htmlFor="plan-cabin">Classe</FieldLabel>
                <Select value={cabin} onValueChange={setCabin}>
                  <SelectTrigger id="plan-cabin" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {planCabins.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <fieldset className="grid gap-2">
              <legend className="text-sm font-medium">Programas que tenho</legend>
              <div className="flex flex-wrap gap-2">
                {programs.map((program) => (
                  <Button
                    key={program.id}
                    type="button"
                    size="sm"
                    aria-pressed={chosen.includes(program.nome)}
                    variant={chosen.includes(program.nome) ? 'default' : 'outline'}
                    onClick={() => {
                      toggle(program.nome, chosen, setChosen);
                    }}
                  >
                    {program.nome}
                  </Button>
                ))}
              </div>
            </fieldset>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ['Sugerir parada se houver promoção no trajeto', suggestStop, setSuggestStop],
                  ['Incluir stopover quando a regra permitir', stopover, setStopover],
                  ['Datas flexíveis (± alguns dias)', flex, setFlex],
                ] as const
              ).map(([label, value, set]) => (
                <Button
                  key={label}
                  type="button"
                  size="sm"
                  aria-pressed={value}
                  variant={value ? 'default' : 'outline'}
                  onClick={() => {
                    set(!value);
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={isPending || !plannerReady}>
                {isPending ? 'Pensando…' : 'Montar estratégia'}
              </Button>
              <span className="text-muted-foreground text-sm">
                {plannerReady
                  ? 'O agente cruza o seu pedido com as promoções do radar e as regras de stopover.'
                  : 'O agente ainda não está conectado: falta a chave da Anthropic no arquivo .env.local.'}
              </span>
            </div>
          </form>
        </CardContent>
      </Card>
      <DestinationClimate
        code={destination.trim().length >= 3 ? codeFrom(destination) : null}
        month={monthFromText(depart)}
      />
      {isPending && (
        <Card aria-live="polite">
          <CardContent className="text-brand-ink py-6">
            🧭 Montando a estratégia: aeroportos, programas, paradas e bônus. Pode levar até um minuto.
          </CardContent>
        </Card>
      )}
      {result && (
        <PlanOutput
          data={data}
          today={today}
          request={result.request}
          plan={result.plan}
          fromSaved={fromSaved}
          at={result.at}
          radarAt={radarAt}
        />
      )}
    </div>
  );
};
