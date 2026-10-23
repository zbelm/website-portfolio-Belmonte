import { memo, useMemo } from 'react';
import { CLOUD, circleGrid, gridToRects } from '../lib/pixelArt.js';

/** Deterministic pseudo-random generator so the skyline is identical every render. */
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const W = 1600;
const H = 320;

function buildSkyline(seed, { minH, maxH, lit }) {
  const r = rng(seed);
  const buildings = [];
  const windows = [];
  const antennas = [];
  let x = 0;
  while (x < W) {
    const w = Math.round((56 + r() * 96) / 8) * 8;
    const h = Math.round((minH + r() * (maxH - minH)) / 8) * 8;
    buildings.push({ x, w, h });
    if (r() < 0.25) antennas.push({ x: x + Math.round(w / 2 / 4) * 4, y: H - h - 20 });
    for (let wy = H - h + 12; wy < H - 20; wy += 16) {
      for (let wx = x + 8; wx < x + w - 10; wx += 14) {
        if (r() < lit) windows.push({ x: wx, y: wy, tone: r() < 0.7 ? 0 : r() < 0.6 ? 1 : 2 });
      }
    }
    x += w + (r() < 0.3 ? 8 : 0);
  }
  return { buildings, windows, antennas };
}

function Skyline({ data, className, windowClass = 'win' }) {
  // one <path> per color instead of hundreds of <rect>s keeps the DOM tiny
  const paths = useMemo(() => {
    const buildings =
      data.buildings.map((b) => rectPath(b.x, H - b.h, b.w, b.h)).join('') + data.antennas.map((a) => rectPath(a.x, a.y, 4, 20)).join('');
    const lights = data.antennas.map((a) => rectPath(a.x - 2, a.y - 6, 8, 6)).join('');
    const windows = [0, 1, 2].map((tone) =>
      data.windows
        .filter((w) => w.tone === tone)
        .map((w) => rectPath(w.x, w.y, 6, 8))
        .join(''),
    );
    return { buildings, lights, windows };
  }, [data]);

  return (
    <svg className={className} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      <path className="bld" d={paths.buildings} />
      <path className="antenna-light" d={paths.lights} />
      {paths.windows.map((d, tone) => (
        <path key={tone} className={`${windowClass} t${tone}`} d={d} />
      ))}
    </svg>
  );
}

const rectPath = (x, y, w, h) => `M${x} ${y}h${w}v${h}h${-w}z`;

/** A pixel grid drawn as a single <path>. */
function PixelGrid({ grid, className, x = 0, y = 0 }) {
  const d = useMemo(() => gridToRects(grid).map((r) => rectPath(r.x, r.y, r.w, 1)).join(''), [grid]);
  return <path className={className} transform={`translate(${x} ${y})`} d={d} />;
}

/**
 * The hero's pixel world. Layers carry `data-depth` for scroll
 * parallax (GSAP, in Hero.jsx) and `--d` for mouse parallax (CSS).
 * Night shows stars + moon + neon windows, day shows sun + hills.
 */
function HeroScene() {
  const far = useMemo(() => buildSkyline(7, { minH: 120, maxH: 230, lit: 0.12 }), []);
  const near = useMemo(() => buildSkyline(42, { minH: 60, maxH: 170, lit: 0.28 }), []);
  const stars = useMemo(() => {
    const r = rng(99);
    return Array.from({ length: 70 }, (_, i) => ({ x: Math.round(r() * 400), y: Math.round(r() * 150), s: r() < 0.8 ? 1 : 2, g: i % 3 }));
  }, []);
  const moon = useMemo(() => circleGrid(14, 5), []);
  const sun = useMemo(() => circleGrid(16), []);
  // rolling pixel hills (day only): column heights from two sine waves
  const hills = useMemo(() => {
    const tops = Array.from({ length: 160 }, (_, x) => Math.round(12 + 6 * Math.sin(x / 13) + 3 * Math.sin(x / 5.3 + 1)));
    return Array.from({ length: 24 }, (_, y) => tops.map((t) => (y >= 24 - t ? 'x' : '.')).join(''));
  }, []);

  return (
    <div className="hero-scene" aria-hidden="true">
      <div className="layer layer-sky" />

      <div className="layer layer-stars night-only" data-depth="0.1" style={{ '--d': 0.1 }}>
        <svg viewBox="0 0 400 225" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges">
          {[0, 1, 2].map((g) => (
            <path
              key={g}
              className={`stars stars-${g}`}
              d={stars
                .filter((s) => s.g === g)
                .map((s) => rectPath(s.x, s.y, s.s, s.s))
                .join('')}
            />
          ))}
        </svg>
      </div>

      <div className="layer layer-orb" data-depth="0.15" style={{ '--d': 0.15 }}>
        <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className="orb">
          <PixelGrid grid={moon} className="moon night-only" />
          <PixelGrid grid={sun} className="sun day-only" />
        </svg>
      </div>

      <div className="layer layer-clouds" data-depth="0.25" style={{ '--d': 0.25 }}>
        <svg viewBox="0 0 400 120" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" className="clouds-strip">
          <PixelGrid grid={CLOUD} className="cloud" x={20} y={20} />
          <PixelGrid grid={CLOUD} className="cloud" x={150} y={44} />
          <PixelGrid grid={CLOUD} className="cloud" x={270} y={14} />
          <PixelGrid grid={CLOUD} className="cloud" x={350} y={58} />
        </svg>
      </div>

      <div className="layer layer-far" data-depth="0.35" style={{ '--d': 0.35 }}>
        <Skyline data={far} className="skyline skyline-far" windowClass="win-dim" />
      </div>

      <div className="layer layer-hills day-only" data-depth="0.45" style={{ '--d': 0.45 }}>
        <svg viewBox="0 0 160 40" preserveAspectRatio="xMidYMax slice" shapeRendering="crispEdges">
          <PixelGrid className="hill" grid={hills} y={16} />
        </svg>
      </div>

      <div className="layer layer-near" data-depth="0.6" style={{ '--d': 0.6 }}>
        <Skyline data={near} className="skyline skyline-near" />
      </div>

      <div className="layer layer-ground" data-depth="0.75" style={{ '--d': 0.75 }}>
        <div className="ground-top" />
        <div className="ground-grid" />
      </div>
    </div>
  );
}

export default memo(HeroScene);
