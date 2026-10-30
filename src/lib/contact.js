/*
 * Contact form transport, shared by Player One and Professional — no server needed.
 * Uses Web3Forms by default (set VITE_FORM_KEY to your access key),
 * or Formspree (set VITE_FORM_PROVIDER=formspree and VITE_FORM_KEY to your form ID).
 */
export const FORM_KEY = import.meta.env.VITE_FORM_KEY;
const PROVIDER = (import.meta.env.VITE_FORM_PROVIDER || 'web3forms').toLowerCase();
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Sends one message; throws if the provider rejects it. `fromName` is the sender label the inbox shows. */
export async function sendMessage({ name, email, message }, fromName = 'Player One Portfolio') {
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
      from_name: fromName,
      name,
      email,
      message,
      botcheck: '',
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) throw new Error(json.message || 'Web3Forms rejected the message');
}
