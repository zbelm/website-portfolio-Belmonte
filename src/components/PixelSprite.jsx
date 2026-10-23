import { useMemo } from 'react';
import { gridSize, gridToRects } from '../lib/pixelArt.js';

/**
 * Renders a text-grid sprite (see lib/pixelArt.js) as a crisp SVG —
 * one <path> per palette color, so even big sprites stay a handful of nodes.
 * `classMap` attaches CSS classes to specific palette keys
 * (e.g. { e: 'px-eye' } so the eyes can blink).
 */
export default function PixelSprite({ grid, palette, scale = 4, className = '', title, classMap }) {
  const layers = useMemo(() => {
    const byColor = new Map();
    gridToRects(grid).forEach((r) => {
      byColor.set(r.c, (byColor.get(r.c) || '') + `M${r.x} ${r.y}h${r.w}v1h${-r.w}z`);
    });
    return [...byColor.entries()];
  }, [grid]);
  const { w, h } = gridSize(grid);

  return (
    <svg
      className={`pixel-sprite ${className}`}
      viewBox={`0 0 ${w} ${h}`}
      width={w * scale}
      height={h * scale}
      shapeRendering="crispEdges"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title && <title>{title}</title>}
      {layers.map(([c, d]) => (
        <path key={c} d={d} fill={palette[c]} className={classMap?.[c]} />
      ))}
    </svg>
  );
}
