import { useEffect } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { play } from '../lib/sound.js';

const INTERACTIVE = 'a, button, [role="button"], summary, label.chip';

/** Coin-collect sparkle burst at (x, y). Plain DOM — removed when the animation ends. */
function sparkle(x, y) {
  const burst = document.createElement('span');
  burst.className = 'sparkle-burst';
  burst.style.left = `${x}px`;
  burst.style.top = `${y}px`;
  for (let i = 0; i < 8; i++) {
    const s = document.createElement('span');
    const angle = (i / 8) * Math.PI * 2;
    s.style.setProperty('--dx', `${Math.round(Math.cos(angle) * 26)}px`);
    s.style.setProperty('--dy', `${Math.round(Math.sin(angle) * 26)}px`);
    burst.appendChild(s);
  }
  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 600);
}

/**
 * Site-wide interaction feedback, delegated from the document:
 * click → blip + sparkle, hover → tiny blip (only if sound is on).
 */
export default function Interactions() {
  const { reducedMotion } = useGame();

  useEffect(() => {
    let lastHovered = null;

    const onClick = (e) => {
      const el = e.target.closest?.(INTERACTIVE);
      if (!el) return;
      play('click');
      // keyboard "clicks" report 0,0 — skip the sparkle for those
      if (!reducedMotion && (e.clientX || e.clientY)) sparkle(e.clientX, e.clientY);
    };

    const onOver = (e) => {
      const el = e.target.closest?.(INTERACTIVE);
      if (el && el !== lastHovered) play('hover');
      lastHovered = el;
    };

    document.addEventListener('click', onClick);
    document.addEventListener('pointerover', onOver);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('pointerover', onOver);
    };
  }, [reducedMotion]);

  return null;
}
