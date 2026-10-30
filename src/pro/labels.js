/**
 * Professional-mode presentation mapping.
 *
 * Player One words its sections as a game ("Quest Log", "Skill Tree"…). This file only
 * re-labels them for recruiters; the facts always come from src/data/*.json and
 * src/config/site.js. Nothing here adds a claim.
 */

/** Same ids as Player One (config/levels.js), so #hash links and scroll position carry across modes. */
export const NAV = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'quests', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'achievements', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
];

/** Page order. `title` is the hero. */
export const SECTION_IDS = ['title', ...NAV.map((n) => n.id)];

export const SECTIONS = {
  about: { title: 'About' },
  projects: { title: 'Selected projects', sub: 'Live demos and source code where they are public.' },
  quests: { title: 'Experience & education', sub: 'School, training and personal projects.' },
  skills: { title: 'Technical skills', sub: 'Self-assessed levels. The scale is defined below.' },
  achievements: { title: 'Certifications', sub: 'Each links to the issuer’s verification page where one exists.' },
  contact: { title: 'Contact', sub: 'Hiring for an OJT or internship? I usually reply within 1–2 days.' },
};

export const FEATURED_LABEL = 'Featured project'; // "Boss Level" in Player One

export const PROJECT_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'web', label: 'Web' },
  { id: 'app', label: 'App' },
  { id: 'game', label: 'Game' },
];
export const CATEGORY_LABEL = { web: 'Web', app: 'App', game: 'Game' };

export const TIMELINE_TYPE = {
  education: 'Education',
  training: 'Training',
  project: 'Project',
  content: 'Content creation',
  volunteer: 'Volunteer',
  competition: 'Competition',
};

export const COPY = {
  resume: 'Download resume',
  contactCta: 'Contact me',
  viewProjects: 'View projects',
  noDemo: 'No public demo yet',
  privateSource: 'Source is private',
  demoDefault: 'Live demo',
  source: 'Source code',
  verify: 'Verify credential',
  showAllCerts: (n) => `Show all ${n} certifications`,
  showFewerCerts: 'Show fewer',
  noProjects: 'No projects match these filters. Clear a filter to see more.',
  noCerts: 'No certifications from this issuer.',
  sent: 'Thanks. Your message was sent and I will reply soon.',
  sentAgain: 'Send another message',
  sending: 'Sending…',
  send: 'Send message',
  copyEmail: 'Copy email address',
  copied: 'Copied',
};

/*
 * A few Player One phrases live inside data strings. Rewrite just those, for display only,
 * so Professional doesn't point at sections that don't exist there. Anything else passes through.
 */
const REWRITES = [
  [/\s*\(Boss Level\)/g, ''],
  [/^Main quest\.\s*/, ''],
  [/the Trophy Room/g, 'the Certifications section'],
];
export const proText = (text) => REWRITES.reduce((t, [from, to]) => t.replace(from, to), text ?? '');
