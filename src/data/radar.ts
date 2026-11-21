import 'server-only';

import radar from '@/data/radar.json';
import type { RadarData } from '@/lib/miles/radar';

/**
 * Dados do radar importados do sistema anterior em 21/11/2026: promoções,
 * achados, bônus de transferência, regras de stopover e histórico de preços.
 * Quando a varredura automática for conectada, este arquivo passa a ser lido do banco.
 */
export const getRadar = (): RadarData => radar as unknown as RadarData;

/** Dia de hoje (AAAA-MM-DD) no fuso de São Paulo. */
export const todayKey = () =>
  new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date());
