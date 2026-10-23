/**
 * ============================================================
 *  SITE CONFIG — the ONE place to change your domain + SEO.
 * ============================================================
 * After Vercel gives you a URL (or you rename the project to e.g.
 * "francis-zachary"), update SITE_URL below. The canonical link,
 * Open Graph tags, JSON-LD, robots.txt and sitemap.xml all use it
 * (they are injected at build time by vite.config.js).
 *
 * This file must stay plain JS (no browser APIs) because the Vite
 * config imports it in Node.
 */
export const SITE_URL = 'https://website-portfolio-belmonte.vercel.app';

export const SITE = {
  url: SITE_URL,
  name: 'Francis Zachary Belmonte',
  title: 'Francis Zachary Belmonte | App, Web & Game Developer — OJT Portfolio',
  description:
    'BSIT (Mobile Web & App Development) student at National University – MOA building web apps, mobile apps and Roblox games. Open to OJT / internships.',
  ogImage: '/og-image.png',
  ogImageAlt: 'Player One portfolio of Francis Zachary Belmonte — pixel-art title screen',
  locale: 'en_PH',
  repo: 'https://github.com/zbelm/website-portfolio-Belmonte',

  // Resume lives at public/resume.pdf — just replace that file.
  resume: {
    href: '/resume.pdf',
    fileName: 'Francis-Zachary-Belmonte-Resume.pdf',
  },

  email: 'zacharybelmonte@gmail.com',

  // Contact buttons (streaming links come from src/data/streams.json)
  socials: [
    { id: 'email', label: 'Email', icon: '@', href: 'mailto:zacharybelmonte@gmail.com', handle: 'zacharybelmonte@gmail.com' },
    { id: 'linkedin', label: 'LinkedIn', icon: 'in', href: 'https://www.linkedin.com/in/zachary-undefined-b18525411/', handle: 'Francis Zachary' },
    { id: 'github', label: 'GitHub', icon: 'GH', href: 'https://github.com/zbelm', handle: '@zbelm' },
    { id: 'github-alt', label: 'GitHub (alt)', icon: 'GH', href: 'https://github.com/kagezaza', handle: '@kagezaza' },
  ],
};
