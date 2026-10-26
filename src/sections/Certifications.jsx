import { useEffect, useMemo, useRef, useState } from 'react';
import certifications from '../data/certifications.json';
import profile from '../data/profile.json';
import { SITE } from '../config/site.js';
import { useGame } from '../context/GameContext.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { formatMonth } from '../lib/format.js';
import { loadGsap } from '../lib/motion.js';
import { TROPHY, TROPHY_PALETTE } from '../lib/pixelArt.js';
import PixelDivider from '../components/PixelDivider.jsx';
import PixelSprite from '../components/PixelSprite.jsx';
import ReplaceTag from '../components/ReplaceTag.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import SecretCoin from '../components/SecretCoin.jsx';

// newest first
const CERTS = [...certifications].sort((a, b) => String(b.date).localeCompare(String(a.date)));
const ISSUERS = ['All', ...new Set(CERTS.map((c) => c.issuer))];
const LINKEDIN = SITE.socials.find((s) => s.id === 'linkedin')?.href;

/**
 * LEVEL 1-3 — Trophy Room.
 * Add a certificate = add one object to src/data/certifications.json.
 */
export default function Certifications() {
  const ref = useRef(null);
  const gridRef = useRef(null);
  const prevKey = useRef(CERTS.map((c) => c.name).join('|'));
  const { reducedMotion } = useGame();
  const [issuer, setIssuer] = useState('All');
  const [query, setQuery] = useState('');
  useReveal(ref);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CERTS.filter(
      (c) =>
        (issuer === 'All' || c.issuer === issuer) &&
        (!q || [c.name, c.issuer, ...(c.skills || [])].join(' ').toLowerCase().includes(q)),
    );
  }, [issuer, query]);

  const goal = Math.max(profile.certGoal || CERTS.length, CERTS.length);
  const key = filtered.map((c) => c.name).join('|');

  // trophy-reveal: cards flip in on first scroll (CSS, via useReveal);
  // when the filters change, the visible cards re-flip with GSAP
  useEffect(() => {
    if (prevKey.current === key) return undefined; // first render (or StrictMode re-run)
    prevKey.current = key;
    if (reducedMotion || !gridRef.current) return undefined;
    const cards = gridRef.current.querySelectorAll('.trophy');
    cards.forEach((c) => c.classList.add('is-in'));
    let tween;
    let alive = true;
    loadGsap().then(({ gsap }) => {
      if (!alive) return;
      tween = gsap.fromTo(
        cards,
        { autoAlpha: 0, rotateY: 90, scale: 0.7 },
        { autoAlpha: 1, rotateY: 0, scale: 1, duration: 0.4, ease: 'back.out(1.6)', stagger: 0.05, clearProps: 'all' },
      );
    });
    return () => {
      alive = false;
      tween?.revert();
    };
  }, [key, reducedMotion]);

  return (
    <section id="achievements" ref={ref} className="section section-alt" aria-labelledby="achievements-title">
      <PixelDivider color="var(--bg)" />
      <div className="container">
        <SectionHeader
          id="achievements-title"
          levelId="achievements"
          kicker="Certifications"
          title="Trophy Room"
          sub="Every trophy links to the issuer's official verification page."
        />

        <div className="trophy-hud panel" data-reveal>
          <div className="trophy-count">
            <PixelSprite grid={TROPHY} palette={TROPHY_PALETTE} scale={4} />
            <p>
              <strong>
                {CERTS.length} / {goal}
              </strong>{' '}
              Achievements unlocked
            </p>
          </div>
          <div className="trophy-progress" aria-hidden="true">
            <span style={{ width: `${(CERTS.length / goal) * 100}%` }} />
          </div>
          {LINKEDIN && (
            <a className="btn btn-sm btn-cyan" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
              View my LinkedIn<span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>

        <div className="trophy-filters" data-reveal>
          <div className="filter-bar" role="group" aria-label="Filter certifications by issuer">
            {ISSUERS.map((name) => (
              <button
                key={name}
                type="button"
                className={`chip ${issuer === name ? 'is-active' : ''}`}
                aria-pressed={issuer === name}
                onClick={() => setIssuer(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <label className="search-box">
            <span className="sr-only">Search certifications</span>
            <span aria-hidden="true" className="search-icon">
              ?
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, issuer or skill…"
              autoComplete="off"
            />
          </label>
        </div>
        <p className="result-count" aria-live="polite">
          Showing {filtered.length} of {CERTS.length}
        </p>

        <ul ref={gridRef} className="trophy-grid">
          {filtered.map((c) => (
            <li key={`${c.issuer}-${c.name}`} className="trophy panel">
              <p className="trophy-unlocked">
                <span aria-hidden="true">★</span> Achievement unlocked
              </p>
              <div className="trophy-head">
                <img
                  className="trophy-badge"
                  src={c.badgeImage}
                  alt={`${c.issuer} badge`}
                  loading="lazy"
                  decoding="async"
                  width="72"
                  height="72"
                />
                <div>
                  <h3 className="trophy-name">{c.name}</h3>
                  <p className="trophy-issuer">
                    {c.issuer} · <time dateTime={c.date}>{formatMonth(c.date)}</time>
                    {c.expires && (
                      <>
                        {' '}· Expires <time dateTime={c.expires}>{formatMonth(c.expires)}</time>
                      </>
                    )}
                  </p>
                </div>
              </div>
              {c.placeholder && <ReplaceTag />}
              <ul className="tech-badges" aria-label="Skills">
                {c.skills?.map((s) => (
                  <li key={s} className="badge">
                    {s}
                  </li>
                ))}
              </ul>
              <p className="trophy-id">Credential ID: {c.credentialId || '—'}</p>
              {c.verifyUrl && (
                <a className="btn btn-sm btn-yellow" href={c.verifyUrl} target="_blank" rel="noopener noreferrer">
                  ✓ Verify credential<span className="sr-only"> for {c.name} (opens in a new tab)</span>
                </a>
              )}
            </li>
          ))}
        </ul>
        {filtered.length === 0 && <p className="empty-state">No trophies match that search. Try another issuer or keyword.</p>}

        <SecretCoin id="achievements" className="coin-achievements" />
      </div>
    </section>
  );
}
