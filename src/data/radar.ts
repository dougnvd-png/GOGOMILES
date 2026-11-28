import 'server-only';

import { cache } from 'react';
import { desc } from 'drizzle-orm';

import radar from '@/data/radar.json';
import type { Historico, RadarData } from '@/lib/miles/radar';
import { getDb } from '@/server/db';
import { priceChecks, radarItems } from '@/server/db/schema';

/**
 * Cópia do radar que vem junto com o código. Só é usada quando não há banco, ou
 * quando o banco está vazio ou fora do ar. A fonte do dia a dia é o banco.
 */
const bundledRadar = (): RadarData => radar as unknown as RadarData;

const dayFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'America/Sao_Paulo',
});

const listCollections = [
  'brasil',
  'mundo',
  'promos',
  'benchmarks',
  'stopovers',
  'oportunidades',
  'dicas',
  'guias',
  'historico',
] as const;

type Database = NonNullable<ReturnType<typeof getDb>>;

/** Lê o radar da tabela radar_items. Devolve null quando a tabela está vazia. */
const readStoredRadar = async (db: Database): Promise<RadarData | null> => {
  const rows = await db.select().from(radarItems).limit(10000);
  if (rows.length === 0) {
    return null;
  }
  const result: Record<string, unknown> = { meta: {} };
  for (const name of listCollections) {
    result[name] = [];
  }
  for (const row of rows) {
    if (row.collection === 'meta') {
      result.meta = row.data;
      continue;
    }
    const list = result[row.collection];
    if (Array.isArray(list)) {
      list.push({ ...(row.data as Record<string, unknown>), id: row.itemId });
    }
  }
  return result as unknown as RadarData;
};

/** Junta ao histórico de cada rota as leituras de preço gravadas em price_checks. */
const withPriceChecks = async (db: Database, base: RadarData): Promise<RadarData> => {
  const rows = await db
    .select()
    .from(priceChecks)
    .orderBy(desc(priceChecks.checkedAt))
    .limit(5000);
  if (rows.length === 0) {
    return base;
  }
  const byRoute = new Map<string, Historico>(
    base.historico.map((history) => [
      history.id,
      { ...history, pontos: [...(history.pontos ?? [])] },
    ]),
  );
  let latest = base.meta.aoVivo ?? '';
  for (const row of rows) {
    const id = `${row.origin}-${row.destination}`;
    const history = byRoute.get(id) ?? { id, pontos: [] };
    history.pontos = [
      ...(history.pontos ?? []),
      {
        consultado: dayFormatter.format(row.checkedAt),
        consultadoEm: row.checkedAt.toISOString(),
        data_voo: row.flightDate,
        milhas: row.miles,
        programa: row.program,
        url: row.url ?? undefined,
        nota: row.note ?? undefined,
      },
    ];
    byRoute.set(id, history);
    if (row.checkedAt.toISOString() > latest) {
      latest = row.checkedAt.toISOString();
    }
  }
  return {
    ...base,
    historico: [...byRoute.values()],
    meta: { ...base.meta, aoVivo: latest || base.meta.aoVivo },
  };
};

/**
 * O radar atual: promoções, campanhas, bônus e preços, lidos do banco. O que
 * for gravado no banco aparece nas telas sem precisar publicar o site de novo.
 */
export const getRadar = cache(async (): Promise<RadarData> => {
  const db = getDb();
  if (!db) {
    return bundledRadar();
  }
  try {
    const stored = (await readStoredRadar(db)) ?? bundledRadar();
    return await withPriceChecks(db, stored);
  } catch (error) {
    console.error(
      'Não foi possível ler o radar do banco:',
      error instanceof Error ? error.name : 'erro desconhecido',
    );
    return bundledRadar();
  }
});

/** Dia de hoje (AAAA-MM-DD) no fuso de São Paulo. */
export const todayKey = () => dayFormatter.format(new Date());
