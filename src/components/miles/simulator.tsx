'use client';

import { useState } from 'react';
import { Lightbulb, Scale, Calculator } from 'lucide-react';

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
import { programs } from '@/lib/miles/radar';

const money = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

interface SimulatorProps {
  /** Custo do milheiro (R$) informado pela pessoa na carteira, por programa. */
  cpmOverrides: Record<string, number>;
  /** Saldo guardado na carteira, por programa. */
  balances: Record<string, number>;
}

const num = (text: string) => {
  const value = Number(text.replace(',', '.'));
  return Number.isFinite(value) ? value : 0;
};

export const Simulator = ({ cpmOverrides, balances }: SimulatorProps) => {
  const banks = programs.filter((program) => program.tipo === 'banco');
  const airlines = programs.filter((program) => program.tipo === 'cia');
  const cpmOf = (id: string) =>
    cpmOverrides[id] || programs.find((program) => program.id === id)?.cpm || 0;

  const [from, setFrom] = useState<string>(banks[0].id);
  const [to, setTo] = useState<string>(airlines[0].id);
  const [points, setPoints] = useState('100000');
  const [bonus, setBonus] = useState('100');
  const [cpm, setCpm] = useState(String(cpmOf(banks[0].id)));
  const [leg, setLeg] = useState('65000');

  const [cash, setCash] = useState('1200');
  const [miles, setMiles] = useState('20000');
  const [fees, setFees] = useState('60');
  const [airline, setAirline] = useState<string>(airlines[0].id);

  const gained = Math.round(num(points) * (1 + num(bonus) / 100));
  const effective = num(cpm) / (1 + num(bonus) / 100);
  const target = programs.find((program) => program.id === to);
  const balance = balances[from];

  const milesAsked = num(miles);
  const obtained = milesAsked ? ((num(cash) - num(fees)) / milesAsked) * 1000 : 0;
  const reference = cpmOf(airline);
  const verdict =
    obtained >= reference * 1.1 ? 'use' : obtained >= reference * 0.9 ? 'tie' : 'cash';

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="text-brand-ink size-4" aria-hidden />
            Transferência com bônus
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="sim-from">De</FieldLabel>
              <Select
                value={from}
                onValueChange={(value) => {
                  setFrom(value);
                  setCpm(String(cpmOf(value)));
                }}
              >
                <SelectTrigger id="sim-from" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="sim-to">Para</FieldLabel>
              <Select value={to} onValueChange={setTo}>
                <SelectTrigger id="sim-to" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {airlines.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="sim-points">Pontos a transferir</FieldLabel>
              <Input id="sim-points" inputMode="numeric" value={points} onChange={(e) => { setPoints(e.target.value); }} />
            </Field>
            <Field>
              <FieldLabel htmlFor="sim-bonus">Bônus (%)</FieldLabel>
              <Input id="sim-bonus" inputMode="numeric" value={bonus} onChange={(e) => { setBonus(e.target.value); }} />
            </Field>
            <Field>
              <FieldLabel htmlFor="sim-cpm">Custo do milheiro de origem (R$)</FieldLabel>
              <Input id="sim-cpm" inputMode="decimal" value={cpm} onChange={(e) => { setCpm(e.target.value); }} />
            </Field>
            <Field>
              <FieldLabel htmlFor="sim-leg">Milhas por trecho do voo-alvo</FieldLabel>
              <Input id="sim-leg" inputMode="numeric" value={leg} onChange={(e) => { setLeg(e.target.value); }} />
            </Field>
          </div>
          <p className="brand-text text-3xl font-semibold tabular-nums" aria-live="polite">
            {formatNumber(gained)} milhas
          </p>
          <p className="text-muted-foreground text-sm">
            Custo efetivo: {money(effective)} por milheiro {target?.nome}
            {num(leg) > 0 && ` · rende ${(gained / num(leg)).toFixed(1).replace('.', ',')} trechos de ${formatNumber(num(leg))}`}
            {balance ? ` · você tem ${formatNumber(balance)} na origem` : ''}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="text-brand-ink size-4" aria-hidden />
            Milha ou dinheiro?
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="val-cash">Passagem em dinheiro (R$)</FieldLabel>
              <Input id="val-cash" inputMode="decimal" value={cash} onChange={(e) => { setCash(e.target.value); }} />
            </Field>
            <Field>
              <FieldLabel htmlFor="val-miles">Milhas pedidas</FieldLabel>
              <Input id="val-miles" inputMode="numeric" value={miles} onChange={(e) => { setMiles(e.target.value); }} />
            </Field>
            <Field>
              <FieldLabel htmlFor="val-fees">Taxas na emissão com milhas (R$)</FieldLabel>
              <Input id="val-fees" inputMode="decimal" value={fees} onChange={(e) => { setFees(e.target.value); }} />
            </Field>
            <Field>
              <FieldLabel htmlFor="val-program">Programa</FieldLabel>
              <Select value={airline} onValueChange={setAirline}>
                <SelectTrigger id="val-program" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {airlines.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <p className="text-2xl font-semibold" aria-live="polite">
            {!milesAsked
              ? '—'
              : verdict === 'use'
                ? '✅ Use milhas'
                : verdict === 'tie'
                  ? '🟡 Empate técnico'
                  : '💵 Pague em dinheiro'}
          </p>
          {milesAsked > 0 && (
            <p className="text-muted-foreground text-sm">
              Cada mil milhas está rendendo {money(obtained)}. O seu custo de referência no{' '}
              {programs.find((program) => program.id === airline)?.nome} é {money(reference)} o
              milheiro.{' '}
              {verdict === 'use'
                ? 'Usar milhas economiza dinheiro de verdade.'
                : verdict === 'tie'
                  ? 'Tanto faz: decida pela flexibilidade (remarcação, bagagem).'
                  : 'Guarde as milhas para uma emissão que renda mais.'}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="text-brand-ink size-4" aria-hidden />
            Como ler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid list-disc gap-1 pl-5 text-sm">
            <li>
              <strong>Custo efetivo do milheiro</strong> = custo do ponto de origem ÷ (1 + bônus).
              Compare com a compra direta de milhas.
            </li>
            <li>O bônus de promoção costuma valer só de 6 a 12 meses. Só transfira com a emissão já à vista.</li>
            <li>Cadastre o CPF na página da campanha antes de transferir.</li>
            <li>Primeiro encontre o assento disponível, depois transfira.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
