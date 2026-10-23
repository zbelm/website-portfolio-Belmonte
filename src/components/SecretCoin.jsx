import { useState } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { COIN, COIN_PALETTE } from '../lib/pixelArt.js';
import PixelSprite from './PixelSprite.jsx';

/** A hidden collectible coin. Disappears once collected (remembered per visitor). */
export default function SecretCoin({ id, className = '' }) {
  const { coins, collectCoin } = useGame();
  const [popping, setPopping] = useState(false);

  if (coins.has(id) && !popping) return null;

  const onClick = () => {
    if (popping) return;
    setPopping(true);
    collectCoin(id);
    setTimeout(() => setPopping(false), 700);
  };

  return (
    <button
      type="button"
      className={`secret-coin ${popping ? 'is-popping' : ''} ${className}`}
      onClick={onClick}
      aria-label="Secret coin — collect it"
    >
      <PixelSprite grid={COIN} palette={COIN_PALETTE} scale={3} />
    </button>
  );
}
