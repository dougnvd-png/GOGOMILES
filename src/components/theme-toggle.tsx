'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  const handleToggle = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Alternar entre modo claro e escuro"
      onClick={handleToggle}
    >
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
    </Button>
  );
};
