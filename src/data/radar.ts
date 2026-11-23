import 'server-only';

import { cache } from 'react';
import { desc } from 'drizzle-orm';

import radar from '@/data/radar.json';
import type { Historico, RadarData } from '@/lib/miles/radar';
import { getDb } from '@/server/db';
import { priceChecks } from '@/server/db/schema';

/**
 * Dados do radar importados do sistema anterior em 21/11/2026: promoções,
 * achados, bônus de transferência, regras de stopover e histórico de preços.
 */
export const getRadar = (): RadarData => radar as unknown as RadarData;

const dayFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'America/Sao_Paulo',
});

/**
 * O radar mais as leituras de preço gravadas no banco (tabela price_checks).
 * As leituras novas entram no histórico de cada rota e atualizam o horário da
 * última busca ao vivo. Sem banco, ou com erro, devolve só o radar importado.
 */
export const getRadarLive = cache(async (): Promise<RadarData> => {
  const base = getRadar();
  const db = getDb();
  if (!db) {
    return base;
  }
  try {
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
  } catch {
    return base;
  }
});

/** Dia de hoje (AAAA-MM-DD) no fuso de São Paulo. */
export const todayKey = () => dayFormatter.format(new Date());
