import { useCallback, useEffect, useRef, useState } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { play } from '../lib/sound.js';
import profile from '../data/profile.json';

const LINES = [
  'P1-BIOS v2.6  (C) 2026 ZACH SYSTEMS',
  'MEMORY TEST ........ 640K OK',
  'LOADING SPRITES .... OK',
  'LOADING SKILL TREE . OK',
  'SYNCING TROPHIES ... OK',
  'CONNECTING TO RECRUITER ... OK',
];

const AUTO_START_MS = 3200;

/**
 * "PRESS START" intro with a fake boot log.
 * Shown once per visitor (App stores a flag), skippable with any key,
 * click or tap — and it auto-starts so nobody gets stuck here.
 */
export default function BootScreen({ onDone }) {
  const { reducedMotion } = useGame();
  const [shown, setShown] = useState(reducedMotion ? LINES.length : 0);
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);
  const startRef = useRef(null);
  const ready = shown >= LINES.length;

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setLeaving(true);
    play('start');
    setTimeout(onDone, reducedMotion ? 0 : 420);
  }, [onDone, reducedMotion]);

  // type out the boot log one line at a time
  useEffect(() => {
    if (ready) return undefined;
    const t = setTimeout(() => setShown((n) => n + 1), 230);
    return () => clearTimeout(t);
  }, [shown, ready]);

  useEffect(() => {
    if (!ready) return undefined;
    const t = setTimeout(finish, AUTO_START_MS);
    return () => clearTimeout(t);
  }, [ready, finish]);

  // any key / click / tap skips
  useEffect(() => {
    const skip = (e) => {
      if (e.type === 'keydown' && ['Tab', 'Shift', 'Alt', 'Control', 'Meta'].includes(e.key)) return;
      finish();
    };
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
  }, [finish]);

  useEffect(() => startRef.current?.focus({ preventScroll: true }), []);

  return (
    <div className={`boot ${leaving ? 'is-leaving' : ''}`} role="dialog" aria-modal="true" aria-label="Intro screen">
      <div className="boot-inner">
        <p className="boot-logo" aria-hidden="true">
          PLAYER
          <br />
          <span>ONE</span>
        </p>
        <p className="boot-sub">
          {profile.firstName} {profile.lastName} · Portfolio
        </p>
        <ul className="boot-log" aria-hidden="true">
          {LINES.slice(0, shown).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <button ref={startRef} type="button" className="boot-start" onClick={finish}>
          <span className="blink">▶ PRESS START</span>
        </button>
        <p className="boot-hint">Any key · click · tap{ready ? ' — auto-starting…' : ''}</p>
      </div>
    </div>
  );
}
