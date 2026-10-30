import { CATEGORY_LABEL } from '../labels.js';

const host = (url) => {
  try {
    return new URL(url).host;
  } catch {
    return '';
  }
};

/** A project's screenshot, or a quiet typographic panel when it only has Player One cover art (see data.js). */
export default function ProjectMedia({ project, className = '', ...imgProps }) {
  if (project.hasScreenshot) {
    const img = <img className={className} src={project.thumbnail} alt={project.thumbnailAlt} {...imgProps} />;
    // website screenshots sit in a minimal browser frame; the address is the project's own demo host
    if (project.category !== 'web' || !host(project.demoUrl)) return img;
    return (
      <div className="pro-browser">
        <div className="pro-browser-bar" aria-hidden="true">
          <i />
          <i />
          <i />
          <span>{host(project.demoUrl)}</span>
        </div>
        {img}
      </div>
    );
  }
  return (
    <div className={`pro-media-art ${className}`} aria-hidden="true">
      <span>{project.initials}</span>
      <small>{CATEGORY_LABEL[project.category]}</small>
    </div>
  );
}
