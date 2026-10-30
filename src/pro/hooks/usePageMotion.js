import { useEffect } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { loadGsap, refreshScroll } from '../../lib/motion.js';
import { watchInView } from './inView.js';

const EASE = 'power3.out';

/**
 * Scroll motion for Professional mode. One language: type rises from its baseline, hairlines draw,
 * and everything else gets a short fade-rise. Content is always visible by default; things are only
 * hidden ("armed") once we know they are below the fold, so nothing flashes or depends on motion.
 *
 *   [data-pro-in]       gets .is-in on arrival; CSS draws its hairlines, rises its title, fills its steps
 *   [data-pro-reveal]   GSAP fade-rise (500 ms, power3.out, 60 ms stagger) for blocks
 *   [data-count]        count-up on first arrival
 *   .pro-tl-dot         lights up once the timeline has reached it
 *   .pro-timeline-line  scrubbed to scroll (ScrollTrigger); hero portrait drifts slightly slower
 * Only transform and opacity animate. Skipped entirely for reduced motion.
 */
export function usePageMotion(rootRef) {
  const { reducedMotion } = useGame();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return undefined;
    const stops = [];
    let ctx;
    let alive = true;
    let t;
    const $$ = (sel) => root.querySelectorAll(sel);

    // CSS-driven state: no GSAP needed, so it starts straight away
    stops.push(
      watchInView($$('[data-pro-in]'), {
        rootMargin: '0px 0px -12% 0px',
        onArm: (el) => el.setAttribute('data-armed', ''),
        onIn: (arrived) => arrived.forEach(({ el }) => el.classList.add('is-in')),
      }),
      watchInView($$('.pro-tl-dot'), {
        rootMargin: '0px 0px -35% 0px',
        onArm: (el) => el.classList.add('is-pending'),
        onIn: (arrived) => arrived.forEach(({ el }) => el.classList.remove('is-pending')),
      }),
    );

    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (!alive) return;
      ctx = gsap.context(() => {
        stops.push(
          watchInView($$('[data-pro-reveal]'), {
            onArm: (el) => gsap.set(el, { opacity: 0, y: 16 }),
            onIn: (arrived) =>
              ctx.add(() => {
                const live = arrived.filter((a) => !a.instant).map((a) => a.el);
                const skipped = arrived.filter((a) => a.instant).map((a) => a.el);
                gsap.set(skipped, { opacity: 1, y: 0, clearProps: 'opacity,transform' });
                gsap.to(live, { opacity: 1, y: 0, duration: 0.5, ease: EASE, stagger: 0.06, overwrite: true, clearProps: 'opacity,transform' });
              }),
          }),
          watchInView($$('[data-count]'), {
            rootMargin: '0px 0px -5% 0px',
            onIn: (arrived) =>
              ctx.add(() =>
                arrived.forEach(({ el, instant }) => {
                  if (instant) return;
                  const n = { v: 0 };
                  el.textContent = '0';
                  gsap.to(n, { v: Number(el.dataset.count), duration: 0.9, ease: 'power2.out', onUpdate: () => (el.textContent = Math.round(n.v)) });
                }),
              ),
          }),
        );

        // position-driven, so a jump can't miss it
        const line = root.querySelector('.pro-timeline-line');
        const list = root.querySelector('.pro-timeline');
        if (line && list) {
          gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 75%', end: 'bottom 65%', scrub: true } });
        }
        const photo = root.querySelector('.pro-hero-photo img');
        if (photo) {
          gsap.to(photo, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: root.querySelector('.pro-hero'), start: 'top top', end: 'bottom top', scrub: true } });
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
      stops.forEach((stop) => stop());
      ro.disconnect();
      ctx?.revert();
    };
  }, [reducedMotion, rootRef]);
}
