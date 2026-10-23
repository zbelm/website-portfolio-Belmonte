/**
 * Hidden mini-game unlocked by the Konami code (or the footer "Insert coin" button).
 * COIN RUSH: catch coins (+1) and gems (+5), dodge bugs (−3) for 30 seconds.
 * Lazy-loaded, so it costs nothing until someone finds it.
 */
import { useEffect, useRef, useState } from 'react';
import { storage } from '../lib/storage.js';
import { play } from '../lib/sound.js';

const W = 320;
const H = 180;
const DURATION = 30;

export default function KonamiGame({ onClose }) {
  const dialogRef = useRef(null);
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState('ready'); // ready | playing | over
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(storage.get('p1-best', 0)) || 0);

  // open on mount; no close() in cleanup — that fires `close` → onClose and would unmount us
  // (the element is removed on unmount anyway)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
    document.documentElement.classList.add('is-locked');
    return () => document.documentElement.classList.remove('is-locked');
  }, []);

  // idle screen
  useEffect(() => {
    if (phase === 'playing') return;
    const g = canvasRef.current.getContext('2d');
    const css = getComputedStyle(document.documentElement);
    g.fillStyle = css.getPropertyValue('--bg').trim();
    g.fillRect(0, 0, W, H);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'playing') return undefined;
    const canvas = canvasRef.current;
    const g = canvas.getContext('2d');
    const css = getComputedStyle(document.documentElement);
    const col = (n) => css.getPropertyValue(n).trim();
    const C = {
      bg: col('--bg'),
      text: col('--text'),
      grid: col('--surface-2'),
      coin: col('--btn-yellow'),
      gem: col('--btn-cyan'),
      bug: col('--red'),
      player: col('--btn-pink'),
    };
    const player = { x: W / 2 - 14, w: 28, h: 8, speed: 180 };
    const keys = {};
    let items = [];
    let pops = [];
    let spawnIn = 0;
    let time = DURATION;
    let pts = 0;
    let last = performance.now();
    let raf;

    const onKeyDown = (e) => {
      const k = e.key.toLowerCase();
      if (['arrowleft', 'arrowright', 'a', 'd'].includes(k)) {
        keys[k] = true;
        e.preventDefault();
      }
    };
    const onKeyUp = (e) => (keys[e.key.toLowerCase()] = false);
    const onPointer = (e) => {
      const r = canvas.getBoundingClientRect();
      player.x = ((e.clientX - r.left) / r.width) * W - player.w / 2;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    canvas.addEventListener('pointermove', onPointer);
    canvas.addEventListener('pointerdown', onPointer);

    const groundY = H - 18;

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time -= dt;
      const elapsed = DURATION - time;

      if (keys.arrowleft || keys.a) player.x -= player.speed * dt;
      if (keys.arrowright || keys.d) player.x += player.speed * dt;
      player.x = Math.max(0, Math.min(W - player.w, player.x));

      spawnIn -= dt;
      if (spawnIn <= 0) {
        spawnIn = Math.max(0.25, 0.7 - elapsed * 0.012);
        const r = Math.random();
        items.push({
          x: 8 + Math.random() * (W - 24),
          y: -10,
          vy: 60 + Math.random() * 50 + elapsed * 2,
          type: r < 0.12 ? 'gem' : r < 0.36 ? 'bug' : 'coin',
        });
      }

      items = items.filter((it) => {
        it.y += it.vy * dt;
        const caught = it.y + 8 >= groundY && it.y <= groundY + player.h && it.x + 8 >= player.x && it.x <= player.x + player.w;
        if (caught) {
          const v = it.type === 'gem' ? 5 : it.type === 'bug' ? -3 : 1;
          pts = Math.max(0, pts + v);
          pops.push({ x: it.x, y: groundY - 8, t: 0.6, v });
          play(it.type === 'bug' ? 'error' : 'coin');
          return false;
        }
        return it.y < H;
      });

      // draw
      g.fillStyle = C.bg;
      g.fillRect(0, 0, W, H);
      g.fillStyle = C.grid;
      for (let x = 0; x < W; x += 16) g.fillRect(x, H - 8, 8, 2);
      items.forEach((it) => {
        g.fillStyle = C[it.type];
        if (it.type === 'bug') {
          g.fillRect(it.x, it.y + 2, 8, 4);
          g.fillRect(it.x + 2, it.y, 1, 8);
          g.fillRect(it.x + 5, it.y, 1, 8);
        } else if (it.type === 'gem') {
          g.fillRect(it.x + 2, it.y, 4, 8);
          g.fillRect(it.x, it.y + 2, 8, 4);
        } else {
          g.fillRect(it.x + 1, it.y, 6, 8);
          g.fillRect(it.x, it.y + 1, 8, 6);
        }
      });
      g.fillStyle = C.player;
      g.fillRect(player.x, groundY, player.w, player.h);
      g.fillRect(player.x, groundY - 4, 4, 4);
      g.fillRect(player.x + player.w - 4, groundY - 4, 4, 4);

      g.font = '8px "Press Start 2P", monospace';
      g.textBaseline = 'top';
      pops = pops.filter((p) => {
        p.t -= dt;
        p.y -= 30 * dt;
        g.fillStyle = p.v < 0 ? C.bug : C.coin;
        g.fillText(p.v > 0 ? `+${p.v}` : `${p.v}`, p.x, p.y);
        return p.t > 0;
      });
      g.fillStyle = C.text;
      g.fillText(`SCORE ${pts}`, 6, 6);
      g.fillText(`TIME ${Math.max(0, Math.ceil(time))}`, W - 76, 6);

      if (time <= 0) {
        setScore(pts);
        setBest((b) => {
          const nb = Math.max(b, pts);
          storage.set('p1-best', nb);
          return nb;
        });
        play('jingle');
        setPhase('over');
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('pointermove', onPointer);
      canvas.removeEventListener('pointerdown', onPointer);
    };
  }, [phase]);

  return (
    <dialog ref={dialogRef} className="modal game-modal" aria-labelledby="game-title" onClose={onClose}>
      <div className="modal-inner">
        <button type="button" className="modal-close" onClick={() => dialogRef.current.close()} aria-label="Close mini-game">
          ✕
        </button>
        <p className="modal-kicker">Cheat code accepted</p>
        <h2 id="game-title" className="modal-title">
          COIN RUSH
        </h2>
        <p className="game-help">
          Catch coins (+1) and gems (+5), dodge bugs (−3). Move with ← → or A / D, the mouse, or touch. 30 seconds!
        </p>
        <div className="game-screen">
          <canvas ref={canvasRef} width={W} height={H} className="game-canvas" role="img" aria-label="Coin Rush game area" />
          {phase !== 'playing' && (
            <div className="game-overlay">
              {phase === 'over' && (
                <p className="game-score">
                  SCORE {score} · BEST {best}
                </p>
              )}
              {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
              <button type="button" className="btn btn-yellow" onClick={() => setPhase('playing')} autoFocus>
                {phase === 'ready' ? '▶ Start' : '↻ Play again'}
              </button>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
