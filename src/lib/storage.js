/**
 * localStorage wrapper that never throws (private mode, blocked storage, etc.).
 * Only used for per-visitor conveniences: theme, sound, CRT, coins, boot screen.
 */
export const storage = {
  get(key, fallback = null) {
    try {
      const value = window.localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, String(value));
    } catch {
      /* storage unavailable — ignore */
    }
  },
  getJSON(key, fallback) {
    try {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  },
  setJSON(key, value) {
    this.set(key, JSON.stringify(value));
  },
};
