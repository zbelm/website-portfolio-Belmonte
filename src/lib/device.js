/**
 * Decide whether to load the Three.js hero.
 * Weak / small / data-saving devices get the CSS cube instead,
 * which keeps mobile Lighthouse scores high.
 */

/** Cheap checks — safe to run during page load. */
export function mightUse3D() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (!window.matchMedia('(min-width: 900px) and (pointer: fine)').matches) return false;
  if ((navigator.hardwareConcurrency || 2) < 4) return false;
  if (navigator.deviceMemory && navigator.deviceMemory < 4) return false;
  if (navigator.connection?.saveData) return false;
  return true;
}

/** Creating a WebGL context can take a while — only call this after the page is interactive. */
export function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}
