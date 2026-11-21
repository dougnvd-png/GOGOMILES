import { dayKey, shiftDayKey } from '@/lib/format';
import {
  offerCabins,
  offerPrograms,
  type Offer,
  type OfferStatus,
} from '@/lib/offers';

const routes: { origin: string; destination: string; baseMiles: number }[] = [
  { origin: 'São Paulo (GRU)', destination: 'Lisboa (LIS)', baseMiles: 70000 },
  { origin: 'São Paulo (GRU)', destination: 'Santiago (SCL)', baseMiles: 22000 },
  { origin: 'Rio de Janeiro (GIG)', destination: 'Miami (MIA)', baseMiles: 60000 },
  { origin: 'Brasília (BSB)', destination: 'Salvador (SSA)', baseMiles: 9000 },
  { origin: 'Belo Horizonte (CNF)', destination: 'Buenos Aires (EZE)', baseMiles: 26000 },
  { origin: 'São Paulo (GRU)', destination: 'Orlando (MCO)', baseMiles: 58000 },
  { origin: 'Porto Alegre (POA)', destination: 'Recife (REC)', baseMiles: 14000 },
  { origin: 'Curitiba (CWB)', destination: 'Fortaleza (FOR)', baseMiles: 13000 },
  { origin: 'São Paulo (GRU)', destination: 'Paris (CDG)', baseMiles: 75000 },
  { origin: 'Campinas (VCP)', destination: 'Natal (NAT)', baseMiles: 12000 },
];

const historyDays = 100;
const dayInMs = 24 * 60 * 60 * 1000;
const weekdayWeights = [0.25, 1.1, 1.25, 1.2, 1.15, 0.95, 0.4];
const cabinMultiplier = [1, 1.7, 2.6];

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

const statusForAge = (ageInDays: number, random: () => number): OfferStatus => {
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
 * Ofertas de exemplo para o modo demonstração e para a prévia da página inicial.
 * São dados fictícios, só para mostrar o painel funcionando. O resultado depende
 * só da data recebida, então a mesma data gera a mesma lista.
 */
export const createSampleOffers = (now: Date): Offer[] => {
  const random = createRandom(20261121);
  const offers: Offer[] = [];

  for (let age = historyDays - 1; age >= 0; age -= 1) {
    const day = new Date(now.getTime() - age * dayInMs);
    const growth = 1.4 + 2.6 * (1 - age / historyDays);
    const wave = 1 + 0.3 * Math.sin(age / 5);
    const expected = growth * wave * weekdayWeights[day.getUTCDay()];
    const count = Math.floor(expected + random());

    for (let index = 0; index < count; index += 1) {
      const route = pick(routes, random);
      const cabinIndex = Math.floor(random() * random() * offerCabins.length);
      const minutesBack = Math.floor(random() * 9 * 60);
      const createdAt = new Date(
        Math.min(day.getTime() - minutesBack * 60 * 1000, now.getTime()),
      );
      const status = statusForAge(age, random);
      const daysToFinish = 1 + Math.floor(random() * Math.min(age + 1, 9));
      const issuedAt =
        status === 'done'
          ? new Date(
              Math.min(
                createdAt.getTime() + daysToFinish * dayInMs,
                now.getTime(),
              ),
            ).toISOString()
          : null;
      const flexible = random() < 0.1;
      const departIn =
        status === 'done'
          ? 20 + Math.floor(random() * 120)
          : Math.floor(random() * 150) - 3;
      const departDate = flexible
        ? null
        : shiftDayKey(dayKey(status === 'done' ? createdAt : now), departIn);
      const roundTrip = departDate !== null && random() < 0.75;
      const miles =
        Math.round(
          (route.baseMiles * cabinMultiplier[cabinIndex] * (0.6 + random() * 0.7)) /
            500,
        ) * 500;
      offers.push({
        id: createId(random),
        origin: route.origin,
        destination: route.destination,
        program: pick(offerPrograms.slice(0, 4), random),
        cabin: offerCabins[cabinIndex],
        departDate,
        returnDate:
          roundTrip && departDate
            ? shiftDayKey(departDate, 5 + Math.floor(random() * 14))
            : null,
        miles,
        taxesCents: Math.round((150 + random() * 900) * 100),
        link: null,
        notes: null,
        status,
        issuedAt,
        createdAt: createdAt.toISOString(),
      });
    }
  }

  return offers.sort((first, second) =>
    second.createdAt.localeCompare(first.createdAt),
  );
};

export const sampleReferenceDate = new Date('2026-11-20T15:30:00.000Z');
