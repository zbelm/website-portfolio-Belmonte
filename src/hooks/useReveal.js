import { useEffect } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { revealOnView } from '../lib/motion.js';

/**
 * Standard "level enter" animation for a section:
 *  - the level title does a stepped screen-wipe
 *  - every [data-reveal] child pops in with an 8-bit stepped ease
 *  - XP bars / trophies inside the section fill and flip in
 * The animations themselves are CSS (base.css, `.motion-ok` rules);
 * this hook only flags elements with `.is-in` as they enter the viewport.
 */
export function useReveal(ref) {
  const { reducedMotion } = useGame();

  useEffect(() => {
    if (reducedMotion || !ref.current) return undefined;
    return revealOnView(ref.current.querySelectorAll('.level-title, [data-reveal], .xp-fill, .trophy'));
  }, [reducedMotion, ref]);
}
