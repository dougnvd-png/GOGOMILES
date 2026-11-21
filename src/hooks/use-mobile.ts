import { useSyncExternalStore } from 'react';

const mobileQuery = '(max-width: 767px)';

const subscribe = (onChange: () => void) => {
  const mediaQuery = window.matchMedia(mobileQuery);
  mediaQuery.addEventListener('change', onChange);
  return () => {
    mediaQuery.removeEventListener('change', onChange);
  };
};

export function useIsMobile() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(mobileQuery).matches,
    () => false,
  );
}
