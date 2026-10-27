import { useRef } from 'react';
import profile from '../data/profile.json';
import { useReveal } from '../hooks/useReveal.js';
import { isPlaceholder } from '../lib/format.js';
import Avatar from '../components/Avatar.jsx';
import PixelDivider from '../components/PixelDivider.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import SecretCoin from '../components/SecretCoin.jsx';

/** LEVEL 1-1 — Character Select: stat-card bio. Content: src/data/profile.json */
export default function About() {
  const ref = useRef(null);
  useReveal(ref);

  const meta = [
    ['Class', profile.class],
    ['Year', profile.yearLevel],
    ['School', profile.school],
    ['Course', profile.course],
    ['Base', profile.location],
    ['Languages', profile.languages.join(', ')],
  ];

  return (
    <section id="about" ref={ref} className="section section-alt" aria-labelledby="about-title">
      <PixelDivider color="var(--ground)" />
      <div className="container">
        <SectionHeader
          id="about-title"
          levelId="about"
          kicker="About me"
          title="Character Select"
          sub="Quick stats on the player you're recruiting."
        />

        <div className="about-grid">
          <article className="char-card panel" data-reveal aria-labelledby="char-name">
            <div className="char-portrait">
              {profile.photo ? (
                <>
                  <img
                    className="char-photo"
                    src={profile.photo}
                    alt={profile.photoAlt}
                    width="220"
                    height="220"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="char-sprite" aria-hidden="true">
                    <Avatar scale={3} interactive={false} />
                  </span>
                </>
              ) : (
                <Avatar scale={6} interactive={false} />
              )}
              <span className="char-selected" aria-hidden="true">
                P1 ▸ SELECTED
              </span>
            </div>
            <h3 id="char-name" className="char-name">
              {profile.firstName} {profile.lastName}
            </h3>

            <p className="status-pill">
              <span className="pulse-dot" aria-hidden="true" />
              Status: {profile.status}
            </p>

            <dl className="char-meta">
              {meta.map(([k, v]) => (
                <div key={k} className={isPlaceholder(v) ? 'is-placeholder' : ''}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>

            <ul className="stat-bars" aria-label="Character stats">
              {profile.stats.map((s) => (
                <li key={s.key}>
                  <span className="stat-key">{s.key}</span>
                  <span className="stat-name">{s.name}</span>
                  <span className="stat-bar" aria-hidden="true">
                    <span style={{ width: `${s.value}%` }} />
                  </span>
                  <span className="stat-value">{s.value}</span>
                </li>
              ))}
            </ul>
            <p className="stat-note">{profile.statsNote}</p>
          </article>

          <div className="about-side">
            <div className="panel dialog-box" data-reveal>
              <h3>Player bio</h3>
              {profile.story.map((p) => (
                <p key={p.slice(0, 24)} className={isPlaceholder(p) ? 'is-placeholder' : ''}>
                  {p}
                </p>
              ))}
              <span className="dialog-next blink" aria-hidden="true">
                ▼
              </span>
            </div>

            <div className="panel" data-reveal>
              <h3>Special moves</h3>
              <ul className="moves">
                {profile.specialMoves.map((m) => (
                  <li key={m.name}>
                    <strong>{m.name}</strong>
                    <span>{m.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="panel quest-objective" data-reveal>
              <h3>Current quest objective</h3>
              <p className={isPlaceholder(profile.availability) ? 'is-placeholder' : ''}>{profile.availability}</p>
              <a className="btn btn-sm btn-pink" href="#contact">
                Recruit me
              </a>
            </div>
          </div>
        </div>

        <SecretCoin id="about" className="coin-about" />
      </div>
    </section>
  );
}
