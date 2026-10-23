import { useGame } from '../context/GameContext.jsx';
import { TROPHY, TROPHY_PALETTE } from '../lib/pixelArt.js';
import PixelSprite from './PixelSprite.jsx';

/** "Achievement unlocked" pop-ups (announced politely to screen readers). */
export default function Toasts() {
  const { toasts } = useGame();
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          <PixelSprite grid={TROPHY} palette={TROPHY_PALETTE} scale={3} />
          <div>
            <p className="toast-title">{t.title}</p>
            <p className="toast-text">{t.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
