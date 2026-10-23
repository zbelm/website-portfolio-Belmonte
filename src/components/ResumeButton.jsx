import { useRef, useState } from 'react';
import { SITE } from '../config/site.js';
import { formatBytes } from '../lib/format.js';
import { ICON_ARROW_DOWN, ICON_PALETTE, ICON_TRAY } from '../lib/pixelArt.js';
import PixelSprite from './PixelSprite.jsx';

// injected by vite.config.js from the real size of public/resume.pdf
// eslint-disable-next-line no-undef
const RESUME_BYTES = typeof __RESUME_SIZE__ !== 'undefined' ? __RESUME_SIZE__ : 0;

/**
 * Download Resume (PDF) button with a pixel "arrow drops into tray" animation
 * and the file size label. `variant="hud"` is the compact nav version.
 */
export default function ResumeButton({ variant = 'hero', className = '' }) {
  const [state, setState] = useState('idle');
  const timers = useRef([]);

  const onClick = () => {
    timers.current.forEach(clearTimeout);
    setState('downloading');
    timers.current = [setTimeout(() => setState('done'), 900), setTimeout(() => setState('idle'), 2800)];
  };

  const compact = variant === 'hud';
  const size = formatBytes(RESUME_BYTES);

  return (
    <a
      className={`btn btn-yellow resume-btn is-${state} ${compact ? 'btn-sm' : ''} ${className}`}
      href={SITE.resume.href}
      download={SITE.resume.fileName}
      onClick={onClick}
    >
      <span className="dl-icon" aria-hidden="true">
        <PixelSprite grid={ICON_ARROW_DOWN} palette={ICON_PALETTE} scale={2} className="dl-arrow" />
        <PixelSprite grid={ICON_TRAY} palette={ICON_PALETTE} scale={2} className="dl-tray" />
      </span>
      {/* visible text stays inside the accessible name (WCAG 2.5.3) */}
      {compact && <span className="sr-only">Download </span>}
      <span className="resume-text">{state === 'done' ? 'Saved!' : compact ? 'Resume' : 'Download Resume'}</span>
      {compact ? <span className="sr-only"> (PDF, {size})</span> : <span className="resume-meta">PDF · {size}</span>}
      <span className="dl-progress" aria-hidden="true" />
    </a>
  );
}
