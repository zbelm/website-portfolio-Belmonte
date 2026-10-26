import { useRef } from 'react';
import timeline from '../data/timeline.json';
import { useReveal } from '../hooks/useReveal.js';
import PixelDivider from '../components/PixelDivider.jsx';
import ReplaceTag from '../components/ReplaceTag.jsx';
import SectionHeader from '../components/SectionHeader.jsx';

const TYPES = {
  education: { label: 'Main quest · Education', icon: 'EDU' },
  training: { label: 'Side quest · Training', icon: 'TRN' },
  project: { label: 'Side quest · Project', icon: 'DEV' },
  content: { label: 'Side quest · Creator', icon: 'REC' },
  volunteer: { label: 'Guild quest · Volunteer', icon: 'VOL' },
  competition: { label: 'Tournament · Competition', icon: 'CUP' },
};

/** LEVEL 2-1 — Quest Log: experience & education timeline. Content: src/data/timeline.json */
export default function QuestLog() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <section id="quests" ref={ref} className="section section-alt" aria-labelledby="quests-title">
      <PixelDivider color="var(--bg)" />
      <div className="container">
        <SectionHeader
          id="quests-title"
          levelId="quests"
          kicker="Experience & education"
          title="Quest Log"
          sub="School, training and personal projects."
        />

        <ol className="quest-list">
          {timeline.map((q) => {
            const type = TYPES[q.type] ?? TYPES.project;
            const active = q.status === 'active';
            return (
              <li key={`${q.title}-${q.period}`} className="quest" data-reveal>
                <span className="quest-marker" aria-hidden="true">
                  {type.icon}
                </span>
                <article className="quest-card panel">
                  <header className="quest-head">
                    <p className="quest-type">{type.label}</p>
                    <p className={`quest-status ${active ? 'is-active' : 'is-complete'}`}>{active ? 'In progress' : 'Complete ✓'}</p>
                  </header>
                  <h3 className="quest-title">{q.title}</h3>
                  <p className="quest-org">
                    {q.org} · <span className="quest-period">{q.period}</span>
                  </p>
                  <p className="quest-desc">{q.description}</p>
                  {q.rewards?.length > 0 && (
                    <ul className="quest-rewards" aria-label="Skills gained">
                      {q.rewards.map((r) => (
                        <li key={r} className="badge badge-xp">
                          +{r}
                        </li>
                      ))}
                    </ul>
                  )}
                  {q.placeholder && <ReplaceTag />}
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
