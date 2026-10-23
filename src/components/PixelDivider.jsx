import { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { loadGsap, onceInView } from '../lib/motion.js';

const COLS = 16;
const ROWS = 2;

/**
 * Section transition: a band of blocks in the previous section's color
 * that pixel-dissolves (random order, stepped) as the new level scrolls in.
 * Reduced motion: a static jagged pixel edge instead.
 */
export default function PixelDivider({ color = 'var(--bg)' }) {
  const ref = useRef(null);
  const { reducedMotion } = useGame();

  useEffect(() => {
    const el = ref.current;
    if (reducedMotion || !el) return undefined;
    let tween;
    let alive = true;
    const stop = onceInView(el, () =>
      loadGsap().then(({ gsap }) => {
        if (!alive) return;
        tween = gsap.to(el.children, { scale: 0, duration: 0.2, ease: 'steps(2)', stagger: { amount: 0.7, from: 'random' } });
      }),
    );
    return () => {
      alive = false;
      stop();
      tween?.revert();
    };
  }, [reducedMotion]);

  return (
    <div ref={ref} className={`pixel-divider ${reducedMotion ? 'is-static' : ''}`} style={{ '--divider': color }} aria-hidden="true">
      {Array.from({ length: COLS * ROWS }, (_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}
