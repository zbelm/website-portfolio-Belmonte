import { useState } from 'react';
import { SITE } from '../../config/site.js';
import { CONTACT_LINKS, EMAIL_RE, FORM_KEY, sendMessage } from '../../lib/contact.js';
import { COPY, SECTIONS } from '../labels.js';
import { IconCheck, IconCopy } from '../icons.jsx';
import SectionHead from '../components/SectionHead.jsx';

/** Contact: direct links + the same form (and VITE_FORM_KEY transport) as Player One. */
export default function Contact() {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    // honeypot: people never see this field; bots that fill it get a fake success and nothing is sent
    if (data.get('botcheck')) {
      setStatus('sent');
      return;
    }
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    const next = {};
    if (!name) next.name = 'Enter your name.';
    if (!EMAIL_RE.test(email)) next.email = 'Enter a valid email address, like name@example.com.';
    if (message.length < 10) next.message = 'Write at least 10 characters.';
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(`pro-cf-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    if (!FORM_KEY) {
      setStatus('error');
      setErrorMsg(`The form isn’t connected yet. Please email ${SITE.email} directly.`);
      return;
    }
    setStatus('sending');
    try {
      await sendMessage({ name, email, message }, 'Portfolio (Professional)');
      setStatus('sent');
    } catch {
      setStatus('error');
      setErrorMsg(`Your message wasn’t sent. Please email ${SITE.email} directly.`);
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the mailto link still works */
    }
  };

  const field = (id, label, props, Tag = 'input') => (
    <div className="pro-field">
      <label htmlFor={`pro-cf-${id}`}>{label}</label>
      <Tag
        id={`pro-cf-${id}`}
        name={id}
        required
        aria-invalid={errors[id] ? 'true' : undefined}
        aria-describedby={errors[id] ? `pro-cf-${id}-err` : undefined}
        {...props}
      />
      {errors[id] && (
        <p id={`pro-cf-${id}-err`} className="pro-field-error">
          {errors[id]}
        </p>
      )}
    </div>
  );

  return (
    <section id="contact" className="pro-section" aria-labelledby="pro-contact-title">
      <div className="pro-container">
        <SectionHead id="pro-contact-title" title={SECTIONS.contact.title} sub={SECTIONS.contact.sub} />

        <div className="pro-contact">
          <div data-pro-reveal>
            <h3 className="pro-h3">Reach me directly</h3>
            <ul className="pro-contact-links">
              {CONTACT_LINKS.map((l) => {
                const external = l.href.startsWith('http');
                return (
                  <li key={l.id}>
                    <a href={l.href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                      <span className="pro-contact-label">{l.label}</span>
                      <span className="pro-contact-handle">{l.handle}</span>
                      {external && <span className="sr-only"> (opens in a new tab)</span>}
                    </a>
                  </li>
                );
              })}
            </ul>
            <button type="button" className="pro-btn pro-btn-secondary" onClick={copyEmail}>
              {copied ? <IconCheck /> : <IconCopy />}
              {copied ? COPY.copied : COPY.copyEmail}
            </button>
            <span className="sr-only" aria-live="polite">
              {copied ? 'Email address copied' : ''}
            </span>
          </div>

          <div className="pro-form-panel" data-pro-reveal>
            {status === 'sent' ? (
              <div role="status" className="pro-sent">
                <IconCheck width={28} height={28} />
                <p>{COPY.sent}</p>
                <button
                  type="button"
                  className="pro-btn pro-btn-secondary"
                  onClick={() => {
                    setStatus('idle');
                    setErrors({});
                  }}
                >
                  {COPY.sentAgain}
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <h3 className="pro-h3">Send a message</h3>
                {field('name', 'Name', { type: 'text', autoComplete: 'name' })}
                {field('email', 'Email', { type: 'email', autoComplete: 'email' })}
                {field('message', 'Message', { rows: 5 }, 'textarea')}
                {/* honeypot: hidden from people and screen readers */}
                <div className="pro-hp" aria-hidden="true">
                  <label htmlFor="pro-cf-botcheck">Leave this empty</label>
                  <input id="pro-cf-botcheck" name="botcheck" type="text" tabIndex={-1} autoComplete="off" />
                </div>
                {status === 'error' && (
                  <p className="pro-form-error" role="alert">
                    {errorMsg}
                  </p>
                )}
                <button type="submit" className="pro-btn pro-btn-primary" disabled={status === 'sending'}>
                  {status === 'sending' ? COPY.sending : COPY.send}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
