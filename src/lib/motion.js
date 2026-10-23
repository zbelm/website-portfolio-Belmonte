/**
 * Motion helpers shared by every section.
 *
 * - GSAP + ScrollTrigger drive the scrubbed / sequenced effects
 *   (hero parallax, world-map progress, pixel dissolves, trophy re-flips).
 *   They are code-split and loaded with `loadGsap()` right after first paint,
 *   so they never delay the page becoming interactive.
 * - One-shot "reveal on enter" effects are CSS transitions toggled by an
 *   IntersectionObserver (see `.motion-ok [data-reveal]` in base.css).
 *   Their hidden start state lives in CSS, so nothing is measured or written
 *   per element on load — this keeps Lighthouse Total Blocking Time low.
 * Everything here is skipped when the visitor prefers reduced motion.
 */

let gsapPromise;

/** Lazy-load GSAP + ScrollTrigger once; resolves to { gsap, ScrollTrigger }. */
export function loadGsap() {
  if (!gsapPromise) {
    // wait for an idle moment so parsing GSAP never competes with first paint / input
    const idle = new Promise((resolve) => (window.requestIdleCallback || setTimeout)(resolve, { timeout: 1500 }));
    gsapPromise = idle.then(() => Promise.all([import('gsap'), import('gsap/ScrollTrigger')])).then(([g, st]) => {
      const gsap = g.gsap || g.default;
      const ScrollTrigger = st.ScrollTrigger || st.default;
      gsap.registerPlugin(ScrollTrigger);
      return { gsap, ScrollTrigger };
    });
  }
  return gsapPromise;
}

/** ScrollTrigger.refresh() if GSAP has been loaded already (no-op otherwise). */
export function refreshScroll() {
  gsapPromise?.then(({ ScrollTrigger }) => ScrollTrigger.refresh());
}

/**
 * Add `.is-in` to each element as it scrolls into view. Elements entering
 * together get `--i` (0, 1, 2…) so CSS can stagger them.
 * Returns a cleanup function.
 */
export function revealOnView(targets, { rootMargin = '0px 0px -10% 0px' } = {}) {
  const els = Array.from(targets);
  if (!els.length) return () => {};
  const io = new IntersectionObserver(
    (entries) => {
      entries
        .filter((e) => e.isIntersecting)
        .forEach((e, i) => {
          e.target.style.setProperty('--i', i);
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        });
    },
    { rootMargin },
  );
  els.forEach((el) => io.observe(el));
  return () => io.disconnect();
}

/** Run `onEnter` once when `el` scrolls into view. Returns a cleanup function. */
export function onceInView(el, onEnter, { rootMargin = '0px 0px -8% 0px' } = {}) {
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      onEnter();
    },
    { rootMargin },
  );
  io.observe(el);
  return () => io.disconnect();
}
