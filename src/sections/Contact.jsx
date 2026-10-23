import { useRef, useState } from 'react';
import streams from '../data/streams.json';
import { SITE } from '../config/site.js';
import { useReveal } from '../hooks/useReveal.js';
import { play } from '../lib/sound.js';
import { ENVELOPE, ENVELOPE_PALETTE } from '../lib/pixelArt.js';
import PixelDivider from '../components/PixelDivider.jsx';
import PixelSprite from '../components/PixelSprite.jsx';
import SectionHeader from '../components/SectionHeader.jsx';

/*
 * Contact form — no server needed.
 * Uses Web3Forms by default (set VITE_FORM_KEY to your access key),
 * or Formspree (set VITE_FORM_PROVIDER=formspree and VITE_FORM_KEY to your form ID).
 */
const FORM_KEY = import.meta.env.VITE_FORM_KEY;
const PROVIDER = (import.meta.env.VITE_FORM_PROVIDER || 'web3forms').toLowerCase();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function sendMessage({ name, email, message }) {
  if (PROVIDER === 'formspree') {
    const res = await fetch(`https://formspree.io/f/${FORM_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ name, email, message, _subject: `Portfolio message from ${name}` }),
    });
    if (!res.ok) throw new Error('Formspree rejected the message');
    return;
  }
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: FORM_KEY,
      subject: `Portfolio message from ${name}`,
      from_name: 'Player One Portfolio',
      name,
      email,
      message,
      botcheck: '',
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) throw new Error(json.message || 'Web3Forms rejected the message');
}

const contactLinks = [
  ...SITE.socials,
  ...streams.channels.filter((c) => c.url).map((c) => ({ id: c.platform, label: c.platform, icon: c.icon, href: c.url, handle: c.handle })),
];

/** LEVEL 2-3 — Join My Party: contact form + links. */
export default function Contact() {
  const ref = useRef(null);
  const formRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  useReveal(ref);

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    // honeypot: humans never see this field, bots fill it → pretend success, send nothing
    if (data.get('botcheck')) {
      setStatus('sent');
      return;
    }
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    const nextErrors = {};
    if (!name) nextErrors.name = 'Please enter your name.';
    if (!EMAIL_RE.test(email)) nextErrors.email = 'Please enter a valid email address.';
    if (message.length < 10) nextErrors.message = 'Message should be at least 10 characters.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      play('error');
      formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    if (!FORM_KEY) {
      setStatus('error');
      setErrorMsg(`The form isn't connected yet (missing VITE_FORM_KEY). Please email me at ${SITE.email}.`);
      return;
    }
    setStatus('sending');
    try {
      await sendMessage({ name, email, message });
      setStatus('sent');
      play('jingle');
    } catch {
      setStatus('error');
      setErrorMsg(`Something went wrong sending your message. Please email me directly at ${SITE.email}.`);
      play('error');
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the mailto link still works */
    }
  };

  return (
    <section id="contact" ref={ref} className="section section-alt" aria-labelledby="contact-title">
      <PixelDivider color="var(--bg)" />
      <div className="container">
        <SectionHeader
          id="contact-title"
          levelId="contact"
          kicker="Contact"
          title="Join My Party"
          sub="Hiring for an OJT / internship? Send an invite — I usually reply within 1–2 days."
        />

        <div className="contact-grid">
          <div className="panel contact-links" data-reveal>
            <h3>Party invites</h3>
            <p>Pick a channel. Email is the fastest way to reach me.</p>
            <ul className="link-list">
              {contactLinks.map((l) => {
                const external = l.href.startsWith('http');
                return (
                  <li key={l.id}>
                    <a
                      className="link-row"
                      href={l.href}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      <span className="key-cap" aria-hidden="true">
                        {l.icon}
                      </span>
                      <span className="link-label">{l.label}</span>
                      <span className="link-handle">{l.handle}</span>
                      {external && <span className="sr-only"> (opens in a new tab)</span>}
                    </a>
                  </li>
                );
              })}
            </ul>
            <button type="button" className="btn btn-sm btn-ghost" onClick={copyEmail}>
              {copied ? 'Copied! ✓' : 'Copy email address'}
            </button>
            <span className="sr-only" aria-live="polite">
              {copied ? 'Email address copied' : ''}
            </span>
          </div>

          <div className="panel contact-form-panel" data-reveal>
            {status === 'sent' ? (
              <div className="sent-screen" role="status">
                <div className="sent-envelope" aria-hidden="true">
                  <PixelSprite grid={ENVELOPE} palette={ENVELOPE_PALETTE} scale={8} />
                  <span className="sent-star s1">★</span>
                  <span className="sent-star s2">★</span>
                  <span className="sent-star s3">★</span>
                </div>
                <p className="sent-title">Message sent!</p>
                <p>+100 XP · Thanks for the invite — I&apos;ll get back to you soon.</p>
                <button
                  type="button"
                  className="btn btn-sm btn-cyan"
                  onClick={() => {
                    setStatus('idle');
                    setErrors({});
                  }}
                >
                  Send another
                </button>
              </div>
            ) : (
              <form ref={formRef} className="contact-form" onSubmit={onSubmit} noValidate>
                <h3>Send a party invite</h3>
                <div className="field">
                  <label htmlFor="cf-name">Name</label>
                  <input
                    id="cf-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    aria-invalid={errors.name ? 'true' : undefined}
                    aria-describedby={errors.name ? 'cf-name-err' : undefined}
                  />
                  {errors.name && (
                    <p id="cf-name-err" className="field-error">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="field">
                  <label htmlFor="cf-email">Email</label>
                  <input
                    id="cf-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    aria-invalid={errors.email ? 'true' : undefined}
                    aria-describedby={errors.email ? 'cf-email-err' : undefined}
                  />
                  {errors.email && (
                    <p id="cf-email-err" className="field-error">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="field">
                  <label htmlFor="cf-message">Message</label>
                  <textarea
                    id="cf-message"
                    name="message"
                    rows={5}
                    required
                    aria-invalid={errors.message ? 'true' : undefined}
                    aria-describedby={errors.message ? 'cf-message-err' : undefined}
                  />
                  {errors.message && (
                    <p id="cf-message-err" className="field-error">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Honeypot — hidden from people and screen readers */}
                <div className="hp-field" aria-hidden="true">
                  <label htmlFor="cf-botcheck">Leave this empty</label>
                  <input id="cf-botcheck" name="botcheck" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                {status === 'error' && (
                  <p className="form-error" role="alert">
                    {errorMsg}
                  </p>
                )}

                <button type="submit" className="btn btn-yellow" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : '▶ Send message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
