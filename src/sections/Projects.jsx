import { useMemo, useRef, useState } from 'react';
import projects from '../data/projects.json';
import { useReveal } from '../hooks/useReveal.js';
import Modal from '../components/Modal.jsx';
import PixelDivider from '../components/PixelDivider.jsx';
import ReplaceTag from '../components/ReplaceTag.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import SecretCoin from '../components/SecretCoin.jsx';
import YouTubeFacade from '../components/YouTubeFacade.jsx';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'web', label: 'Web' },
  { id: 'app', label: 'App' },
  { id: 'game', label: 'Game' },
];
const CATEGORY = { web: 'WEB', app: 'APP', game: 'GAME' };

function ExternalLink({ href, className, children }) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function ProjectLinks({ project }) {
  return (
    <>
      {project.demoUrl ? (
        <ExternalLink className="btn btn-sm btn-yellow" href={project.demoUrl}>
          ▶ {project.demoLabel || 'Live Demo'}
        </ExternalLink>
      ) : (
        <span className="btn btn-sm is-disabled">Demo soon</span>
      )}
      {project.sourceUrl ? (
        <ExternalLink className="btn btn-sm btn-cyan" href={project.sourceUrl}>
          {'</>'} Source
        </ExternalLink>
      ) : (
        <span className="btn btn-sm is-disabled">Private repo</span>
      )}
    </>
  );
}

/** One project = one game cartridge. */
function ProjectCard({ project, onOpen }) {
  return (
    <article className={`cart ${project.boss ? 'cart-boss' : ''}`} data-reveal aria-labelledby={`p-${project.id}`}>
      {project.boss && (
        <p className="boss-banner">
          <span aria-hidden="true">⚠</span> Boss level <span aria-hidden="true">⚠</span>
        </p>
      )}
      <div className="cart-shell">
        <div className="cart-label">
          <img src={project.thumbnail} alt={project.thumbnailAlt} loading="lazy" decoding="async" width="640" height="360" />
          <span className="cart-cat">{CATEGORY[project.category]}</span>
        </div>
        <div className="cart-body">
          <p className="cart-meta">
            {project.year} · {project.status}
          </p>
          <h3 id={`p-${project.id}`} className="cart-title">
            {project.title}
          </h3>
          {project.placeholder && <ReplaceTag />}
          <p className="cart-tagline">{project.tagline}</p>
          <p className="cart-role">
            <strong>Role:</strong> {project.role}
          </p>
          <ul className="tech-badges" aria-label="Tech stack">
            {project.tech.map((t) => (
              <li key={t} className="badge">
                {t}
              </li>
            ))}
          </ul>
          <div className="cart-actions">
            <ProjectLinks project={project} />
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => onOpen(project)}>
              Details<span className="sr-only">: {project.title}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ProjectModal({ project, onClose }) {
  const media = project?.screenshots?.filter((s) => s.src) ?? [];
  return (
    <Modal open={Boolean(project)} onClose={onClose} labelledBy="project-modal-title" className="project-modal">
      {project && (
        <>
          <p className="modal-kicker">
            {CATEGORY[project.category]} · {project.year} · {project.status}
          </p>
          <h2 id="project-modal-title" className="modal-title">
            {project.title}
          </h2>
          <p className="modal-lead">{project.tagline}</p>

          {project.video?.type === 'youtube' && project.video.id && <YouTubeFacade id={project.video.id} title={project.title} />}
          {project.video?.type === 'mp4' && project.video.src && (
            <video className="video-frame" src={project.video.src} controls preload="none" poster={project.thumbnail} />
          )}

          <div className="modal-gallery">
            {(media.length ? media : [{ src: project.thumbnail, alt: project.thumbnailAlt }]).map((m) => (
              <img key={m.src} src={m.src} alt={m.alt} loading="lazy" decoding="async" width="640" height="360" />
            ))}
          </div>

          <p>{project.description}</p>
          {project.highlights?.length > 0 && (
            <>
              <h3 className="modal-sub">Highlights</h3>
              <ul className="pixel-list">
                {project.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </>
          )}
          <p>
            <strong>Role:</strong> {project.role}
          </p>
          <ul className="tech-badges" aria-label="Tech stack">
            {project.tech.map((t) => (
              <li key={t} className="badge">
                {t}
              </li>
            ))}
          </ul>
          <div className="cart-actions">
            <ProjectLinks project={project} />
          </div>
        </>
      )}
    </Modal>
  );
}

/** LEVEL 1-2 — Level Select: filterable project cartridges. Content: src/data/projects.json */
export default function Projects() {
  const ref = useRef(null);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  useReveal(ref);

  const list = useMemo(() => {
    const filtered = filter === 'all' ? projects : projects.filter((p) => p.category === filter);
    return [...filtered].sort((a, b) => Number(Boolean(b.boss)) - Number(Boolean(a.boss)));
  }, [filter]);

  return (
    <section id="projects" ref={ref} className="section" aria-labelledby="projects-title">
      <PixelDivider color="var(--bg-2)" />
      <div className="container">
        <SectionHeader
          id="projects-title"
          levelId="projects"
          kicker="Projects"
          title="Level Select"
          sub="Pick a cartridge. Each one has a live demo, source code and a details screen."
        />

        <div className="filter-bar" role="group" aria-label="Filter projects by type" data-reveal>
          {FILTERS.map((f) => {
            const count = f.id === 'all' ? projects.length : projects.filter((p) => p.category === f.id).length;
            return (
              <button
                key={f.id}
                type="button"
                className={`chip ${filter === f.id ? 'is-active' : ''}`}
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
              >
                {f.label} <span className="chip-count">{count}</span>
              </button>
            );
          })}
        </div>
        <p className="sr-only" aria-live="polite">
          {list.length} projects shown
        </p>

        <div className="cart-grid">
          {list.map((p) => (
            <ProjectCard key={p.id} project={p} onOpen={setSelected} />
          ))}
        </div>

        <SecretCoin id="projects" className="coin-projects" />
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
