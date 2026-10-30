import { AVAILABILITY, profile } from '../data.js';
import { COPY } from '../labels.js';
import ResumeLink from '../components/ResumeLink.jsx';

/** Staggers the entrance (see [data-hero] in pro.css). */
const step = (i) => ({ '--i': i });

/** Hero: name, role, one-line pitch, availability, resume + contact. The only <h1>. */
export default function Hero() {
  return (
    <section id="title" className="pro-hero" aria-labelledby="pro-hero-title">
      <div className="pro-hero-bg" aria-hidden="true">
        <i />
        <i />
      </div>
      <div className="pro-container pro-hero-inner">
        <h1 id="pro-hero-title" className="pro-hero-name" data-hero style={step(0)}>
          <span>{profile.firstName}</span> <span>{profile.lastName}</span>
        </h1>
        <p className="pro-hero-role" data-hero style={step(1)}>
          {profile.roles.join(' · ')}
        </p>
        <p className="pro-hero-pitch" data-hero style={step(2)}>
          {profile.pitch}
        </p>
        <div className="pro-hero-cta" data-hero style={step(3)}>
          <ResumeLink />
          <a className="pro-btn pro-btn-secondary" href="#contact">
            {COPY.contactCta}
          </a>
        </div>
        <dl className="pro-hero-facts" data-hero style={step(4)}>
          <div>
            <dt>Status</dt>
            <dd>
              <span className="pro-dot is-live" aria-hidden="true" />
              {profile.status}
            </dd>
          </div>
          {AVAILABILITY && (
            <div>
              <dt>Availability</dt>
              <dd>{AVAILABILITY}</dd>
            </div>
          )}
          <div>
            <dt>Education</dt>
            <dd>
              {profile.courseShort} · {profile.school}
            </dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{profile.location}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
