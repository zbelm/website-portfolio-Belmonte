import { useEffect } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';

/**
 * Cursor-following spotlight on `.pro-card`s inside `ref`. The glow is a fixed-size layer
 * moved with `transform` (compositor-only); CSS fades it in on :hover. Mouse-like pointers only.
 */
export function useSpotlight(ref) {
  const { reducedMotion } = useGame();
  const mouse = useMediaQuery('(hover: hover) and (pointer: fine)');

  useEffect(() => {
    const root = ref.current;
    if (!root || reducedMotion || !mouse) return undefined;
    let raf = 0;
    let last;
    const paint = () => {
      raf = 0;
      const { card, x, y } = last;
      const r = card.getBoundingClientRect();
      const spot = card.querySelector('.pro-spot');
      if (spot) spot.style.transform = `translate3d(${x - r.left}px, ${y - r.top}px, 0)`;
    };
    const onMove = (e) => {
      const card = e.target.closest?.('.pro-card, .pro-cert');
      if (!card) return;
      last = { card, x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(paint);
    };
    root.addEventListener('pointermove', onMove);
    return () => {
      root.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [ref, reducedMotion, mouse]);
}
