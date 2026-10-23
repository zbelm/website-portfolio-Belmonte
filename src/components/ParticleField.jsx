import { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext.jsx';

/**
 * Full-page floating pixels / stars that drift up and scatter away
 * from the mouse. Drawn on one <canvas>; paused when the tab is hidden.
 * Reduced motion → a single static frame.
 */
export default function ParticleField() {
  const ref = useRef(null);
  const { reducedMotion, theme } = useGame();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const css = getComputedStyle(document.documentElement);
    const colors = ['--purple', '--cyan', '--pink', '--yellow'].map((v) => css.getPropertyValue(v).trim());
    const night = theme === 'dark';
    const mouse = { x: -9999, y: -9999 };
    let W = 0;
    let H = 0;
    let parts = [];
    let raf = 0;

    const spawn = (anywhere) => ({
      x: Math.random() * W,
      y: anywhere ? Math.random() * H : H + 8,
      s: Math.random() < 0.7 ? 2 : Math.random() < 0.8 ? 3 : 4,
      vx: (Math.random() - 0.5) * 0.12,
      vy: -(0.08 + Math.random() * 0.3),
      c: colors[(Math.random() * colors.length) | 0],
      a: (night ? 0.45 : 0.3) + Math.random() * 0.45,
      tw: Math.random() * Math.PI * 2,
      ox: 0,
      oy: 0,
    });

    const draw = (t = 0) => {
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        const twinkle = night ? 0.6 + 0.4 * Math.sin(t / 600 + p.tw) : 1;
        ctx.globalAlpha = p.a * twinkle;
        ctx.fillStyle = p.c;
        ctx.fillRect(Math.round(p.x + p.ox), Math.round(p.y + p.oy), p.s, p.s);
      }
      ctx.globalAlpha = 1;
    };

    const step = (t) => {
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) Object.assign(p, spawn(false));
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        // push away from the cursor
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 14400) {
          const d = Math.sqrt(d2) || 1;
          const force = ((120 - d) / 120) * 22;
          p.ox += ((dx / d) * force - p.ox) * 0.15;
          p.oy += ((dy / d) * force - p.oy) * 0.15;
        } else {
          p.ox *= 0.92;
          p.oy *= 0.92;
        }
      }
      draw(t);
      raf = requestAnimationFrame(step);
    };

    const resize = () => {
      const widthChanged = window.innerWidth !== W;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      // mobile URL bars fire resize on scroll: only respawn when the width changes
      if (widthChanged) {
        const count = Math.min(110, Math.round((W * H) / 14000));
        parts = Array.from({ length: count }, () => spawn(true));
      }
      draw();
    };

    resize();
    window.addEventListener('resize', resize);
    if (reducedMotion) return () => window.removeEventListener('resize', resize);

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(step);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);
    // start after first paint so it never competes with page load
    const start = setTimeout(() => (raf = requestAnimationFrame(step)), 900);

    return () => {
      clearTimeout(start);
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reducedMotion, theme]);

  return <canvas ref={ref} className="particles" aria-hidden="true" />;
}
