import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { appConfig } from '@/config/app';
import { landingContent } from '@/config/landing';

export const FinalCall = () => {
  const { finalCall } = landingContent;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:pb-28">
      <div
        data-reveal
        data-spotlight
        className="surface spin-border relative isolate grid justify-items-center gap-7 overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12 sm:py-20"
      >
        <div
          aria-hidden
          className="brand-surface glow-pulse motion-loop absolute -top-40 left-[calc(50%-17rem)] -z-10 size-[34rem] rounded-full opacity-30 blur-[110px]"
        />
        <div
          aria-hidden
          className="grid-backdrop grid-pan motion-loop absolute inset-0 -z-10 opacity-70"
        />
        <div className="grid max-w-2xl gap-4">
          <h2 className="text-3xl leading-[1.1] font-semibold text-balance sm:text-5xl">
            {finalCall.title}
          </h2>
          <p className="text-muted-foreground text-lg text-pretty">
            {finalCall.subtitle}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <Button
            asChild
            size="lg"
            className="sheen h-12 rounded-full px-7 text-base"
          >
            <Link href={finalCall.action.href}>
              {finalCall.action.label}
              <ArrowRight />
            </Link>
          </Button>
          {appConfig.contactEmail && (
            <a
              href={`mailto:${appConfig.contactEmail}`}
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 font-medium underline-offset-4 transition-colors hover:underline"
            >
              <Mail aria-hidden className="size-4" />
              {appConfig.contactEmail}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
