import { useId } from 'react';
import { useMode } from '../context/ModeContext.jsx';

const OPTIONS = [
  { value: 'player-one', label: 'Player One' },
  { value: 'pro', label: 'Professional' },
];

/**
 * "Player One | Professional" segmented control. Native radios give the
 * radio-group keyboard behavior (arrow keys, one tab stop) for free; each skin
 * (pixel HUD / professional nav) styles the same markup.
 */
export default function ModeSwitch({ className = '' }) {
  const { mode, pending, setMode, prefetchPro } = useMode();
  const shown = pending ?? mode;
  const name = useId();

  return (
    <div
      className={`mode-switch ${className}`}
      role="radiogroup"
      aria-label="Site mode"
      onPointerEnter={prefetchPro}
      onFocus={prefetchPro}
    >
      {OPTIONS.map((o) => (
        <label key={o.value} className="mode-switch-opt">
          <input type="radio" name={name} value={o.value} checked={shown === o.value} onChange={() => setMode(o.value)} />
          <span>{o.label}</span>
        </label>
      ))}
    </div>
  );
}
