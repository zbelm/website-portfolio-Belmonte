/**
 * Pixel art is stored as text grids: one character = one pixel,
 * "." = transparent. A palette maps characters to colors.
 * gridToRects merges horizontal runs so SVGs stay small.
 */

export function gridToRects(grid) {
  const rects = [];
  grid.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      if (c === '.' || c === ' ') {
        x++;
        continue;
      }
      let w = 1;
      while (row[x + w] === c) w++;
      rects.push({ x, y, w, c });
      x += w;
    }
  });
  return rects;
}

export const gridSize = (grid) => ({ w: Math.max(...grid.map((r) => r.length)), h: grid.length });

/** Pixel grid → standalone SVG data URI (used for the custom cursor). */
export function gridToDataUri(grid, palette, scale = 1) {
  const { w, h } = gridSize(grid);
  const rects = gridToRects(grid)
    .map((r) => `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="1" fill="${palette[r.c]}"/>`)
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w * scale}" height="${h * scale}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${rects}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/* ---------- Player avatar (16 × 20) ---------- */
export const AVATAR = [
  '....kkkkkkkk....',
  '...khhhhhhhhk...',
  '..khhhhhhhhhhk..',
  '..khhhhhhhhhhk..',
  '.ckhsshsshsshkc.',
  '.cksssssssssskc.',
  '.ckssessssesskc.',
  '.cksssssssssskc.',
  '..ksssmmmmsssk..',
  '...kssssssssk...',
  '....kksssskk....',
  '..kppppccppppk..',
  '.kppppcppcppppk.',
  '.kppppppppppppk.',
  'kspkppppppppkpsk',
  'ks.kppppppppk.sk',
  '...kbbbbbbbbk...',
  '...kbbbkkbbbk...',
  '...kbbbkkbbbk...',
  '..kwwwwk.kwwwwk.',
];

// walking frame: legs apart
export const AVATAR_WALK = [
  ...AVATAR.slice(0, 16),
  '..kbbbbbbbbbbk..',
  '..kbbbk..kbbbk..',
  '..kbbk....kbbk..',
  '.kwwwk....kwwwk.',
];

export const AVATAR_PALETTE = {
  k: '#1a1028', // outline
  h: '#3b2416', // hair
  s: '#f2c79b', // skin
  e: '#1a1028', // eyes
  m: '#c0605a', // mouth
  c: '#22d3ee', // headphones / hoodie strings
  p: '#8b5cf6', // hoodie
  b: '#2b2d5c', // pants
  w: '#f5f5f5', // shoes
};

/* ---------- Coin (8 × 8) ---------- */
export const COIN = [
  '..kkkk..',
  '.kyyyyk.',
  'kyywyyok',
  'kywyyyok',
  'kyyyyyok',
  'kyyyyyok',
  '.kooook.',
  '..kkkk..',
];
export const COIN_PALETTE = { k: '#5a3200', y: '#ffd84a', w: '#fff8d6', o: '#e09a1a' };

/* ---------- Trophy (12 × 12) ---------- */
export const TROPHY = [
  '..kkkkkkkk..',
  'kkkywyyyykkk',
  'kykywyyyykyk',
  'kykyyyyyykyk',
  '.kkyyyyyykk.',
  '...kyyyyok..',
  '....kyyok...',
  '.....kok....',
  '.....kyk....',
  '....kkkkk...',
  '...kyyyyyk..',
  '...kkkkkkk..',
];
export const TROPHY_PALETTE = { k: '#5a3200', y: '#ffd84a', w: '#fff8d6', o: '#e09a1a' };

/* ---------- Envelope (12 × 8) ---------- */
export const ENVELOPE = [
  'kkkkkkkkkkkk',
  'kkwwwwwwwwkk',
  'kwkwwwwwwkwk',
  'kwwkwwwwkwwk',
  'kwwwwkkwwwwk',
  'kwwwwwwwwwwk',
  'kwwwwwwwwwwk',
  'kkkkkkkkkkkk',
];
export const ENVELOPE_PALETTE = { k: '#1a1028', w: '#fff8d6' };

