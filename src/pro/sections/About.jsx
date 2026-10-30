import { profile, STATS, STORY } from '../data.js';
import { SECTIONS } from '../labels.js';
import SectionHead from '../components/SectionHead.jsx';

const FACTS = [
  ['School', profile.school],
  ['Program', profile.course],
  ['Year level', profile.yearLevel],
  ['Location', profile.location],
  ['Languages', profile.languages.join(', ')],
];

/** About: photo, bio, key facts, how I work, and counts derived from the data. */
export default function About() {
  return (
    <section id="about" className="pro-section" data-pro-in aria-labelledby="pro-about-title">
      <div className="pro-container">
        <div className="pro-about">
          <SectionHead id="pro-about-title" title={SECTIONS.about.title} />
          <div className="pro-prose" data-pro-reveal>
            {STORY.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
          <dl className="pro-facts" data-pro-reveal>
            {FACTS.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="pro-about-more">
          <div data-pro-reveal>
            <h3 className="pro-h3">Working style</h3>
            <ul className="pro-moves">
              {profile.specialMoves.map((m) => (
                <li key={m.name}>
                  <strong>{m.name}</strong>
                  <span>{m.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <ul className="pro-stats" data-pro-reveal aria-label="At a glance">
            {STATS.map((s) => (
              <li key={s.label}>
                <span className="pro-stat-num" data-count={s.value}>
                  {s.value}
                </span>
                <span className="pro-stat-label">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
