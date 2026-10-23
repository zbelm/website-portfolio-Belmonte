import { levelById } from '../config/levels.js';

/**
 * "LEVEL 1-2 · PROJECTS" kicker + game-style title.
 * The plain-English kicker keeps it scannable for recruiters;
 * the title carries the game theme.
 */
export default function SectionHeader({ id, levelId, kicker, title, sub }) {
  const level = levelById(levelId);
  return (
    <header className="level-header" data-reveal>
      <p className="level-kicker">
        <span className="level-world">LEVEL {level?.world}</span>
        <span className="level-kicker-text">{kicker}</span>
      </p>
      <h2 id={id} className="level-title glitch" data-text={title}>
        {title}
      </h2>
      {sub && <p className="level-sub">{sub}</p>}
    </header>
  );
}
