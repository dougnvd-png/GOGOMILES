import { dayKey, shiftDayKey } from '@/lib/format';
import type { Item, ItemCategory, ItemStatus } from '@/lib/items';

const subjects: { label: string; category: ItemCategory }[] = [
  { label: 'Pedido de', category: 'Vendas' },
  { label: 'Orçamento para', category: 'Vendas' },
  { label: 'Proposta para', category: 'Vendas' },
  { label: 'Retorno para', category: 'Atendimento' },
  { label: 'Cadastro de', category: 'Atendimento' },
  { label: 'Visita a', category: 'Operação' },
  { label: 'Entrega para', category: 'Operação' },
  { label: 'Cobrança de', category: 'Financeiro' },
  { label: 'Renovação de', category: 'Financeiro' },
];

const customers = [
  'Ana Souza',
  'Padaria Sol',
  'Academia Vida',
  'Mercado Central',
  'Carlos Lima',
  'Clínica Bem Estar',
  'Oficina Rocha',
  'Studio Luz',
  'Marina Alves',
  'Escola Aquarela',
  'Pet Feliz',
  'Construtora Norte',
];

const historyDays = 100;
const dayInMs = 24 * 60 * 60 * 1000;
const weekdayWeights = [0.25, 1.1, 1.25, 1.2, 1.15, 0.95, 0.4];

const createRandom = (seed: number) => {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
};

const pick = <Value>(values: readonly Value[], random: () => number) =>
  values[Math.floor(random() * values.length)];

const createId = (random: () => number) => {
  const hex = (length: number) =>
    Array.from({ length }, () => Math.floor(random() * 16).toString(16)).join(
      '',
    );
  return `${hex(8)}-${hex(4)}-4${hex(3)}-${pick(['8', '9', 'a', 'b'], random)}${hex(3)}-${hex(12)}`;
};

const statusForAge = (ageInDays: number, random: () => number): ItemStatus => {
  const roll = random();
  if (ageInDays > 14) {
    if (roll < 0.9) {
      return 'done';
    }
    return roll < 0.96 ? 'in_progress' : 'open';
  }
  if (ageInDays > 4) {
    if (roll < 0.6) {
      return 'done';
    }
    return roll < 0.86 ? 'in_progress' : 'open';
  }
  if (roll < 0.22) {
    return 'done';
  }
  return roll < 0.55 ? 'in_progress' : 'open';
};

/**
 * Itens de exemplo para o modo demonstração e para a prévia da página inicial.
 * O resultado depende só da data recebida, então a mesma data gera a mesma lista.
 */
export const createSampleItems = (now: Date): Item[] => {
  const random = createRandom(20261121);
  const items: Item[] = [];

  for (let age = historyDays - 1; age >= 0; age -= 1) {
    const day = new Date(now.getTime() - age * dayInMs);
    const growth = 1.4 + 2.6 * (1 - age / historyDays);
    const wave = 1 + 0.3 * Math.sin(age / 5);
    const expected = growth * wave * weekdayWeights[day.getUTCDay()];
    const count = Math.floor(expected + random());

    for (let index = 0; index < count; index += 1) {
      const subject = pick(subjects, random);
      const minutesBack = Math.floor(random() * 9 * 60);
      const createdAt = new Date(
        Math.min(day.getTime() - minutesBack * 60 * 1000, now.getTime()),
      );
      const status = statusForAge(age, random);
      const daysToFinish = 1 + Math.floor(random() * Math.min(age + 1, 9));
      const completedAt =
        status === 'done'
          ? new Date(
              Math.min(
                createdAt.getTime() + daysToFinish * dayInMs,
                now.getTime(),
              ),
            ).toISOString()
          : null;
      const hasDueDate = random() < 0.85;
      const dueFrom = status === 'done' ? createdAt : now;
      const dueInDays =
        status === 'done'
          ? 6 + Math.floor(random() * 16)
          : Math.floor(random() * 18) - 3;
      items.push({
        id: createId(random),
        title: `${subject.label} ${pick(customers, random)}`,
        category: subject.category,
        status,
        dueDate: hasDueDate
          ? shiftDayKey(dayKey(dueFrom), dueInDays)
          : null,
        completedAt,
        createdAt: createdAt.toISOString(),
      });
    }
  }

  return items.sort((first, second) =>
    second.createdAt.localeCompare(first.createdAt),
  );
};

export const sampleReferenceDate = new Date('2026-11-20T15:30:00.000Z');
