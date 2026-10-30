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

let proLoadFailed = false;

const BOOT_KEY = 'p1-booted'; // set by Player One's boot screen (App.jsx)

const ModeContext = createContext(null);

const initialMode = () => modeFromUrl() ?? (storage.get(MODE_KEY) === 'pro' ? 'pro' : 'player-one');

export function ModeProvider({ children }) {
  const [mode, setModeState] = useState(initialMode);
  const busy = useRef(false);
  const [pending, setPending] = useState(null);

  // layout effect so the new mode's CSS applies in the same frame as the new tree
  useLayoutEffect(() => {
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  /** Start downloading the Professional chunk (hover / focus on the switch, idle). */
  const prefetchPro = useCallback(() => {
    loadPro().catch(() => {});
  }, []);

  const setMode = useCallback(
    async (next) => {
      if (next === mode || busy.current) return;
      busy.current = true;
      setPending(next); // the switch shows the choice at once while the chunk and fonts load
      try {
        if (next === 'pro') {
          // browsers cache a failed import(), so after one failure the only retry is a real navigation
          if (proLoadFailed) {
            const url = new URL(window.location.href);
            url.searchParams.set('mode', 'pro');
            url.hash = captureAnchor()?.id ?? '';
            window.location.assign(url);
            return;
          }
          // never swap to a half-loaded tree: if the chunk can't load, stay where we are
          await loadPro().catch((e) => {
            proLoadFailed = true;
            throw e;
          });
          // have the fonts ready so the page doesn't reflow right after the cross-fade (but never wait long)
          await Promise.race([
            Promise.all(['400 1em Geist', '400 1em Gloock'].map((f) => document.fonts.load(f).catch(() => {}))),
            new Promise((r) => setTimeout(r, 600)),
          ]);
        } else {
          storage.set(BOOT_KEY, '1'); // switching over counts as having started: no boot screen on top of the restored scroll
        }
        storage.set(MODE_KEY, next);

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
      } catch {
        /* chunk failed to load (offline?): stay in the current mode */
      } finally {
        setPending(null);
        busy.current = false;
      }
    },
    [mode],
  );

  const value = useMemo(() => ({ mode, pending, setMode, prefetchPro }), [mode, pending, setMode, prefetchPro]);
  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used inside <ModeProvider>');
  return ctx;
}
