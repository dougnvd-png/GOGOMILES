'use client';

import { useEffect } from 'react';

const revealSelector = '[data-reveal]';
const spotlightSelector = '[data-spotlight]';

/**
 * Liga o movimento da página. Marca cada bloco com `data-reveal` quando ele
 * entra na tela e move a luz dos painéis com `data-spotlight` junto do cursor.
 * Sem JavaScript, nada fica escondido.
 */
export const MotionObserver = () => {
  useEffect(() => {
    const root = document.documentElement;
    const targets = [...document.querySelectorAll<HTMLElement>(revealSelector)];
    const fold = window.innerHeight * 0.92;

    for (const target of targets) {
      if (target.getBoundingClientRect().top < fold) {
        target.dataset.revealed = 'seen';
      }
    }
    root.dataset.motion = 'on';

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const target = entry.target as HTMLElement;
          target.toggleAttribute('data-inview', entry.isIntersecting);
          if (entry.isIntersecting && !target.dataset.revealed) {
            target.dataset.revealed = 'in';
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );
    for (const target of targets) {
      observer.observe(target);
    }

    const handlePointerMove = (event: PointerEvent) => {
      const panel = (event.target as Element | null)?.closest<HTMLElement>(
        spotlightSelector,
      );
      if (!panel) {
        return;
      }
      const bounds = panel.getBoundingClientRect();
      panel.style.setProperty('--mx', `${event.clientX - bounds.left}px`);
      panel.style.setProperty('--my', `${event.clientY - bounds.top}px`);
    };
    document.addEventListener('pointermove', handlePointerMove, {
      passive: true,
    });

    return () => {
      observer.disconnect();
      document.removeEventListener('pointermove', handlePointerMove);
      delete root.dataset.motion;
    };
  }, []);

  return null;
};
