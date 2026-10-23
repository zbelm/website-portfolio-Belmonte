import { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext.jsx';

/** One-shot pixel confetti burst (Konami code reward). Skipped for reduced motion. */
export default function Confetti({ onDone }) {
  const ref = useRef(null);
  const { reducedMotion } = useGame();

  useEffect(() => {
    if (reducedMotion) {
      onDone();
      return undefined;
    }
    const canvas = ref.current;
    const g = canvas.getContext('2d');
    const W = (canvas.width = window.innerWidth);
    const H = (canvas.height = window.innerHeight);
    const colors = ['#ffe45c', '#3be8ff', '#ff7ccb', '#b69cff', '#5dff9b'];
    const parts = Array.from({ length: 170 }, () => ({
      x: W / 2 + (Math.random() - 0.5) * W * 0.3,
      y: H * 0.4,
      vx: (Math.random() - 0.5) * 16,
      vy: -Math.random() * 15 - 4,
      s: 4 + ((Math.random() * 3) | 0) * 2,
      c: colors[(Math.random() * colors.length) | 0],
    }));
    const start = performance.now();
    let raf;
    const tick = (now) => {
      g.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.vy += 0.35;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        g.fillStyle = p.c;
        g.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s);
      }
      if (now - start < 3200) raf = requestAnimationFrame(tick);
      else onDone();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={ref} className="confetti" aria-hidden="true" />;
}
