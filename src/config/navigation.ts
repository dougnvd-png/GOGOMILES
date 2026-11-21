import {
  LayoutDashboard,
  ListChecks,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface NavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const platformHome = '/app';

export const mainNavigation: NavigationItem[] = [
  { title: 'Visão geral', href: '/app', icon: LayoutDashboard },
  { title: 'Itens', href: '/app/itens', icon: ListChecks },
];

export const secondaryNavigation: NavigationItem[] = [
  { title: 'Configurações', href: '/app/configuracoes', icon: Settings },
];
