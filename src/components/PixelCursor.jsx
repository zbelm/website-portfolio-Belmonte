import { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { CURSOR_ARROW, CURSOR_HAND, CURSOR_PALETTE, gridToDataUri } from '../lib/pixelArt.js';

const TRAIL = 6;

/**
 * Pixel cursor (pure CSS `cursor:` so it never lags) + a snapping
 * pixel trail. Only on mouse/trackpad devices; trail is skipped for
 * reduced motion. Text fields keep the normal text cursor.
 */
export default function PixelCursor() {
  const { reducedMotion } = useGame();
  const finePointer = useMediaQuery('(pointer: fine)');
  const trailRef = useRef(null);

  useEffect(() => {
    if (!finePointer) return undefined;
    const root = document.documentElement;
    root.style.setProperty('--cursor-arrow', `url("${gridToDataUri(CURSOR_ARROW, CURSOR_PALETTE, 2)}") 0 0, auto`);
    root.style.setProperty('--cursor-hand', `url("${gridToDataUri(CURSOR_HAND, CURSOR_PALETTE, 2)}") 9 0, pointer`);
    root.dataset.cursor = 'pixel';
    return () => delete root.dataset.cursor;
  }, [finePointer]);

  useEffect(() => {
    if (!finePointer || reducedMotion || !trailRef.current) return undefined;
    const dots = [...trailRef.current.children];
    const pts = dots.map(() => ({ x: -50, y: -50 }));
    let mx = -50;
    let my = -50;
    let raf = 0;
    let idleFrames = 0;

    const tick = () => {
      let x = mx;
      let y = my;
      pts.forEach((p, i) => {
        p.x += (x - p.x) * 0.45;
        p.y += (y - p.y) * 0.45;
        // snap to a 4px grid for that chunky pixel feel
        dots[i].style.transform = `translate3d(${Math.round(p.x / 4) * 4}px, ${Math.round(p.y / 4) * 4}px, 0)`;
        x = p.x;
        y = p.y;
      });
      idleFrames++;
      raf = idleFrames < 45 ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e) => {
      mx = e.clientX + 6;
      my = e.clientY + 10;
      idleFrames = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [finePointer, reducedMotion]);

  if (!finePointer || reducedMotion) return null;

  return (
    <div className="cursor-trail" ref={trailRef} aria-hidden="true">
      {Array.from({ length: TRAIL }, (_, i) => (
        <span key={i} style={{ '--i': i }} />
      ))}
    </div>
  );
}
