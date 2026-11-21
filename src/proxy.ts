import { clerkMiddleware } from '@clerk/nextjs/server';
import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from 'next/server';

import { isAuthConfigured } from '@/lib/env';

const withClerk = clerkMiddleware();

export function proxy(request: NextRequest, event: NextFetchEvent) {
  return isAuthConfigured() ? withClerk(request, event) : NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
