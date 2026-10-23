/**
 * Global "game state": theme, sound, CRT overlay, secret coins, toasts
 * and the visitor's reduced-motion preference. Persisted per visitor
 * in localStorage (see lib/storage.js).
 */
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { storage } from '../lib/storage.js';
import { play, setSoundEnabled } from '../lib/sound.js';
import { useMediaQuery } from '../hooks/useMediaQuery.js';

/** Secret coins hidden around the site. Add an id here + a <SecretCoin id="..."/> to add more. */
export const COIN_IDS = ['avatar', 'about', 'projects', 'achievements', 'footer'];

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const prefersLight = useMediaQuery('(prefers-color-scheme: light)');

  // enables the CSS scroll-reveal start states (base.css) only when motion is welcome
  useLayoutEffect(() => {
    document.documentElement.classList.toggle('motion-ok', !reducedMotion);
  }, [reducedMotion]);

  /* ---------- Toasts ("Achievement unlocked!") ---------- */
  const [toasts, setToasts] = useState([]);
  const pushToast = useCallback((toast) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((list) => [...list.slice(-2), { id, ...toast }]);
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 4200);
  }, []);

  /* ---------- Theme: Night Arcade (dark) / Day World (light) ---------- */
  const [themeChoice, setThemeChoice] = useState(() => storage.get('p1-theme'));
  const theme = themeChoice === 'light' || themeChoice === 'dark' ? themeChoice : prefersLight ? 'light' : 'dark';

  // layout effect so children read the new CSS variables in their own effects
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((m) => m.setAttribute('content', theme === 'light' ? '#eaf6ff' : '#0d0221'));
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setThemeChoice(next);
    storage.set('p1-theme', next);
    play('toggle');
  }, [theme]);

  /* ---------- Sound (OFF by default) ---------- */
  const [sound, setSound] = useState(() => storage.get('p1-sound') === 'on');
  useEffect(() => setSoundEnabled(sound), [sound]);
  const toggleSound = useCallback(() => {
    const next = !sound;
    setSound(next);
    setSoundEnabled(next);
    storage.set('p1-sound', next ? 'on' : 'off');
    if (next) play('toggle');
  }, [sound]);

  /* ---------- CRT scanlines ---------- */
  const [crt, setCrt] = useState(() => storage.get('p1-crt') !== 'off');
  useLayoutEffect(() => {
    document.documentElement.dataset.crt = crt ? 'on' : 'off';
  }, [crt]);
  const toggleCrt = useCallback(() => {
    const next = !crt;
    setCrt(next);
    storage.set('p1-crt', next ? 'on' : 'off');
    play('toggle');
  }, [crt]);

  /* ---------- Secret coins ---------- */
  const [coins, setCoins] = useState(
    () => new Set(storage.getJSON('p1-coins', []).filter((id) => COIN_IDS.includes(id))),
  );
  const coinsRef = useRef(coins);

  /** Returns true if this coin was newly collected. */
  const collectCoin = useCallback(
    (id) => {
      if (coinsRef.current.has(id)) return false;
      const next = new Set(coinsRef.current);
      next.add(id);
      coinsRef.current = next;
      setCoins(next);
      storage.setJSON('p1-coins', [...next]);
      play('coin');
      if (next.size === COIN_IDS.length) {
        play('jingle');
        pushToast({ title: 'Achievement unlocked!', text: 'Treasure Hunter — you found every secret coin.' });
      } else {
        pushToast({ title: 'Secret coin!', text: `${next.size} / ${COIN_IDS.length} coins found` });
      }
      return true;
    },
    [pushToast],
  );

  const unlock = useCallback(
    (title, text) => {
      play('jingle');
      pushToast({ title, text });
    },
    [pushToast],
  );

  const value = useMemo(
    () => ({
      reducedMotion,
      theme,
      toggleTheme,
      sound,
      toggleSound,
      crt,
      toggleCrt,
      coins,
      totalCoins: COIN_IDS.length,
      collectCoin,
      toasts,
      pushToast,
      unlock,
    }),
    [reducedMotion, theme, toggleTheme, sound, toggleSound, crt, toggleCrt, coins, collectCoin, toasts, pushToast, unlock],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>');
  return ctx;
}
