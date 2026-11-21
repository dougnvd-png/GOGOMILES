'use client';

import { useSyncExternalStore } from 'react';

const query = '(prefers-reduced-motion: reduce)';

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};

/** Verdadeiro quando a pessoa pede menos movimento no sistema. */
export const useReducedMotion = () =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
