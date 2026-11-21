import type { CSSProperties } from 'react';

/** Atraso da revelação de um bloco com `data-reveal`, para entradas em sequência. */
export const revealDelay = (index: number, step = 90): CSSProperties =>
  ({ '--reveal-delay': `${index * step}ms` }) as CSSProperties;

/** Posição de uma peça em uma animação em ciclo (classes `cycle`, `cycle-turn` e `step-cycle`). */
export const cycleIndex = (index: number): CSSProperties =>
  ({ '--i': index }) as CSSProperties;
