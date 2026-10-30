import { SITE } from '../../config/site.js';
import { formatBytes } from '../../lib/format.js';
import { COPY } from '../labels.js';
import { IconDownload } from '../icons.jsx';

// injected by vite.config.js from the real size of public/resume.pdf
// eslint-disable-next-line no-undef
const RESUME_BYTES = typeof __RESUME_SIZE__ !== 'undefined' ? __RESUME_SIZE__ : 0;

/** Resume download (same file and name as Player One). */
export default function ResumeLink({ className = 'pro-btn pro-btn-primary', showSize = true }) {
  return (
    <a className={className} href={SITE.resume.href} download={SITE.resume.fileName}>
      <IconDownload />
      <span>{COPY.resume}</span>
      {showSize && RESUME_BYTES > 0 && <span className="pro-btn-meta">PDF · {formatBytes(RESUME_BYTES)}</span>}
    </a>
  );
}
