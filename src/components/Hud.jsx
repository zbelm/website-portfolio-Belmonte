import { useEffect, useRef, useState } from 'react';
import { LEVELS } from '../config/levels.js';
import { useGame } from '../context/GameContext.jsx';
import {
  COIN,
  COIN_PALETTE,
  ICON_MOON,
  ICON_PALETTE,
  ICON_SOUND_OFF,
  ICON_SOUND_ON,
  ICON_SUN,
  ICON_TV,
} from '../lib/pixelArt.js';
import PixelSprite from './PixelSprite.jsx';
import ResumeButton from './ResumeButton.jsx';

const NAV = LEVELS.slice(1);

function CoinCounter({ className = '' }) {
  const { coins, totalCoins } = useGame();
  return (
    <span className={`coin-counter ${className}`} title="Secret coins found">
      <PixelSprite grid={COIN} palette={COIN_PALETTE} scale={2} />
      <span aria-hidden="true">
        {coins.size}/{totalCoins}
      </span>
      <span className="sr-only">
        Secret coins found: {coins.size} of {totalCoins}
      </span>
    </span>
  );
}

function Toggles({ withLabels = false }) {
  const { theme, toggleTheme, sound, toggleSound, crt, toggleCrt } = useGame();
  const themeLabel = theme === 'dark' ? 'Switch to Day World (light mode)' : 'Switch to Night Arcade (dark mode)';
  return (
    <>
      <button type="button" className="hud-icon-btn hud-theme" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel}>
        <PixelSprite grid={theme === 'dark' ? ICON_MOON : ICON_SUN} palette={ICON_PALETTE} scale={2} />
        {withLabels && <span>{theme === 'dark' ? 'Night Arcade' : 'Day World'}</span>}
      </button>
      <button
        type="button"
        className="hud-icon-btn hud-opt"
        onClick={toggleSound}
        aria-pressed={sound}
        aria-label="Sound effects"
        title={`Sound effects: ${sound ? 'on' : 'off'}`}
      >
        <PixelSprite grid={sound ? ICON_SOUND_ON : ICON_SOUND_OFF} palette={ICON_PALETTE} scale={2} />
        {withLabels && <span>SFX {sound ? 'ON' : 'OFF'}</span>}
      </button>
      <button
        type="button"
        className="hud-icon-btn hud-opt"
        onClick={toggleCrt}
        aria-pressed={crt}
        aria-label="CRT scanline effect"
        title={`CRT effect: ${crt ? 'on' : 'off'}`}
      >
        <PixelSprite grid={ICON_TV} palette={ICON_PALETTE} scale={2} />
        {withLabels && <span>CRT {crt ? 'ON' : 'OFF'}</span>}
      </button>
    </>
  );
}

/** Sticky top HUD: logo, section links, resume, toggles + mobile "pause menu". */
export default function Hud({ activeId }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onResize = () => window.innerWidth >= 1180 && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    menuRef.current?.querySelector('a')?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="hud">
      <div className="hud-bar">
        <a className="hud-logo" href="#title" onClick={close}>
          <span className="hud-logo-badge" aria-hidden="true">
            P1
          </span>
          <span className="hud-logo-name" aria-hidden="true">
            Zach<span>.dev</span>
          </span>
          <span className="sr-only">Francis Zachary Belmonte — back to top</span>
        </a>

        <nav className="hud-nav" aria-label="Sections">
          <ul>
            {NAV.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className={activeId === l.id ? 'is-active' : ''} aria-current={activeId === l.id ? 'true' : undefined}>
                  {l.short}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hud-tools">
          <CoinCounter className="hide-below-sm" />
          <ResumeButton variant="hud" className="hide-below-sm" />
          <Toggles />
          <button
            ref={buttonRef}
            type="button"
            className="hud-menu-btn"
            aria-expanded={open}
            aria-controls="hud-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="burger" aria-hidden="true" />
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
      </div>

      <div id="hud-menu" ref={menuRef} className="hud-menu" hidden={!open}>
        <p className="hud-menu-title" aria-hidden="true">
          — PAUSE MENU —
        </p>
        <nav aria-label="Sections (menu)">
          <ul className="hud-menu-links">
            {NAV.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} onClick={close} aria-current={activeId === l.id ? 'true' : undefined}>
                  <span className="hud-menu-world">{l.world}</span> {l.short}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hud-menu-tools">
          <ResumeButton />
          <div className="hud-menu-toggles">
            <Toggles withLabels />
          </div>
          <CoinCounter />
        </div>
      </div>
    </header>
  );
}
