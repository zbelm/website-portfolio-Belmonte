import { AVAILABILITY_ITEMS, profile } from '../data.js';
import { COPY } from '../labels.js';
import ResumeLink from '../components/ResumeLink.jsx';
import Words from '../components/Words.jsx';

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
        <div className="pro-hero-copy">
        <h1 id="pro-hero-title" className="pro-hero-name">
          <Words text={`${profile.firstName} ${profile.lastName}`} />
        </h1>
        <p className="pro-hero-role" data-hero style={step(1)}>
          {profile.roles.join(' · ')}
        </p>
        <p className="pro-hero-pitch" data-hero style={step(2)}>
          {profile.pitch}
        </p>
        {AVAILABILITY_ITEMS.length > 0 && (
          <ul className="pro-avail" aria-label="Availability" data-hero style={step(3)}>
            {AVAILABILITY_ITEMS.map((a, i) => (
              <li key={a}>
                {i === 0 && <span className="pro-dot is-live" aria-hidden="true" />}
                {a}
              </li>
            ))}
          </ul>
        )}
        <div className="pro-hero-cta" data-hero style={step(4)}>
          <ResumeLink />
          <a className="pro-btn pro-btn-secondary" href="#contact">
            {COPY.contactCta}
          </a>
        </div>
        </div>
        {profile.photo && (
          <figure className="pro-hero-photo" data-hero style={step(2)}>
            <span className="pro-hero-frame">
              <img src={profile.photo} alt={profile.photoAlt} width="600" height="600" decoding="async" />
            </span>
          </figure>
        )}
        <dl className="pro-hero-facts" data-hero style={step(5)}>
          <div>
            <dt>Status</dt>
            <dd>
              <span className="pro-dot is-live" aria-hidden="true" />
              {profile.status}
            </dd>
          </div>
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
