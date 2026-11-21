import 'server-only';

const attemptsByKey = new Map<string, number[]>();

/**
 * Limite simples em memória, por processo. Serve para frear repetição
 * acidental ou abuso leve. Em produção com várias instâncias, cada uma
 * conta separadamente.
 */
export const allowAttempt = (key: string, limit: number, windowMs: number) => {
  const now = Date.now();
  const recent = (attemptsByKey.get(key) ?? []).filter(
    (time) => now - time < windowMs,
  );
  if (recent.length >= limit) {
    attemptsByKey.set(key, recent);
    return false;
  }
  attemptsByKey.set(key, [...recent, now]);
  return true;
};
