/**
 * Which "mode" of the site is showing: Player One (retro game, default)
 * or Professional. Separate from the Night Arcade / Day World light-dark
 * theme, which both modes share (see GameContext).
 *
 * Precedence on load: `?mode=pro` → saved choice (`p1-mode`) → Player One.
 * Switching swaps the whole tree in place: no reload, same section on screen.
 */
import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { storage } from '../lib/storage.js';
import { cleanUrl, captureAnchor, MODE_KEY, modeFromUrl, restoreAnchor } from '../lib/modeSwitch.js';
import { loadPro } from '../pro/load.js';

const ModeContext = createContext(null);

const initialMode = () => modeFromUrl() ?? (storage.get(MODE_KEY) === 'pro' ? 'pro' : 'player-one');

export function ModeProvider({ children }) {
  const [mode, setModeState] = useState(initialMode);
  const modeRef = useRef(mode);
  const busy = useRef(false);

  // layout effect so the new mode's CSS applies in the same frame as the new tree
  useLayoutEffect(() => {
    modeRef.current = mode;
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  /** Start downloading the Professional chunk (hover / focus on the switch, idle). */
  const prefetchPro = useCallback(() => {
    loadPro().catch(() => {});
  }, []);

  const setMode = useCallback(async (next) => {
    if (next === modeRef.current || busy.current) return;
    busy.current = true;
    storage.set(MODE_KEY, next);
    // never swap to a half-loaded tree: wait for the chunk first
    if (next === 'pro') await loadPro().catch(() => {});

    const anchor = captureAnchor();
    cleanUrl(); // Player One re-scrolls to location.hash on mount; our own restore replaces that

    let restored;
    // restore inside the callback so the cross-fade snapshots the right scroll position
    const apply = () => {
      flushSync(() => setModeState(next));
      restored = restoreAnchor(anchor);
    };
    const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (motionOk && typeof document.startViewTransition === 'function') {
      await document.startViewTransition(apply).finished.catch(() => {});
    } else {
      apply();
    }
    await restored;
    cleanUrl(anchor?.id);
    busy.current = false;
  }, []);

  const value = useMemo(() => ({ mode, setMode, prefetchPro }), [mode, setMode, prefetchPro]);
  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used inside <ModeProvider>');
  return ctx;
}
