'use client';

import Link from 'next/link';
import { SignOutButton } from '@clerk/nextjs';
import { ChevronsUpDown, LogOut, Settings } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { Viewer } from '@/server/queries/viewer';

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

interface ViewerMenuProps {
  viewer: Viewer;
  canSignOut: boolean;
}

export const ViewerMenu = ({ viewer, canSignOut }: ViewerMenuProps) => (
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="rounded-md"
            aria-label={`Conta de ${viewer.name}`}
          >
            <Avatar className="size-8 rounded-lg">
              {viewer.imageUrl && <AvatarImage src={viewer.imageUrl} alt="" />}
              <AvatarFallback className="bg-brand-soft text-brand-ink rounded-lg text-xs font-semibold">
                {initialsOf(viewer.name)}
              </AvatarFallback>
            </Avatar>
            <span className="grid min-w-0 flex-1 leading-tight">
              <span className="truncate text-sm font-medium">{viewer.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {viewer.email}
              </span>
            </span>
            <ChevronsUpDown className="text-muted-foreground ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-56">
          <DropdownMenuLabel className="grid gap-0.5">
            <span className="truncate">{viewer.name}</span>
            <span className="text-muted-foreground truncate text-xs font-normal">
              {viewer.email}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/app/configuracoes">
              <Settings />
              Configurações
            </Link>
          </DropdownMenuItem>
          {canSignOut && (
            <SignOutButton redirectUrl="/">
              <DropdownMenuItem>
                <LogOut />
                Sair
              </DropdownMenuItem>
            </SignOutButton>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
);
