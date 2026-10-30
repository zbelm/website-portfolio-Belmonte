/**
 * Professional-mode data selectors. Reads the same JSON as Player One, so editing a
 * data file updates both modes. Placeholder entries ([REPLACE ME], placeholder: true)
 * are dropped here, the way Player One tags them: recruiters never see them.
 */
import certifications from '../data/certifications.json';
import profile from '../data/profile.json';
import projects from '../data/projects.json';
import skills from '../data/skills.json';
import streams from '../data/streams.json';
import timeline from '../data/timeline.json';
import { SITE } from '../config/site.js';
import { isPlaceholder } from '../lib/format.js';
import { proText } from './labels.js';

const hasPlaceholder = (entry) => entry.placeholder === true || JSON.stringify(entry).includes('[REPLACE ME]');
const clean = (text) => (isPlaceholder(text) ? '' : text);

export { profile, skills };

export const fullName = `${profile.firstName} ${profile.lastName}`;

/** Featured project first (Player One's "boss"), then data order. */
/*
 * Only real screenshots (.webp/.png/.jpg) are shown as project images. The .svg files in
 * public/projects are Player One's retro cover art (some carry baked-in "[REPLACE ME]" text),
 * so a project that only has one gets a neutral panel instead.
 */
const hasScreenshot = (p) => !/\.svg(\?|$)/i.test(p.thumbnail ?? '');
const initials = (title) => title.split(/[\s—-]+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

export const PROJECTS = projects
  .filter((p) => !hasPlaceholder(p))
  .map((p) => ({
    ...p,
    highlights: (p.highlights ?? []).filter((h) => !isPlaceholder(h)),
    hasScreenshot: hasScreenshot(p),
    initials: initials(p.title),
  }))
  .sort((a, b) => Number(Boolean(b.boss)) - Number(Boolean(a.boss)));

export const TIMELINE = timeline
  .filter((t) => !hasPlaceholder(t))
  .map((t) => ({ ...t, title: proText(t.title), description: proText(t.description) }));

/** Newest first. */
export const CERTS = certifications
  .filter((c) => !hasPlaceholder(c))
  .sort((a, b) => String(b.date).localeCompare(String(a.date)));

export const STORY = profile.story.map(clean).filter(Boolean);
export const AVAILABILITY = clean(profile.availability);

/** Contact links: the site's socials + any creator channel that has a real URL (same rule as Player One). */
export const CONTACT_LINKS = [
  ...SITE.socials,
  ...streams.channels.filter((c) => c.url).map((c) => ({ id: c.platform, label: c.platform, href: c.url, handle: c.handle })),
];

/** Counts shown in About; derived from the data, never typed in. */
export const STATS = [
  { label: 'Projects', value: PROJECTS.length },
  { label: 'Live sites', value: PROJECTS.filter((p) => p.status === 'Live' && p.demoUrl).length },
  { label: 'Certifications', value: CERTS.length },
];

/** Tech tags used by 2+ projects, most common first (for the project filter). */
export const TECH_TAGS = (() => {
  const counts = new Map();
  PROJECTS.forEach((p) => p.tech.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
  return [...counts].filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 8).map(([t]) => t);
})();

/** Tier (Learning / Working / Confident / Expert) for a 1–10 skill level, and its 1-based step. */
export function tierFor(level) {
  const i = skills.scale.findIndex((s) => level >= s.min && level <= s.max);
  const step = i === -1 ? 0 : i;
  return { ...skills.scale[step], step: step + 1 };
}
