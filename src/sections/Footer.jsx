import { SITE } from '../config/site.js';
import SecretCoin from '../components/SecretCoin.jsx';

/** Game over (in a good way): credits, back to top, and a hint about the cheat code. */
export default function Footer({ onInsertCoin }) {
  const toTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('main')?.focus({ preventScroll: true });
  };

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="footer-title">Thanks for playing!</p>
        <p className="footer-credits">
          Designed &amp; built by {SITE.name} with React, GSAP, Three.js &amp; Howler.js.
        </p>
        <div className="footer-actions">
          <button type="button" className="btn btn-cyan" onClick={toTop}>
            ▲ Back to top
          </button>
          <button type="button" className="btn btn-ghost" onClick={onInsertCoin}>
            Insert coin
          </button>
        </div>
        <p className="footer-hint">
          Psst… try <kbd>↑</kbd>
          <kbd>↑</kbd>
          <kbd>↓</kbd>
          <kbd>↓</kbd>
          <kbd>←</kbd>
          <kbd>→</kbd>
          <kbd>←</kbd>
          <kbd>→</kbd>
          <kbd>B</kbd>
          <kbd>A</kbd>
        </p>
        <p className="footer-copy">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
        <SecretCoin id="footer" className="coin-footer" />
      </div>
    </footer>
  );
}
