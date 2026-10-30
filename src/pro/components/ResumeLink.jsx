import { SITE } from '../../config/site.js';
import { formatBytes, RESUME_BYTES } from '../../lib/format.js';
import { COPY } from '../labels.js';
import { IconDownload } from '../icons.jsx';

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
