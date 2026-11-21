'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Bell, CreditCard, FolderOpen, Lock, User } from 'lucide-react';
import { toast } from 'sonner';

import { AirportInput } from '@/components/miles/airport-input';
import { AirlineBadge, Plan } from '@/components/miles/bits';
import { MetricCard } from '@/components/dashboard/metric-card';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate, formatNumber } from '@/lib/format';
import { codeFrom, profileFields, programs } from '@/lib/miles/radar';
import type { UserData } from '@/lib/miles/user-data';
import { deleteUserDoc, saveUserDoc } from '@/server/actions/user-docs';

const money = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

interface Row {
  saldo: string;
  vence: string;
  categoria: string;
  cpm: string;
}

export const Wallet = ({ data }: { data: UserData }) => {
  const [rows, setRows] = useState<Record<string, Row>>(() =>
    Object.fromEntries(
      programs.map((program) => {
        const saved = data.saldos[program.id];
        return [
          program.id,
          {
            saldo: saved ? String(saved.saldo) : '',
            vence: saved?.vence ?? '',
            categoria: saved?.categoria ?? '',
            cpm: String(saved?.cpm ?? program.cpm),
          },
        ];
      }),
    ),
  );
  const [profile, setProfile] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      profileFields.map((field) => [field.id, data.perfil[field.id] ?? field.opts[0]]),
    ),
  );
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [dates, setDates] = useState('');
  const [goal, setGoal] = useState('');
  const [isPending, startTransition] = useTransition();

  const total = programs.reduce((sum, program) => sum + (Number(rows[program.id].saldo) || 0), 0);
  const value = programs.reduce(
    (sum, program) =>
      sum + ((Number(rows[program.id].saldo) || 0) / 1000) * (Number(rows[program.id].cpm) || 0),
    0,
  );
  const nextExpiry = programs
    .map((program) => ({ program, vence: rows[program.id].vence }))
    .filter((entry) => entry.vence)
    .sort((a, b) => a.vence.localeCompare(b.vence))[0];

  const setRow = (id: string, patch: Partial<Row>) => {
    setRows((current) => ({ ...current, [id]: { ...current[id], ...patch } }));
  };

  const saveBalances = () => {
    startTransition(async () => {
      const results = await Promise.all(
        programs.map((program) => {
          const row = rows[program.id];
          return saveUserDoc({
            kind: 'saldo',
            key: program.id,
            data: {
              saldo: Number(row.saldo) || 0,
              vence: row.vence,
              categoria: row.categoria.trim(),
              cpm: Number(row.cpm) || program.cpm,
            },
          });
        }),
      );
      const failure = results.find((result) => !result.ok);
      if (failure && !failure.ok) {
        toast.error(failure.error);
        return;
      }
      toast.success('Saldos salvos.');
    });
  };

  const saveProfile = () => {
    startTransition(async () => {
      const result = await saveUserDoc({ kind: 'perfil', key: 'perfil', data: profile });
      if (result.ok) {
        toast.success('Perfil salvo.');
      } else {
        toast.error(result.error);
      }
    });
  };

  const addWatch = () => {
    const o = codeFrom(from);
    const d = codeFrom(to);
    if (!o || !d) {
      toast.error('Escolha origem e destino na lista de aeroportos.');
      return;
    }
    startTransition(async () => {
      const result = await saveUserDoc({
        kind: 'vigia',
        key: `${o}-${d}`,
        data: { origem: from.trim(), destino: to.trim(), datas: dates.trim(), meta: Number(goal) || 0 },
      });
      if (result.ok) {
        toast.success('Rota vigiada.');
        setFrom('');
        setTo('');
        setDates('');
        setGoal('');
      } else {
        toast.error(result.error);
      }
    });
  };

  const remove = (kind: 'vigia' | 'plano', key: string) => {
    startTransition(async () => {
      const result = await deleteUserDoc({ kind, key });
      if (!result.ok) {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="grid gap-6">
      <p className="surface text-success flex items-center gap-2 rounded-xl border px-4 py-2 text-sm">
        <Lock className="size-4" aria-hidden />
        Área privada: cada pessoa vê só o que salvou aqui. Nunca guardamos login nem senha dos
        programas.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Pontos + milhas" value={total ? formatNumber(total) : '—'} icon={CreditCard} />
        <MetricCard
          label="Valor estimado"
          value={total ? money(value) : '—'}
          icon={CreditCard}
          detail="saldo × R$ por milheiro de referência"
        />
        <MetricCard
          label="Próximo vencimento"
          value={nextExpiry ? formatDate(`${nextExpiry.vence}T12:00:00Z`) : '—'}
          icon={CreditCard}
          detail={nextExpiry?.program.nome}
        />
        <MetricCard label="Planos salvos" value={String(data.planos.length)} icon={FolderOpen} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="text-brand-ink size-4" aria-hidden />
            Meus saldos
          </CardTitle>
          <CardDescription>
            Informe o saldo à mão. É assim que o sistema calcula, sem precisar do seu login nas
            companhias.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Programa</TableHead>
                  <TableHead>Saldo</TableHead>
                  <TableHead>Vence (próximo lote)</TableHead>
                  <TableHead>Categoria / clube</TableHead>
                  <TableHead>R$ por milheiro (ref.)</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs.map((program) => {
                  const row = rows[program.id];
                  return (
                    <TableRow key={program.id}>
                      <TableCell className="font-medium">
                        {program.tipo === 'cia' ? <AirlineBadge name={program.nome} /> : program.nome}
                      </TableCell>
                      <TableCell>
                        <Input
                          aria-label={`Saldo ${program.nome}`}
                          inputMode="numeric"
                          className="w-32"
                          value={row.saldo}
                          onChange={(e) => { setRow(program.id, { saldo: e.target.value.replace(/\D/g, '') }); }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          aria-label={`Vencimento ${program.nome}`}
                          type="date"
                          className="w-40"
                          value={row.vence}
                          onChange={(e) => { setRow(program.id, { vence: e.target.value }); }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          aria-label={`Categoria ${program.nome}`}
                          className="w-40"
                          maxLength={40}
                          value={row.categoria}
                          onChange={(e) => { setRow(program.id, { categoria: e.target.value }); }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          aria-label={`Milheiro ${program.nome}`}
                          inputMode="decimal"
                          className="w-24"
                          value={row.cpm}
                          onChange={(e) => { setRow(program.id, { cpm: e.target.value.replace(',', '.') }); }}
                        />
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {Number(row.saldo) ? money((Number(row.saldo) / 1000) * (Number(row.cpm) || 0)) : '—'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div>
            <Button type="button" disabled={isPending} onClick={saveBalances}>
              Salvar saldos
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="text-brand-ink size-4" aria-hidden />
            Meu perfil nos programas
          </CardTitle>
          <CardDescription>
            Define qual faixa de bônus vale para você e entra no cálculo do planejador.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {profileFields.map((field) => (
              <Field key={field.id}>
                <FieldLabel htmlFor={`profile-${field.id}`}>{field.label}</FieldLabel>
                <Select
                  value={profile[field.id]}
                  onValueChange={(next) => {
                    setProfile((current) => ({ ...current, [field.id]: next }));
                  }}
                >
                  <SelectTrigger id={`profile-${field.id}`} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {field.opts.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            ))}
          </div>
          <div>
            <Button type="button" disabled={isPending} onClick={saveProfile}>
              Salvar perfil
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="text-brand-ink size-4" aria-hidden />
            Rotas vigiadas
          </CardTitle>
          <CardDescription>
            Só a rota fica guardada, sem dados pessoais. Quando a busca automática estiver ligada,
            ela consulta estas rotas e avisa quando o preço chegar na meta.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-4">
            <Field>
              <FieldLabel htmlFor="watch-from">Origem</FieldLabel>
              <AirportInput id="watch-from" value={from} onChange={setFrom} placeholder="Ex.: Brasília (BSB)" />
            </Field>
            <Field>
              <FieldLabel htmlFor="watch-to">Destino</FieldLabel>
              <AirportInput id="watch-to" value={to} onChange={setTo} placeholder="Ex.: Salvador (SSA)" />
            </Field>
            <Field>
              <FieldLabel htmlFor="watch-dates">Datas ou mês</FieldLabel>
              <Input id="watch-dates" value={dates} maxLength={40} placeholder="Ex.: mar/2027" onChange={(e) => { setDates(e.target.value); }} />
            </Field>
            <Field>
              <FieldLabel htmlFor="watch-goal">Meta (milhas por trecho)</FieldLabel>
              <Input id="watch-goal" inputMode="numeric" value={goal} placeholder="10000" onChange={(e) => { setGoal(e.target.value.replace(/\D/g, '')); }} />
            </Field>
          </div>
          <div>
            <Button type="button" disabled={isPending} onClick={addWatch}>
              Vigiar rota
            </Button>
          </div>
          {data.vigias.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhuma rota vigiada ainda.</p>
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {data.vigias.map((watch) => (
                <Plan key={watch.key}>
                  <div className="flex items-center justify-between gap-2 font-medium">
                    <span>
                      {watch.origem} → {watch.destino}
                    </span>
                    <span className="text-brand-ink text-xs">
                      {watch.meta ? `meta ${formatNumber(watch.meta)}` : 'aguardando varredura'}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs">{watch.datas || 'datas flexíveis'}</p>
                  <div className="flex gap-2">
                    <Button asChild size="xs" variant="outline">
                      <Link href={`/app/calendario?origem=${encodeURIComponent(watch.origem)}&destino=${encodeURIComponent(watch.destino)}`}>
                        Calendário
                      </Link>
                    </Button>
                    <Button type="button" size="xs" variant="outline" disabled={isPending} onClick={() => { remove('vigia', watch.key); }}>
                      Remover
                    </Button>
                  </div>
                </Plan>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="text-brand-ink size-4" aria-hidden />
            Meus planos de viagem
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {data.planos.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Nenhum plano salvo. Monte uma estratégia em Planejar viagem e toque em Salvar.
            </p>
          ) : (
            data.planos.map((plan) => (
              <Plan key={plan.key}>
                <div className="flex items-center justify-between gap-2 font-medium">
                  <span>{plan.titulo}</span>
                  <span className="text-muted-foreground text-xs">{formatDate(plan.criado)}</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  {String((plan.resultado as { resumo?: string }).resumo ?? '')}
                </p>
                <div className="flex gap-2">
                  <Button asChild size="xs" variant="outline">
                    <Link href={`/app/planejar?plano=${encodeURIComponent(plan.key)}`}>Abrir</Link>
                  </Button>
                  <Button type="button" size="xs" variant="outline" disabled={isPending} onClick={() => { remove('plano', plan.key); }}>
                    Excluir
                  </Button>
                </div>
              </Plan>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
