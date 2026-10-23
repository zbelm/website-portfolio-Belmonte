import { useRef, useState } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { AVATAR, AVATAR_PALETTE, COIN, COIN_PALETTE } from '../lib/pixelArt.js';
import { play } from '../lib/sound.js';
import PixelSprite from './PixelSprite.jsx';

/**
 * My pixel character. Idle bob + blink via CSS; click/tap to jump.
 * The very first jump pays out a secret coin.
 */
export default function Avatar({ scale = 8, interactive = true }) {
  const { collectCoin, reducedMotion } = useGame();
  const [jumping, setJumping] = useState(false);
  const [coinPop, setCoinPop] = useState(false);
  const busy = useRef(false);

  const sprite = <PixelSprite grid={AVATAR} palette={AVATAR_PALETTE} scale={scale} classMap={{ e: 'px-eye' }} />;

  if (!interactive) return <div className="avatar is-static">{sprite}</div>;

  const jump = () => {
    if (busy.current) return;
    busy.current = true;
    setJumping(true);
    play('jump');
    if (collectCoin('avatar')) {
      setCoinPop(true);
      setTimeout(() => setCoinPop(false), 900);
    }
    setTimeout(
      () => {
        setJumping(false);
        busy.current = false;
      },
      reducedMotion ? 60 : 620,
    );
  };

  return (
    <button type="button" className={`avatar ${jumping ? 'is-jumping' : ''}`} onClick={jump} aria-label="Make my character jump">
      <span className="avatar-body">{sprite}</span>
      {coinPop && (
        <span className="coin-pop" aria-hidden="true">
          <PixelSprite grid={COIN} palette={COIN_PALETTE} scale={4} />
          +1
        </span>
      )}
      <span className="avatar-shadow" aria-hidden="true" />
    </button>
  );
}
