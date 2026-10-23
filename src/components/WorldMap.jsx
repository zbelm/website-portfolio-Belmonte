import { useEffect, useRef } from 'react';
import { LEVELS } from '../config/levels.js';
import { AVATAR, AVATAR_PALETTE, AVATAR_WALK } from '../lib/pixelArt.js';
import { loadGsap } from '../lib/motion.js';
import PixelSprite from './PixelSprite.jsx';

/**
 * World-map progress: a vertical rail of level nodes on desktop
 * (a thin bar under the HUD on mobile). The mini character walks
 * along it as you scroll — progress is written to a CSS variable,
 * so React never re-renders on scroll.
 */
export default function WorldMap({ activeId }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    let idle;
    let st;
    let alive = true;
    loadGsap().then(({ ScrollTrigger }) => {
      if (!alive) return;
      st = ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          el.style.setProperty('--p', self.progress.toFixed(4));
          el.classList.add('is-walking');
          clearTimeout(idle);
          idle = setTimeout(() => el.classList.remove('is-walking'), 160);
        },
      });
      el.style.setProperty('--p', st.progress.toFixed(4));
    });
    return () => {
      alive = false;
      st?.kill();
      clearTimeout(idle);
    };
  }, []);

  const activeIndex = Math.max(0, LEVELS.findIndex((l) => l.id === activeId));

  return (
    <nav ref={ref} className="worldmap" aria-label="Level progress">
      <div className="worldmap-rail">
        <ol className="worldmap-track">
          {LEVELS.map((l, i) => (
            <li key={l.id} className={i < activeIndex ? 'is-cleared' : i === activeIndex ? 'is-current' : ''}>
              <a href={`#${l.id}`} aria-current={i === activeIndex ? 'step' : undefined}>
                <span className="worldmap-node" aria-hidden="true" />
                <span className="worldmap-label">
                  <span className="worldmap-world">{l.world}</span> {l.name}
                </span>
              </a>
            </li>
          ))}
        </ol>
        <div className="worldmap-hero" aria-hidden="true">
          <PixelSprite grid={AVATAR} palette={AVATAR_PALETTE} scale={2} className="frame-a" />
          <PixelSprite grid={AVATAR_WALK} palette={AVATAR_PALETTE} scale={2} className="frame-b" />
        </div>
      </div>

      <div className="worldmap-bar" aria-hidden="true">
        <div className="worldmap-bar-fill" />
        <div className="worldmap-bar-hero">
          <PixelSprite grid={AVATAR} palette={AVATAR_PALETTE} scale={1} className="frame-a" />
          <PixelSprite grid={AVATAR_WALK} palette={AVATAR_PALETTE} scale={1} className="frame-b" />
        </div>
      </div>
    </nav>
  );
}
