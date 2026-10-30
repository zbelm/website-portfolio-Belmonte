import { skills, tierFor } from '../data.js';
import { SECTIONS } from '../labels.js';
import SectionHead from '../components/SectionHead.jsx';

const STEPS = skills.scale.length;

/** Four-step indicator; the tier word beside it carries the meaning. */
const Steps = ({ step }) => (
  <span className="pro-steps" aria-hidden="true">
    {Array.from({ length: STEPS }, (_, i) => (
      <i key={i} className={i < step ? 'is-on' : ''} />
    ))}
  </span>
);

/** Technical skills grouped by area, with the tier each level maps to. Content: src/data/skills.json */
export default function Skills() {
  return (
    <section id="skills" className="pro-section" aria-labelledby="pro-skills-title">
      <div className="pro-container">
        <SectionHead id="pro-skills-title" title={SECTIONS.skills.title} sub={SECTIONS.skills.sub} />

        <ol className="pro-scale" data-pro-reveal aria-label="Proficiency scale">
          {skills.scale.map((s, i) => (
            <li key={s.label}>
              <span className="pro-scale-head">
                <Steps step={i + 1} />
                <strong>{s.label}</strong>
              </span>
              <span className="pro-muted">{s.text}</span>
            </li>
          ))}
        </ol>

        <div className="pro-skill-groups">
          {skills.groups.map((g) => (
            <div key={g.id} className="pro-skill-group" data-pro-reveal>
              <h3 className="pro-h3" id={`pro-sk-${g.id}`}>
                {g.name}
              </h3>
              <ul aria-labelledby={`pro-sk-${g.id}`}>
                {g.skills.map((s) => {
                  const tier = tierFor(s.level);
                  return (
                    <li key={s.name}>
                      <span className="pro-skill-name">
                        {s.name}
                        {s.learning && tier.label !== 'Learning' && <span className="pro-learning">Learning now</span>}
                      </span>
                      <span className="pro-skill-tier">
                        <span className="sr-only">Proficiency: </span>
                        {tier.label}
                        <Steps step={tier.step} />
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
