import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import { SITE } from './src/config/site.js';

const siteUrl = SITE.url.replace(/\/$/, '');

/** Size of public/resume.pdf, shown on the download button ("PDF · 84 KB"). */
function resumeSize() {
  try {
    return fs.statSync(new URL('./public/resume.pdf', import.meta.url)).size;
  } catch {
    return 0;
  }
}

const escapeAttr = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Injects SEO values from src/config/site.js into index.html
 * ({{URL}}, {{TITLE}}, ...) and emits robots.txt + sitemap.xml,
 * so changing SITE_URL in one place updates everything.
 */
function siteMeta() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE.name,
    url: `${siteUrl}/`,
    email: `mailto:${SITE.email}`,
    jobTitle: 'IT Student — App, Web & Game Developer',
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'National University – MOA' },
    sameAs: SITE.socials.filter((s) => s.href.startsWith('http')).map((s) => s.href),
  };

  const vars = {
    URL: siteUrl,
    TITLE: escapeAttr(SITE.title),
    DESCRIPTION: escapeAttr(SITE.description),
    OG_IMAGE: `${siteUrl}${SITE.ogImage}`,
    OG_IMAGE_ALT: escapeAttr(SITE.ogImageAlt),
    NAME: escapeAttr(SITE.name),
    LOCALE: SITE.locale,
    EMAIL: SITE.email,
    JSON_LD: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
  };

  return {
    name: 'player-one-site-meta',
    transformIndexHtml(html) {
      return html.replace(/\{\{(\w+)\}\}/g, (match, key) => (key in vars ? vars[key] : match));
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>\n</urlset>\n`,
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), siteMeta()],
  define: {
    __RESUME_SIZE__: JSON.stringify(resumeSize()),
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // keep GSAP in its own cacheable chunk; three + howler are lazy-loaded anyway
        manualChunks: { gsap: ['gsap', 'gsap/ScrollTrigger'] },
      },
    },
  },
});
