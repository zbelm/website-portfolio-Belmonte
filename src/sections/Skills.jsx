import { useRef } from 'react';
import skills from '../data/skills.json';
import { useReveal } from '../hooks/useReveal.js';
import PixelDivider from '../components/PixelDivider.jsx';
import SectionHeader from '../components/SectionHeader.jsx';

const tierFor = (level) => skills.scale.find((s) => level >= s.min && level <= s.max) ?? skills.scale[0];

/** LEVEL 1-4 — Skill Tree with XP bars that fill on scroll. Content: src/data/skills.json */
export default function Skills() {
  const ref = useRef(null);
  useReveal(ref); // also fills the XP bars as they scroll in

  return (
    <section id="skills" ref={ref} className="section" aria-labelledby="skills-title">
      <PixelDivider color="var(--bg-2)" />
      <div className="container">
        <SectionHeader
          id="skills-title"
          levelId="skills"
          kicker="Skills"
          title="Skill Tree"
          sub="Honest levels on a 1–10 scale — here's what each level means:"
        />

        <ol className="xp-legend" data-reveal>
          {skills.scale.map((s) => (
            <li key={s.label}>
              <span className="xp-legend-lv">
                LV {s.min}–{s.max}
              </span>
              <strong>{s.label}</strong>
              <span>{s.text}</span>
            </li>
          ))}
        </ol>

        <div className="skill-grid">
          {skills.groups.map((group) => (
            <article key={group.id} className="skill-branch panel" data-reveal aria-labelledby={`sk-${group.id}`}>
              <h3 id={`sk-${group.id}`} className="skill-branch-title">
                <span className="branch-icon" aria-hidden="true">
                  {group.icon}
                </span>
                {group.name}
              </h3>
              <ul className="xp-list">
                {group.skills.map((s) => {
                  const tier = tierFor(s.level);
                  return (
                    <li key={s.name} className="xp-item">
                      <div className="xp-row">
                        <span className="xp-name">
                          {s.name}
                          {s.learning && <span className="tag-learning">learning</span>}
                        </span>
                        <span className="xp-level">
                          LV {s.level} · {tier.label}
                        </span>
                      </div>
                      <span className="xp-bar" aria-hidden="true">
                        <span className="xp-fill" style={{ width: `${s.level * 10}%` }} />
                      </span>
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