/* ---------- Cloud (16 × 6) ---------- */
export const CLOUD = [
  '.....wwww.......',
  '...wwwwwwww.....',
  '.wwwwwwwwwwwww..',
  'wwwwwwwwwwwwwwww',
  'wwwwwwwwwwwwwwww',
  '.wwwwwwwwwwwwww.',
];

/* ---------- HUD icons (x = currentColor) ---------- */
export const ICON_SUN = [
  '....x....',
  '.x.....x.',
  '...xxx...',
  '..xxxxx..',
  'x.xxxxx.x',
  '..xxxxx..',
  '...xxx...',
  '.x.....x.',
  '....x....',
];
export const ICON_MOON = [
  '...xxxx..',
  '.xxxx....',
  '.xxx.....',
  'xxx......',
  'xxx......',
  'xxx......',
  '.xxx.....',
  '.xxxx...x',
  '...xxxxx.',
];
export const ICON_SOUND_ON = [
  '...x.....',
  '..xx..x..',
  'xxxx...x.',
  'xxxx.x.x.',
  'xxxx.x.x.',
  'xxxx...x.',
  '..xx..x..',
  '...x.....',
];
export const ICON_SOUND_OFF = [
  '...x.....',
  '..xx.....',
  'xxxx.x.x.',
  'xxxx..x..',
  'xxxx.x.x.',
  'xxxx.....',
  '..xx.....',
  '...x.....',
];
export const ICON_TV = [
  '.x.....x.',
  '..x...x..',
  'xxxxxxxxx',
  'x.xxxxx.x',
  'x.xxxxx.x',
  'x.xxxxx.x',
  'xxxxxxxxx',
  '.x.....x.',
];
export const ICON_ARROW_DOWN = ['..xxx..', '..xxx..', 'xxxxxxx', '.xxxxx.', '..xxx..', '...x...'];
export const ICON_TRAY = ['x.......x', 'x.......x', 'xxxxxxxxx'];
export const ICON_PALETTE = { x: 'currentColor' };

/* ---------- Cursors ---------- */
export const CURSOR_ARROW = [
  'k..........',
  'kk.........',
  'kwk........',
  'kwwk.......',
  'kwwwk......',
  'kwwwwk.....',
  'kwwwwwk....',
  'kwwwwwwk...',
  'kwwwwwwwk..',
  'kwwwwwwwwk.',
  'kwwwwwkkkkk',
  'kwwkwwk....',
  'kwk.kwwk...',
  'kk..kwwk...',
  'k....kwwk..',
  '.....kkkk..',
];
export const CURSOR_HAND = [
  '....kk......',
  '...kwwk.....',
  '...kwwk.....',
  '...kwwk.....',
  '...kwwkkk...',
  '...kwwkwwkk.',
  '.kkkwwkwwkwk',
  'kwwkwwwwwwwk',
  'kwwkwwwwwwwk',
  '.kwwwwwwwwwk',
  '..kwwwwwwwwk',
  '..kwwwwwwwk.',
  '...kwwwwwwk.',
  '...kwwwwwwk.',
  '....kkkkkk..',
];
export const CURSOR_PALETTE = { k: '#12062b', w: '#ffffff' };

/** Filled pixel circle grid (sun / moon). `bite` cuts a crescent. */
export function circleGrid(size, bite = 0) {
  const r = size / 2;
  return Array.from({ length: size }, (_, y) =>
    Array.from({ length: size }, (_, x) => {
      const inside = (x + 0.5 - r) ** 2 + (y + 0.5 - r) ** 2 <= r * r;
      const bitten = bite && (x + 0.5 - r - bite) ** 2 + (y + 0.5 - r + bite / 2) ** 2 <= r * r * 0.8;
      return inside && !bitten ? 'x' : '.';
    }).join(''),
  );
}
