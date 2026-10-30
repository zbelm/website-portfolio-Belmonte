/** "2025-06" or "2025-06-14" → "Jun 2025" */
export function formatMonth(value) {
  if (!value) return '';
  const [y, m] = String(value).split('-').map(Number);
  if (!y || !m) return value;
  try {
    return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(new Date(y, m - 1, 1));
  } catch {
    return value;
  }
}

/** 84213 → "82 KB" */
export function formatBytes(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const isPlaceholder = (text) => typeof text === 'string' && text.includes('[REPLACE ME]');

// injected by vite.config.js from the real size of public/resume.pdf
// eslint-disable-next-line no-undef
export const RESUME_BYTES = typeof __RESUME_SIZE__ !== 'undefined' ? __RESUME_SIZE__ : 0;
