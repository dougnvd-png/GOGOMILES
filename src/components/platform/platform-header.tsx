import { Search } from 'lucide-react';

import { NotificationsMenu } from '@/components/platform/notifications-menu';
import { ThemeToggle } from '@/components/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { isDemoMode } from '@/lib/env';

export const PlatformHeader = () => (
  <header className="sticky top-0 z-20 flex h-16 items-center gap-2 px-4 sm:px-6 lg:px-8">
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -bottom-5 -z-10 [mask-image:linear-gradient(#000_55%,transparent)] backdrop-blur-xl"
    />
    <SidebarTrigger aria-label="Abrir ou fechar o menu" className="-ml-1.5" />
    <form
      action="/app/ofertas"
      role="search"
      className="relative ml-1 hidden w-full max-w-xs sm:block"
    >
      <Search
        aria-hidden
        className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
      />
      <Input
        type="search"
        name="busca"
        maxLength={80}
        placeholder="Buscar rota"
        aria-label="Buscar oferta pela rota"
        className="h-9 rounded-full pl-9"
      />
    </form>
    {isDemoMode() && (
      <Badge
        variant="outline"
        className="text-muted-foreground ml-1 hidden font-normal md:inline-flex"
      >
        Modo demonstração
      </Badge>
    )}
    <div className="ml-auto flex items-center gap-1">
      <NotificationsMenu />
      <ThemeToggle />
    </div>
  </header>
);
