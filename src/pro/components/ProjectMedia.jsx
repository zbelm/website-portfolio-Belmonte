import { CATEGORY_LABEL } from '../labels.js';

/** A project's screenshot, or a quiet typographic panel when it only has Player One cover art (see data.js). */
export default function ProjectMedia({ project, className = '', ...imgProps }) {
  if (project.hasScreenshot) {
    return <img className={className} src={project.thumbnail} alt={project.thumbnailAlt} {...imgProps} />;
  }
  return (
    <div className={`pro-media-art ${className}`} aria-hidden="true">
      <span>{project.initials}</span>
      <small>{CATEGORY_LABEL[project.category]}</small>
    </div>
  );
}
