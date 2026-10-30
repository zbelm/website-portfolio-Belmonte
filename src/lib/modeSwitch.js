/**
 * Keeps the visitor in the same place when the whole site swaps between
 * Player One and Professional. Both modes use the same section ids
 * (see config/levels.js), so we remember which section is under a reading
 * line plus how far through it we were, then restore that after the swap.
 * Sections are read from the live DOM, since each mode orders them differently.
 */

export const MODE_KEY = 'p1-mode';

// the visitor taking over (wheel, touch, keys, scrollbar or link clicks) ends the restore
const INPUTS = ['wheel', 'touchstart', 'keydown', 'pointerdown'];

const LINE = 0.35; // reading line, as a fraction of the viewport height

/** The mode asked for by `?mode=`, if any (`pro`, `player-one` or `p1`). */
export function modeFromUrl() {
  const q = new URLSearchParams(window.location.search).get('mode');
  if (q === 'pro') return 'pro';
  if (q === 'player-one' || q === 'p1') return 'player-one';
  return null;
}

/** Section under the reading line + progress through it, or null at the very top. */
export function captureAnchor() {
  if (window.scrollY < 8) return null;
  const line = window.innerHeight * LINE;
  let best = null;
  for (const el of document.querySelectorAll('main > section[id]')) {
    const r = el.getBoundingClientRect();
    if (r.top <= line && r.bottom > line) return { id: el.id, frac: (line - r.top) / r.height };
    if (r.bottom <= line) best = { id: el.id, frac: 1 };
  }
  return best;
}

/**
 * Scroll to a captured anchor once its section exists in the new tree
 * (Player One renders levels after the first paint). Gives up after ~1.5 s,
 * and stops the moment the visitor scrolls by hand. Resolves when done.
 */
export function restoreAnchor(anchor) {
  return new Promise((resolve) => {
    if (!anchor) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      resolve();
      return;
    }
    let frames = 0;
    let settled = 0;
    let raf = 0;
    const stop = () => {
      cancelAnimationFrame(raf);
      INPUTS.forEach((t) => window.removeEventListener(t, stop));
      resolve();
    };
    INPUTS.forEach((t) => window.addEventListener(t, stop, { passive: true, once: true }));

    const tick = () => {
      const r = document.getElementById(anchor.id)?.getBoundingClientRect();
      const h = r?.height ?? 0;
      if (h > 0) {
        const top = r.top + window.scrollY + anchor.frac * h - window.innerHeight * LINE;
        window.scrollTo({ top: Math.max(0, top), behavior: 'instant' });
        // re-apply a few times: off-screen sections use content-visibility and settle their height late
        if (++settled >= 20) return stop();
      }
      if (++frames > 90) return stop();
      raf = requestAnimationFrame(tick);
    };
    tick(); // first attempt is synchronous (the Professional tree already has every section)
  });
}

/** Drop `?mode=` and `#hash` from the address bar without navigating (or put the hash back). */
export function cleanUrl(hashId = '') {
  const url = new URL(window.location.href);
  url.searchParams.delete('mode');
  url.hash = hashId && hashId !== 'title' ? `#${hashId}` : '';
  window.history.replaceState(window.history.state, '', url);
}
