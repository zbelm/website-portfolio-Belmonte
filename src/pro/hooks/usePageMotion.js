import { useEffect } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { loadGsap, refreshScroll } from '../../lib/motion.js';

const EASE = 'power3.out';

/**
 * Scroll-driven polish for Professional mode, on the shared GSAP + ScrollTrigger setup.
 * Everything starts visible: elements are only hidden once GSAP is ready AND they are
 * still below the fold, so nothing flashes and content never depends on motion.
 *   [data-pro-reveal]  fade-up once on enter (500 ms, power3.out, 60 ms stagger)
 *   [data-count]   count up to the number once on enter
 *   .pro-timeline-line  draws with the scroll
 * Only transform and opacity are animated. Skipped entirely for reduced motion.
 */
export function usePageMotion(rootRef) {
  const { reducedMotion } = useGame();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return undefined;
    let ctx;
    let io;
    let alive = true;
    let t;

    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (!alive) return;
      ctx = gsap.context(() => {
        // an IntersectionObserver reports who is already on screen without forcing a layout read
        const reveals = gsap.utils.toArray('[data-pro-reveal]');
        io = new IntersectionObserver(
          (entries) => {
            io.disconnect();
            if (!alive) return;
            const below = entries.filter((e) => !e.isIntersecting && e.boundingClientRect.top > 0).map((e) => e.target);
            // created after the context callback returned, so register it for ctx.revert()
            ctx.add(() => {
              gsap.set(below, { opacity: 0, y: 16 });
              ScrollTrigger.batch(below, {
                start: 'top 94%',
                once: true,
                onEnter: (els) =>
                  gsap.to(els, { opacity: 1, y: 0, duration: 0.5, ease: EASE, stagger: 0.06, overwrite: true, clearProps: 'opacity,transform' }),
              });
            });
          },
          { rootMargin: '0px 0px -4% 0px' },
        );
        reveals.forEach((el) => io.observe(el));

        gsap.utils.toArray('[data-count]').forEach((el) => {
          const to = Number(el.dataset.count);
          ScrollTrigger.create({
            trigger: el,
            start: 'top 92%',
            once: true,
            onEnter: () => {
              const n = { v: 0 };
              el.textContent = '0';
              gsap.to(n, { v: to, duration: 0.9, ease: 'power2.out', onUpdate: () => (el.textContent = Math.round(n.v)) });
            },
          });
        });

        const line = root.querySelector('.pro-timeline-line');
        const list = root.querySelector('.pro-timeline');
        if (line && list) {
          gsap.fromTo(
            line,
            { scaleY: 0 },
            { scaleY: 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 75%', end: 'bottom 65%', scrub: true } },
          );
        }
      }, root);
    });

    // layout changes (fonts, filters, expanded lists) move the trigger points
    let height = root.offsetHeight;
    const ro = new ResizeObserver(() => {
      if (root.offsetHeight === height) return; // the initial callback reports no change
      height = root.offsetHeight;
      clearTimeout(t);
      t = setTimeout(refreshScroll, 150);
    });
    ro.observe(root);

    return () => {
      alive = false;
      clearTimeout(t);
      io?.disconnect();
      ro.disconnect();
      ctx?.revert();
    };
  }, [reducedMotion, rootRef]);
}
