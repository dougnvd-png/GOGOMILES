'use client';

import { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { BrandMark } from '@/components/brand-mark';
import { ViewerMenu } from '@/components/platform/viewer-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  mainNavigation,
  platformHome,
  secondaryNavigation,
  type NavigationItem,
} from '@/config/navigation';
import type { Viewer } from '@/server/queries/viewer';

const isCurrent = (pathname: string, href: string) =>
  href === platformHome ? pathname === href : pathname.startsWith(href);

const NavigationList = ({ items }: { items: NavigationItem[] }) => {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const handleNavigate = () => {
    setOpenMobile(false);
  };

  return (
    <SidebarMenu className="gap-1">
      {items.map(({ title, href, icon: Icon }) => (
        <SidebarMenuItem key={href}>
          <SidebarMenuButton
            asChild
            isActive={isCurrent(pathname, href)}
            tooltip={title}
            className="h-10 rounded-md px-3 transition-colors duration-300"
          >
            <Link href={href} onClick={handleNavigate}>
              <Icon />
              <span>{title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

const activeItemSelector =
  "[data-slot='sidebar-menu-button'][data-active='true']";

/**
 * Destaque do item ativo do menu. É um único bloco que desliza de um item
 * para o outro quando a página muda, em vez de apagar em um e acender no outro.
 */
const ActiveIndicator = () => {
  const pathname = usePathname();
  const indicatorRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const indicator = indicatorRef.current;
    const list = indicator?.parentElement;
    if (!indicator || !list) {
      return;
    }

    const place = () => {
      const active = list.querySelector<HTMLElement>(activeItemSelector);
      if (!active) {
        indicator.style.opacity = '0';
        delete list.dataset.indicator;
        return;
      }
      const item = active.getBoundingClientRect();
      const origin = list.getBoundingClientRect();
      const left = item.left - origin.left + list.scrollLeft;
      const top = item.top - origin.top + list.scrollTop;
      indicator.style.width = `${item.width}px`;
      indicator.style.height = `${item.height}px`;
      indicator.style.transform = `translate(${left}px, ${top}px)`;
      indicator.style.opacity = '1';
      // Lê a posição antes de ligar a transição, para a primeira não deslizar do canto.
      indicator.getBoundingClientRect();
      list.dataset.indicator = 'ready';
    };

    place();
    const observer = new ResizeObserver(place);
    observer.observe(list);
    return () => observer.disconnect();
  }, [pathname]);

  return <span ref={indicatorRef} aria-hidden className="sidebar-indicator" />;
};

interface AppSidebarProps {
  viewer: Viewer;
  canSignOut: boolean;
}

export const AppSidebar = ({ viewer, canSignOut }: AppSidebarProps) => (
  <Sidebar collapsible="icon" variant="floating">
    <SidebarHeader className="p-3">
      <Link
        href={platformHome}
        className="flex h-10 items-center rounded-md px-1 group-data-[collapsible=icon]:px-0"
      >
        <BrandMark className="group-data-[collapsible=icon]:[&>span:last-child]:hidden" />
      </Link>
    </SidebarHeader>
    <SidebarContent className="relative isolate px-1">
      <ActiveIndicator />
      <SidebarGroup>
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarGroupContent>
          <NavigationList items={mainNavigation} />
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup className="mt-auto">
        <SidebarGroupContent>
          <NavigationList items={secondaryNavigation} />
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarSeparator className="mx-3" />
    <SidebarFooter className="p-3">
      <ViewerMenu viewer={viewer} canSignOut={canSignOut} />
    </SidebarFooter>
  </Sidebar>
);
