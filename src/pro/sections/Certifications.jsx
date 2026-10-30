import { useMemo, useRef, useState } from 'react';
import { CERTS } from '../data.js';
import { formatMonth } from '../../lib/format.js';
import { COPY, SECTIONS } from '../labels.js';
import ExternalLink from '../components/ExternalLink.jsx';
import { useSpotlight } from '../hooks/useSpotlight.js';
import SectionHead from '../components/SectionHead.jsx';

const ISSUERS = ['All', ...new Set(CERTS.map((c) => c.issuer))];
const INITIAL = 9;
const VERIFIABLE = CERTS.filter((c) => c.verifyUrl).length;

/** Certifications: issuer-filtered grid, newest first. Content: src/data/certifications.json */
export default function Certifications() {
  const [issuer, setIssuer] = useState('All');
  const [expanded, setExpanded] = useState(false);
  const gridRef = useRef(null);
  useSpotlight(gridRef);

  const list = useMemo(() => CERTS.filter((c) => issuer === 'All' || c.issuer === issuer), [issuer]);
  const visible = expanded ? list : list.slice(0, INITIAL);

  return (
    <section id="achievements" className="pro-section is-band" data-pro-in aria-labelledby="pro-achievements-title">
      <div className="pro-container">
        <SectionHead id="pro-achievements-title" title={SECTIONS.achievements.title} sub={COPY.certsSub(VERIFIABLE, CERTS.length)} />

        <div className="pro-chips" role="group" aria-label="Filter by issuer" data-pro-reveal>
          {ISSUERS.map((name) => (
            <button
              key={name}
              type="button"
              className="pro-chip"
              aria-pressed={issuer === name}
              onClick={() => {
                setIssuer(name);
                setExpanded(false);
              }}
            >
              {name}
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          {list.length} certifications shown
        </p>

        <ul ref={gridRef} className="pro-certs">
          {visible.map((c) => (
            <li key={`${c.issuer}-${c.name}`} className="pro-cert" data-pro-reveal>
              <span className="pro-spot-wrap" aria-hidden="true">
                <span className="pro-spot" />
              </span>
              <div className="pro-cert-head">
                <img src={c.badgeImage} alt="" width="40" height="40" loading="lazy" decoding="async" />
                <p className="pro-cert-issuer">
                  {c.issuer} · <time dateTime={c.date}>{formatMonth(c.date)}</time>
                </p>
              </div>
              <h3 className="pro-cert-name">{c.name}</h3>
              {c.expires && (
                <p className="pro-muted">
                  Expires <time dateTime={c.expires}>{formatMonth(c.expires)}</time>
                </p>
              )}
              {c.skills?.length > 0 && (
                <ul className="pro-tags" aria-label="Skills">
                  {c.skills.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              )}
              <div className="pro-cert-foot">
                {c.credentialId && <span className="pro-mono">ID {c.credentialId}</span>}
                {c.verifyUrl && (
                  <ExternalLink href={c.verifyUrl}>
                    {COPY.verify}
                    <span className="sr-only"> for {c.name}</span>
                  </ExternalLink>
                )}
              </div>
            </li>
          ))}
        </ul>
        {list.length === 0 && <p className="pro-empty">{COPY.noCerts}</p>}

        {list.length > INITIAL && (
          <button type="button" className="pro-btn pro-btn-secondary pro-more" aria-expanded={expanded} onClick={() => setExpanded((e) => !e)}>
            {expanded ? COPY.showFewerCerts : COPY.showAllCerts(list.length)}
          </button>
        )}
      </div>
    </section>
  );
}
