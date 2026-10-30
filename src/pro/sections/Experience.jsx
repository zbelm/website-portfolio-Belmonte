import { TIMELINE } from '../data.js';
import { SECTIONS, TIMELINE_TYPE } from '../labels.js';
import SectionHead from '../components/SectionHead.jsx';

/** Experience & education: vertical timeline. Content: src/data/timeline.json */
export default function Experience() {
  return (
    <section id="quests" className="pro-section" aria-labelledby="pro-quests-title">
      <div className="pro-container">
        <SectionHead id="pro-quests-title" title={SECTIONS.quests.title} sub={SECTIONS.quests.sub} />
        <div className="pro-timeline">
          <i className="pro-timeline-line" aria-hidden="true" />
          <ol>
            {TIMELINE.map((t) => {
              const active = t.status === 'active';
              return (
                <li key={`${t.title}-${t.period}`} className="pro-tl-item" data-pro-reveal>
                  <span className={`pro-tl-dot ${active ? 'is-active' : ''}`} aria-hidden="true" />
                  <p className="pro-tl-period">{t.period}</p>
                  <div className="pro-tl-body">
                    <h3 className="pro-h3">{t.title}</h3>
                    <p className="pro-tl-org">{t.org}</p>
                    <p className="pro-tl-meta">
                      {TIMELINE_TYPE[t.type] ?? TIMELINE_TYPE.project} · {active ? 'In progress' : 'Completed'}
                    </p>
                    <p>{t.description}</p>
                    {t.rewards?.length > 0 && (
                      <ul className="pro-tags" aria-label="Skills">
                        {t.rewards.map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
