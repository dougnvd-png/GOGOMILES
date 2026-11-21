import { Benefits } from '@/components/marketing/benefits';
import { Faq } from '@/components/marketing/faq';
import { FinalCall } from '@/components/marketing/final-call';
import { Hero } from '@/components/marketing/hero';
import { Highlights } from '@/components/marketing/highlights';
import { Pricing } from '@/components/marketing/pricing';
import { SiteFooter } from '@/components/marketing/site-footer';
import { SiteHeader } from '@/components/marketing/site-header';
import { Steps } from '@/components/marketing/steps';
import { Testimonials } from '@/components/marketing/testimonials';
import { Ticker } from '@/components/marketing/ticker';
import { MotionObserver } from '@/components/motion/motion-observer';

export default function LandingPage() {
  return (
    <>
      <MotionObserver />
      <div aria-hidden className="scroll-progress" />
      <SiteHeader />
      <main>
        <Hero />
        <Highlights />
        <Ticker />
        <Benefits />
        <Steps />
        <Pricing />
        <Testimonials />
        <Faq />
        <FinalCall />
      </main>
      <SiteFooter />
    </>
  );
}
