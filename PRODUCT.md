# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: recruiters and hiring managers** screening BSIT students for OJT / internships. They skim for roughly a minute, on a phone or a laptop, and decide whether to open the resume or write back. They want proof, not personality: what was built, with what, what credentials are verifiable, when the candidate is available, and how to make contact.

**Secondary:** NU MOA OJT coordinators and faculty checking readiness; prospective freelance clients (the candidate runs a freelance site) who want to see shipped work.

## Product Purpose

A personal portfolio for Francis Zachary Belmonte (BSIT, Mobile Web & App Development, National University – MOA, 4th year). It exists to win an OJT placement (available November 2026, 800 hours total, onsite only, Metro Manila). Success: a visitor opens the resume, a live project, a verifiable credential, or the contact form within one minute.

The site ships two modes of the same content:
- **Player One**: the existing retro game experience. Incumbent, untouched.
- **Professional**: a restrained, recruiter-friendly presentation of the same data.

## Positioning

One content source, two presentations. A recruiter can get a clean, fast, scannable résumé-grade site; anyone curious can flip to the playable retro version. The candidate is an honest early-career developer who ships across web, mobile and games and holds many verifiable AI-tooling credentials.

## Operating Context

- All content lives in `src/data/*.json` and `src/config/site.js`. Editing a JSON file must update both modes.
- Placeholder entries (`[REPLACE ME]`, `placeholder: true`, empty `verifyUrl`, empty stream URLs) are hidden from recruiters in Professional mode.
- Contact form uses Web3Forms/Formspree via `VITE_FORM_KEY`; the resume is `/resume.pdf`.
- Deployed on Vercel; SEO/OG/JSON-LD are injected at build time by `vite.config.js`.

## Capabilities and Constraints

- Stack: Vite + React 18, plain CSS, GSAP + ScrollTrigger, Three.js and Howler (lazy, Player One only). No new dependencies without asking.
- First-time visitors land in Player One. `/?mode=pro` goes straight to Professional. The choice persists (`p1-mode`) and is reflected on `document.documentElement.dataset.mode`.
- Switching modes must not reload the page, lose scroll position, or break `#hash` deep links.
- Professional mode must not mount the boot screen, CRT overlay, pixel cursor, particles, coins, confetti, Konami or sound; its UI is lazy-loaded.
- HP/MP/ATK flavor stats are "for fun" and stay out of Professional mode.
- Status labels stay honest: Palaba is "In Development", not released. CustoMate lists a known gap. Skill levels follow the existing 1–10 scale and its `learning` flag.
- Lighthouse targets for Professional: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.

## Brand Commitments

- Name: Francis Zachary Belmonte (goes by "Zach"; handle "Zach.dev" in the Player One HUD).
- Voice in Professional mode: plain, confident, honest. Short declarative labels, no hype words, no invented claims. Only labels are reworded; the candidate's factual content is never changed.
- Player One's look and behavior are a brand asset and are not redesigned or blended with Professional.

## Evidence on Hand

- 11 projects with real screenshots in `public/projects` (several are SVG cover art, not screenshots), live demo URLs on Vercel, some public GitHub repos.
- 18 certifications (Anthropic, Google, Simplilearn, TESDA, Kaggle); some have official verification links, several have none.
- Education timeline (NU MOA, Senior High ICT with honors), `public/profile.jpg`, `public/resume.pdf`.
- Absent, so never fabricated: employer experience, testimonials, metrics beyond what the JSON states, YouTube/Twitch channels, stream clips (placeholders).

## Product Principles

1. Proof before polish: every section answers "what did they build / earn / can they start".
2. Same truth, different presentation: no content duplicated, nothing added.
3. Honest early-career signal: show status and skill level plainly; never inflate.
4. A recruiter's minute: the first viewport carries name, role, availability, resume and contact.
5. Fast and calm: Player One's weight stays out of Professional mode.

## Accessibility & Inclusion

WCAG 2.1 AA minimum in light and dark, keyboard-complete (skip link, visible focus, mode switch usable by keyboard), screen-reader labels, `prefers-reduced-motion` honored through the existing `motion-ok` class, 44px minimum touch targets, no horizontal scroll from 360px up.
