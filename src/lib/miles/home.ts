import { localHour } from '@/lib/format';
import {
  codeFrom,
  dayPrices,
  daysUntil,
  isActivePromo,
  knownRoutes,
  light,
  ruler,
  type Campanha,
  type DayPrice,
  type Light,
  type Promo,
  type RadarData,
} from '@/lib/miles/radar';
import type { Estrela, Vigia } from '@/lib/miles/user-data';

/** Saídas de casa usadas quando a pessoa ainda não escolheu outras. */
export const homeOrigins = ['GYN', 'BSB'];

export const greetingFor = (now: Date) => {
  const hour = localHour(now);
  if (hour < 12) {
    return 'Bom dia';
  }
  return hour < 18 ? 'Boa tarde' : 'Boa noite';
};

export interface OpenPromo {
  promo: Promo;
  /** Dias até acabar. 0 é hoje; null quando o prazo não foi informado. */
  daysLeft: number | null;
}

/** Transferências bonificadas ainda abertas, da que acaba primeiro. */
export const openPromos = (data: RadarData, today: string): OpenPromo[] =>
  data.promos
    .filter((promo) => isActivePromo(promo, today))
    .map((promo) => ({ promo, daysLeft: daysUntil(promo.fim, today) }))
    .sort(
      (a, b) =>
        (a.daysLeft ?? 999) - (b.daysLeft ?? 999) ||
        (b.promo.bonusMax ?? 0) - (a.promo.bonusMax ?? 0),
    );

export interface OpenCampaign {
  campaign: Campanha;
  daysLeft: number | null;
}

export const openCampaigns = (data: RadarData, today: string): OpenCampaign[] =>
  data.brasil
    .filter((item): item is Campanha => item.tipo === 'campanha')
    .map((campaign) => ({ campaign, daysLeft: daysUntil(campaign.fim, today) }))
    .filter((entry) => entry.daysLeft === null || entry.daysLeft >= 0)
    .sort((a, b) => (a.campaign.ordem ?? 99) - (b.campaign.ordem ?? 99));

export const describeEnd = (daysLeft: number | null) => {
  if (daysLeft === null) {
    return 'prazo a confirmar';
  }
  if (daysLeft <= 0) {
    return 'termina hoje';
  }
  return daysLeft === 1 ? 'termina amanhã' : `termina em ${daysLeft} dias`;
};

export interface BestPrice {
  origin: string;
  destination: string;
  day: string;
  price: DayPrice;
  light: Light;
}

/** Menor preço futuro de uma rota, ou null quando não há preço registrado. */
export const bestOfRoute = (
  data: RadarData,
  origin: string,
  destination: string,
  today: string,
): BestPrice | null => {
  const prices = dayPrices(data, origin, destination, 'Todos');
  let best: BestPrice | null = null;
  for (const [day, list] of Object.entries(prices)) {
    if (day < today || list.length === 0) {
      continue;
    }
    if (!best || list[0].milhas < best.price.milhas) {
      best = {
        origin,
        destination,
        day,
        price: list[0],
        light: light(list[0].milhas, ruler(origin, destination).ref),
      };
    }
  }
  return best;
};

/** Destinos com os menores preços saindo das cidades informadas, um por destino. */
export const cheapestFrom = (
  data: RadarData,
  origins: string[],
  today: string,
  limit: number,
): BestPrice[] => {
  const byDestination = new Map<string, BestPrice>();
  for (const route of knownRoutes(data, today)) {
    // Voltas para casa (ex.: BSB para GYN) não contam como destino.
    if (!origins.includes(route.o) || origins.includes(route.d)) {
      continue;
    }
    const best = bestOfRoute(data, route.o, route.d, today);
    const current = byDestination.get(route.d);
    if (best && (!current || best.price.milhas < current.price.milhas)) {
      byDestination.set(route.d, best);
    }
  }
  return [...byDestination.values()]
    .sort((a, b) => a.price.milhas - b.price.milhas)
    .slice(0, limit);
};

export interface StarStatus {
  star: Estrela;
  best: BestPrice | null;
  withinGoal: boolean;
}

export const starStatuses = (
  data: RadarData,
  stars: Estrela[],
  today: string,
): StarStatus[] =>
  stars.map((star) => {
    const origins = star.origens.length ? star.origens : homeOrigins;
    const options = origins.flatMap((origin) =>
      star.aeroportos.flatMap((destination) => {
        const best = bestOfRoute(data, origin, destination, today);
        return best ? [best] : [];
      }),
    );
    options.sort((a, b) => a.price.milhas - b.price.milhas);
    const best = options[0] ?? null;
    return {
      star,
      best,
      withinGoal: Boolean(best && star.meta > 0 && best.price.milhas <= star.meta),
    };
  });

export interface WatchStatus {
  watch: Vigia;
  best: BestPrice | null;
  withinGoal: boolean;
}

export const watchStatuses = (
  data: RadarData,
  watches: Vigia[],
  today: string,
): WatchStatus[] =>
  watches.map((watch) => {
    const origin = codeFrom(watch.origem);
    const destination = codeFrom(watch.destino);
    const best =
      origin && destination ? bestOfRoute(data, origin, destination, today) : null;
    return {
      watch,
      best,
      withinGoal: Boolean(best && watch.meta > 0 && best.price.milhas <= watch.meta),
    };
  });
