import type { ReactNode } from 'react';

import { AppSidebar } from '@/components/platform/app-sidebar';
import { PlatformHeader } from '@/components/platform/platform-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { isAuthConfigured } from '@/lib/env';
import { requireUser } from '@/server/auth';
import { getViewer } from '@/server/queries/viewer';

export default async function PlatformLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireUser();
  const viewer = await getViewer();

  return (
    <SidebarProvider>
      <AppSidebar viewer={viewer} canSignOut={isAuthConfigured()} />
      <SidebarInset className="min-w-0 bg-transparent">
        <PlatformHeader />
        <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-6 px-4 pt-2 pb-10 sm:px-6 lg:px-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
