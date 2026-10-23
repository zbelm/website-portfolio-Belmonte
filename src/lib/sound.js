/**
 * Tiny 8-bit sound engine.
 *
 * Sounds are synthesized in the browser as square-wave WAV data URIs
 * (zero audio files to download) and played through Howler.js.
 * Howler itself is only fetched the first time a visitor turns sound ON,
 * so sound costs nothing for everyone else (it is OFF by default).
 */

const RATE = 22050;

// [frequencyHz, durationMs] — 0 Hz = rest
const RECIPES = {
  click: { notes: [[880, 28], [1320, 32]], vol: 0.16 },
  hover: { notes: [[1760, 16]], vol: 0.06 },
  toggle: { notes: [[660, 40], [990, 50]], vol: 0.14 },
  coin: { notes: [[988, 70], [1319, 230]], vol: 0.2 },
  jump: { notes: [[392, 40], [523, 40], [659, 40], [784, 70]], vol: 0.16 },
  start: { notes: [[523, 80], [659, 80], [784, 80], [1047, 220]], vol: 0.18 },
  jingle: { notes: [[523, 90], [659, 90], [784, 90], [1047, 130], [0, 50], [784, 90], [1047, 280]], vol: 0.2 },
  error: { notes: [[220, 110], [165, 220]], vol: 0.18 },
};

/** Build a mono 8-bit PCM WAV (as a data URI) from a list of square-wave notes. */
function synth({ notes, vol }) {
  const total = notes.reduce((n, [, ms]) => n + Math.floor((RATE * ms) / 1000), 0);
  const bytes = new Uint8Array(44 + total);
  const view = new DataView(bytes.buffer);
  const writeStr = (offset, s) => [...s].forEach((ch, i) => (bytes[offset + i] = ch.charCodeAt(0)));

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + total, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, RATE, true);
  view.setUint32(28, RATE, true); // byte rate
  view.setUint16(32, 1, true); // block align
  view.setUint16(34, 8, true); // bits per sample
  writeStr(36, 'data');
  view.setUint32(40, total, true);

  let o = 44;
  for (const [freq, ms] of notes) {
    const n = Math.floor((RATE * ms) / 1000);
    for (let i = 0; i < n; i++) {
      const envelope = 1 - i / n; // simple linear decay per note
      const sample = freq > 0 ? (((i * freq) / RATE) % 1 < 0.5 ? 1 : -1) : 0;
      bytes[o++] = 128 + Math.round(sample * envelope * vol * 127);
    }
  }

  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return `data:audio/wav;base64,${btoa(binary)}`;
}

let enabled = false;
let howls = null;
let loading = null;
let lastHover = 0;

function load() {
  if (howls) return Promise.resolve(howls);
  if (!loading) {
    loading = import('howler').then((mod) => {
      const Howl = mod.Howl || mod.default?.Howl;
      howls = {};
      for (const [name, recipe] of Object.entries(RECIPES)) {
        howls[name] = new Howl({ src: [synth(recipe)], format: ['wav'] });
      }
      return howls;
    });
  }
  return loading;
}

export function setSoundEnabled(on) {
  enabled = on;
  if (on) load();
}

/** Play a named sound if the visitor enabled sound. Safe to call anywhere. */
export function play(name) {
  if (!enabled) return;
  if (name === 'hover') {
    const now = performance.now();
    if (now - lastHover < 90) return; // throttle hover blips
    lastHover = now;
  }
  if (howls) howls[name]?.play();
  else load().then((h) => h[name]?.play());
}
