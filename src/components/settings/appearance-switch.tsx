'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';

import { Switch } from '@/components/ui/switch';

const subscribe = () => () => {};

export const AppearanceSwitch = ({ id }: { id: string }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return (
    <Switch
      id={id}
      checked={mounted && resolvedTheme === 'dark'}
      onCheckedChange={(checked) => {
        setTheme(checked ? 'dark' : 'light');
      }}
    />
  );
};
