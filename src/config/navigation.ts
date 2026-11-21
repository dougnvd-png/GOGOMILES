import {
  BookOpen,
  Calculator,
  CalendarDays,
  Compass,
  Flag,
  Globe,
  LayoutDashboard,
  OctagonMinus,
  Plane,
  Settings,
  Ticket,
  TrendingUp,
  Wallet,
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
  { title: 'Planejar viagem', href: '/app/planejar', icon: Compass },
  { title: 'Promo Brasil', href: '/app/promo-brasil', icon: Flag },
  { title: 'Mundo', href: '/app/mundo', icon: Globe },
  { title: 'Calendário', href: '/app/calendario', icon: CalendarDays },
  { title: 'Radar de bônus', href: '/app/radar', icon: TrendingUp },
  { title: 'Oportunidades', href: '/app/oportunidades', icon: Plane },
  { title: 'Stopover', href: '/app/stopover', icon: OctagonMinus },
  { title: 'Guias e manual', href: '/app/guias', icon: BookOpen },
  { title: 'Simulador', href: '/app/simulador', icon: Calculator },
  { title: 'Minhas ofertas', href: '/app/ofertas', icon: Ticket },
  { title: 'Minha carteira', href: '/app/carteira', icon: Wallet },
];

export const secondaryNavigation: NavigationItem[] = [
  { title: 'Configurações', href: '/app/configuracoes', icon: Settings },
];
