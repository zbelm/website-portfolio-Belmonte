import { useMemo, useRef, useState } from 'react';
import { PROJECTS, TECH_TAGS } from '../data.js';
import { CATEGORY_LABEL, COPY, FEATURED_LABEL, PROJECT_FILTERS, SECTIONS } from '../labels.js';
import { useSpotlight } from '../hooks/useSpotlight.js';
import Drawer from '../components/Drawer.jsx';
import ExternalLink from '../components/ExternalLink.jsx';
import ProjectMedia from '../components/ProjectMedia.jsx';
import SectionHead from '../components/SectionHead.jsx';

/** Live = filled dot; anything else (in development, capstone…) = hollow dot. Never color alone: the status word is always printed. */
const StatusDot = ({ status }) => <span className={`pro-dot ${status === 'Live' ? 'is-live' : ''}`} aria-hidden="true" />;

const statusLine = (p) => [p.status, p.year, CATEGORY_LABEL[p.category], p.boss && FEATURED_LABEL].filter(Boolean).join(' · ');

function ProjectLinks({ project, withFallback = false }) {
  return (
    <>
      {project.demoUrl ? (
        <ExternalLink href={project.demoUrl}>{project.demoLabel || COPY.demoDefault}</ExternalLink>
      ) : (
        withFallback && <span className="pro-muted">{COPY.noDemo}</span>
      )}
      {project.sourceUrl ? (
        <ExternalLink href={project.sourceUrl}>{COPY.source}</ExternalLink>
      ) : (
        withFallback && <span className="pro-muted">{COPY.privateSource}</span>
      )}
    </>
  );
}

function ProjectCard({ project, onOpen }) {
  // a featured project with no real screenshot reads better as a text card than as a big empty panel
  const showMedia = project.hasScreenshot || !project.boss;
  return (
    <li className={project.boss ? 'is-featured' : ''}>
      <article className="pro-card" data-pro-reveal>
        <span className="pro-spot-wrap" aria-hidden="true">
          <span className="pro-spot" />
        </span>
        {showMedia && (
          <div className="pro-card-media">
            <ProjectMedia project={project} width="640" height="360" loading="lazy" decoding="async" />
          </div>
        )}
        <div className="pro-card-body">
          <h3 className="pro-card-title">
            <button type="button" className="pro-card-open" aria-haspopup="dialog" onClick={() => onOpen(project)}>
              {project.title}
            </button>
          </h3>
          <p className="pro-card-meta">
            <StatusDot status={project.status} />
            <span>{statusLine(project)}</span>
          </p>
          <p className="pro-card-tagline">{project.tagline}</p>
          <ul className="pro-tags" aria-label="Technology">
            {project.tech.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <div className="pro-card-links">
            <ProjectLinks project={project} />
          </div>
        </div>
      </article>
    </li>
  );
}

function ProjectDetail({ project }) {
  const shots = project.screenshots?.filter((s) => s.src) ?? [];
  const media = shots.length ? shots : project.hasScreenshot ? [{ src: project.thumbnail, alt: project.thumbnailAlt }] : [];
  const video = project.video;
  return (
    <>
      {media.length > 0 && (
        <div className="pro-drawer-media" tabIndex={0} role="group" aria-label={`${project.title} images`}>
          {media.map((m) => (
            <img key={m.src} src={m.src} alt={m.alt} loading="lazy" decoding="async" />
          ))}
        </div>
      )}
      <h2 id="pro-project-title" className="pro-h3 pro-drawer-title">
        {project.title}
      </h2>
      <p className="pro-card-meta">
        <StatusDot status={project.status} />
        <span>{statusLine(project)}</span>
      </p>
      <p className="pro-lead">{project.tagline}</p>
      <p>{project.description}</p>
      {project.highlights.length > 0 && (
        <>
          <h3 className="pro-h4">Highlights</h3>
          <ul className="pro-bullets">
            {project.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </>
      )}
      <h3 className="pro-h4">Role</h3>
      <p>{project.role}</p>
      <h3 className="pro-h4">Technology</h3>
      <ul className="pro-tags" aria-label="Technology">
        {project.tech.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      {video?.type === 'mp4' && video.src && <video className="pro-video" src={video.src} controls preload="none" poster={project.thumbnail} />}
      {video?.type === 'youtube' && video.id && (
        <p>
          <ExternalLink href={`https://www.youtube.com/watch?v=${video.id}`}>Watch the video</ExternalLink>
        </p>
      )}
      <div className="pro-drawer-links">
        <ProjectLinks project={project} withFallback />
      </div>
    </>
  );
}

/** Selected projects: filterable cards + a detail drawer. Content: src/data/projects.json */
export default function Projects() {
  const gridRef = useRef(null);
  const [category, setCategory] = useState('all');
  const [tech, setTech] = useState(null);
  const [selected, setSelected] = useState(null); // stays set after closing so the drawer keeps its content while it animates out
  const [open, setOpen] = useState(false);
  useSpotlight(gridRef);

  const list = useMemo(
    () => PROJECTS.filter((p) => (category === 'all' || p.category === category) && (!tech || p.tech.includes(tech))),
    [category, tech],
  );
  const filtered = category !== 'all' || tech;

  return (
    <section id="projects" className="pro-section" aria-labelledby="pro-projects-title">
      <div className="pro-container">
        <SectionHead id="pro-projects-title" title={SECTIONS.projects.title} sub={SECTIONS.projects.sub} />

        <div className="pro-filters" data-pro-reveal>
          <div className="pro-chips" role="group" aria-label="Filter by type">
            {PROJECT_FILTERS.map((f) => (
              <button key={f.id} type="button" className="pro-chip" aria-pressed={category === f.id} onClick={() => setCategory(f.id)}>
                {f.label}
                <span className="pro-chip-count">{f.id === 'all' ? PROJECTS.length : PROJECTS.filter((p) => p.category === f.id).length}</span>
              </button>
            ))}
          </div>
          <div className="pro-chips" role="group" aria-label="Filter by technology">
            {TECH_TAGS.map((t) => (
              <button key={t} type="button" className="pro-chip" aria-pressed={tech === t} onClick={() => setTech(tech === t ? null : t)}>
                {t}
              </button>
            ))}
          </div>
          {filtered && (
            <button
              type="button"
              className="pro-link-btn"
              onClick={() => {
                setCategory('all');
                setTech(null);
              }}
            >
              Clear filters
            </button>
          )}
        </div>
        <p className="sr-only" aria-live="polite">
          {list.length} {list.length === 1 ? 'project' : 'projects'} shown
        </p>

        <ul ref={gridRef} className="pro-cards">
          {list.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onOpen={(project) => {
                setSelected(project);
                setOpen(true);
              }}
            />
          ))}
        </ul>
        {list.length === 0 && <p className="pro-empty">{COPY.noProjects}</p>}
      </div>

      <Drawer open={open} onClose={() => setOpen(false)} labelledBy="pro-project-title">
        {selected && <ProjectDetail project={selected} />}
      </Drawer>
    </section>
  );
}
