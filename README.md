# PLAYER ONE — Francis Zachary Belmonte's Portfolio

A retro 8-bit / 16-bit game–themed portfolio for an IT student (BSIT – Mobile Web & App Development, National University – MOA) applying for OJT / internships. Every section is a "level", content lives in JSON files, and the heavy effects only load when the device can handle them.

**Stack:** Vite + React 18 · plain CSS · GSAP + ScrollTrigger · Three.js (lazy-loaded) · Howler.js (lazy-loaded) · deployed on Vercel.

---

## Features

| Area | What's in it |
| --- | --- |
| Intro | "PRESS START" boot screen with a fake boot log — first visit only, skippable with any key/click/tap, auto-starts after ~3 s |
| Hero | Parallax pixel city (stars + moon at night, sun + hills by day), idle pixel avatar (click to jump), role typewriter, Three.js pixel cube (CSS cube fallback), 3 CTAs |
| Levels | About (Character Select), Projects (Level Select + Boss Level + filters + detail modal), Certifications (Trophy Room with search, issuer chips, counter), Skills (XP bars), Quest Log (timeline), Streamer Mode, Contact (Join My Party), Footer |
| Motion | GSAP ScrollTrigger parallax + world-map progress rail with a walking character, GSAP pixel-dissolve section transitions, stepped 8-bit reveals and screen-wipe titles, mouse-reactive particle field, pixel cursor + trail, click sparkles, glitch text on hover |
| Easter eggs | Konami code (↑↑↓↓←→←→BA) → confetti + **Coin Rush** mini-game, 5 hidden secret coins with a HUD counter, "Insert coin" button in the footer |
| Modes | **Player One \| Professional** switch in the HUD and mobile menu: the same content as a calm, recruiter-friendly page (see [Professional mode](#professional-mode)) |
| Settings | Night Arcade / Day World theme (remembers choice, follows system by default), 8-bit sound effects (OFF by default), CRT scanlines toggle |
| Quality | Keyboard navigation, skip link, visible focus, AA contrast in both themes, `prefers-reduced-motion` calm mode, lazy images, self-hosted fonts, SEO + Open Graph + JSON-LD |

---

## Run locally

Requires **Node.js 18+**.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

```bash
npm run build     # production build → dist/
npm run preview   # serve the production build locally
```

> Tip: the boot screen shows only once. To see it again, run `localStorage.clear()` in the browser console.

### Contact form (local)

```bash
cp .env.example .env
```

Then put your key in `.env`:

```
VITE_FORM_KEY=your-web3forms-access-key
```

Get a free key at <https://web3forms.com> (enter your email → the key is emailed to you). Messages are delivered to that email.
Prefer Formspree? Set `VITE_FORM_PROVIDER=formspree` and `VITE_FORM_KEY=<your Formspree form ID>`.
Without a key the form shows a friendly "email me directly" message instead of failing silently.

---

## 1. Connect to GitHub and push to `main`

From the project folder:

```bash
git init
git add .
git commit -m "initial portfolio"
git branch -M main
git remote add origin https://github.com/zbelm/website-portfolio-Belmonte.git
git push -u origin main
```

If the repo on GitHub already has a commit (e.g. a README created on github.com), pull it first:

```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

`.env`, `node_modules/` and `dist/` are ignored by `.gitignore` — never commit your real form key.

## 2. Import the repo into Vercel + add `VITE_FORM_KEY`

1. Go to <https://vercel.com/new> and sign in with GitHub.
2. Click **Import** next to `zbelm/website-portfolio-Belmonte` (grant access to the repo if it isn't listed).
3. Vercel auto-detects **Vite**. Keep the defaults: build command `npm run build`, output directory `dist` (also pinned in `vercel.json`).
4. Open **Environment Variables** and add:
   - `VITE_FORM_KEY` = your Web3Forms access key (apply to Production, Preview and Development)
   - optional `VITE_FORM_PROVIDER` = `formspree` if you use Formspree
5. Click **Deploy**.

> `VITE_` variables are baked in at build time. If you add or change one later, redeploy (Deployments → ⋯ → Redeploy).

## 3. Set the project name / URL

1. Vercel → your project → **Settings → General → Project Name** — e.g. `francis-zachary`. Your URL becomes `https://francis-zachary.vercel.app`.
   (Or add your own domain under **Settings → Domains**.)
2. Update the **one** config constant in [`src/config/site.js`](src/config/site.js):

   ```js
   export const SITE_URL = 'https://francis-zachary.vercel.app';
   ```

   Canonical URL, Open Graph image URL, JSON-LD, `robots.txt` and `sitemap.xml` all update from it on the next build.
3. Also update `demoUrl` of the "Player One Portfolio" entry in `src/data/projects.json`.
4. Commit and push — Vercel redeploys automatically.

## 4. Automatic redeploys on every push to `main`

Nothing to configure: once the repo is imported, every `git push` to `main` triggers a new **Production** deployment.

```bash
git add .
git commit -m "Update projects"
git push
```

## 5. Preview deployments from branches (test safely)

```bash
git checkout -b new-project-card
# ...make changes...
git add .
git commit -m "Add new project card"
git push -u origin new-project-card
```

Vercel builds that branch at its own **Preview URL** (shown in the Vercel dashboard and on the GitHub pull request). Production stays untouched. When it looks good, open a pull request on GitHub and merge it into `main` → production updates.

---

## Professional mode

A second presentation of the same site for recruiters: hero, about, selected projects (filters + detail drawer), experience timeline, skills, certifications and contact. It has its own light and dark themes and shares the Night Arcade / Day World choice.

- **Switching:** the "Player One | Professional" control in the HUD (and the mobile menu) swaps the whole page in place. No reload; you stay on the same section and `#hash` links keep working. The choice is saved in `localStorage` (`p1-mode`). First-time visitors get Player One.
- **Send recruiters straight to it:** `https://<your-site>/?mode=pro` (optionally with a section, e.g. `/?mode=pro#projects`). `?mode=player-one` forces the game version. The link does not overwrite a visitor's saved choice.
- **Content is the same JSON.** Edit `src/data/*.json` and `src/config/site.js` as usual and both modes update. Professional hides placeholders (`[REPLACE ME]`, `"placeholder": true`), the HP/MP/ATK flavor stats and the streaming section.
- **Wording:** game labels are re-labelled in `src/pro/labels.js` (Quest Log → Experience & education, Skill Tree → Technical skills, Trophy Room → Certifications, Boss Level → Featured project). A few game phrases inside the data ("(Boss Level)", "Main quest.", "the Trophy Room") are rewritten for display only; the JSON is untouched.
- **Project images:** only real screenshots (`.webp` / `.png` / `.jpg`) are shown. A project whose thumbnail is an `.svg` (Player One's pixel cover art) gets a neutral panel, or a text-only card when it is the featured project. Add a screenshot to `public/projects/` and point `thumbnail` at it to show it.
- **Design notes:** [`PRODUCT.md`](PRODUCT.md) (audience, constraints) and [`DESIGN.md`](DESIGN.md) (palette, type, spacing, motion). All Professional CSS is scoped under `[data-mode='pro']`; the UI is a separate lazy-loaded chunk (`src/pro/`), so Player One visitors only download it when they switch.
- **Not mounted in Professional:** boot screen, CRT, pixel cursor, particles, coins, confetti, Konami and sound.

## 6. Editing content (no component code needed)

All content lives in `src/data/` (and site-wide settings in `src/config/site.js`). Anything still marked **`[REPLACE ME]`** or `"placeholder": true` shows an orange **[REPLACE ME]** tag on the site — fix the text, then delete the `"placeholder": true` line to hide the tag.

| File | What it controls |
| --- | --- |
| `src/config/site.js` | Domain (`SITE_URL`), page title/description, email, LinkedIn/GitHub buttons, resume file name |
| `src/data/profile.json` | Name, pitch, roles for the typewriter, school, location, status, bio, stats, availability, cert goal |
| `src/data/projects.json` | Project cartridges |
| `src/data/certifications.json` | Trophy Room |
| `src/data/skills.json` | Skill groups and levels |
| `src/data/timeline.json` | Quest Log |
| `src/data/streams.json` | Live status, channels, clips, "why streaming" cards |
| `public/resume.pdf` | Your resume — replace the file, keep the name (the size label updates on build) |

### Projects — `src/data/projects.json`

```json
{
  "id": "my-app",
  "title": "My App",
  "category": "app",
  "year": "2026",
  "status": "Live",
  "tagline": "One line about what it does.",
  "description": "2–3 sentences: problem, features, your role.",
  "role": "Lead developer",
  "tech": ["Flutter", "Firebase"],
  "highlights": ["1,000+ downloads", "Offline mode"],
  "thumbnail": "/projects/my-app.webp",
  "thumbnailAlt": "Home screen of My App",
  "screenshots": [{ "src": "/projects/my-app-2.webp", "alt": "Settings screen" }],
  "video": { "type": "youtube", "id": "dQw4w9WgXcQ" },
  "demoUrl": "https://...",
  "demoLabel": "Live Demo",
  "sourceUrl": "https://github.com/zbelm/..."
}
```

- `category`: `web`, `app` or `game` (drives the filters).
- `"boss": true` makes it the highlighted full-width **Boss Level** card (use it for the Roblox game).
- `video`: `{ "type": "youtube", "id": "…" }`, `{ "type": "mp4", "src": "/projects/clip.mp4" }`, or `null`.
- Empty `demoUrl` / `sourceUrl` show "Demo soon" / "Private repo" instead of a broken link.
- Put images in `public/projects/` — export as **WebP**, ~1280×720, under ~150 KB (e.g. <https://squoosh.app>).

### Certifications — `src/data/certifications.json`

Adding a certificate = adding one object:

```json
{
  "name": "Claude Code in Action",
  "issuer": "Anthropic",
  "date": "2026-03",
  "credentialId": "ABC123",
  "verifyUrl": "https://verify.skilljar.com/c/abc123",
  "badgeImage": "/badges/anthropic.svg",
  "skills": ["Claude Code", "AI-assisted development"]
}
```

Issuer filter chips and the "X / Y Achievements Unlocked" counter update automatically (Y = `certGoal` in `profile.json`). Cards sort newest first. Use the **official verification link** from Coursera, Credly, Skilljar, freeCodeCamp, etc. — recruiters click those. (LinkedIn's API doesn't expose certifications, which is why they live in this file; the "View my LinkedIn" button links to your profile.)

### Skills — `src/data/skills.json`

Levels are **1–10**, explained on the page by the `scale` (Learning / Working / Confident / Expert). Be honest — set `"learning": true` for things you're studying right now. Add a group by adding an object to `groups`.

### Timeline — `src/data/timeline.json`

`type`: `education`, `training`, `project`, `content`, `volunteer`, `competition`. `status`: `active` (In progress) or `complete`.

### Streams — `src/data/streams.json`

- Set `"isLive": true` and `"liveUrl"` when you go live (manual — no API keys required).
- Channels with an empty `url` are hidden, so YouTube/Twitch appear as soon as you fill them in.
- `videos`: TikTok/other clips as link cards (`"type": "tiktok"`, `url`, `thumbnail`), or YouTube embeds (`"type": "youtube"`, `"id"`) — loaded only when clicked.

### Social preview image

`public/og-image.png` (1200×630) is rendered from `scripts/og-image.html`. Edit that file and re-run the command in its comment, or replace the PNG with your own.

---

## Project structure

```
├─ index.html              # SEO/OG tags (filled from site.js at build), theme bootstrap
├─ vite.config.js          # injects SITE values, emits robots.txt + sitemap.xml, resume size
├─ vercel.json             # build settings + long-cache headers for /assets
├─ public/                 # resume.pdf, favicon, og-image, fonts/, badges/, projects/, streams/
├─ scripts/og-image.html   # source for the social preview image
└─ src/
   ├─ config/              # site.js (domain + SEO), levels.js (section order)
   ├─ data/                # ← all editable content (JSON)
   ├─ context/             # GameContext: theme, sound, CRT, coins, toasts
   ├─ hooks/               # reveal animations, active section, konami, media queries
   ├─ lib/                 # GSAP setup, 8-bit synth, pixel-art grids, helpers
   ├─ components/          # HUD, world map, boot screen, avatar, 3D cube, effects, modal…
   ├─ pro/                 # Professional mode (lazy chunk): ProApp, sections/, components/, hooks/, styles/, labels.js, data.js
   ├─ sections/            # one file per level
   └─ styles/              # tokens (both themes), base, components, sections
```

## Performance & accessibility notes

Lighthouse on the production build (local `npm run preview`): **Desktop 100 / 100 / 100 / 100**, **Mobile 97 / 100 / 100 / 100** (Performance / Accessibility / Best Practices / SEO). How:

- Three.js loads only on desktop-class devices (≥900 px, fine pointer, 4+ cores, no data-saver, no reduced motion), and only after the visitor's first interaction; everyone else gets a CSS cube. It renders at half resolution and pauses off-screen.
- GSAP + ScrollTrigger (parallax, world-map progress, pixel dissolves) are code-split and loaded at the first idle moment. One-shot scroll reveals are CSS transitions toggled by an `IntersectionObserver`, so nothing is measured on load.
- Levels below the title screen render in a React transition (time-sliced), and off-screen sections use `content-visibility: auto`.
- Howler and the Coin Rush game are separate chunks, downloaded only when used. Sounds are synthesized in the browser — no audio files.
- The two pixel fonts are self-hosted in `public/fonts` and preloaded (no layout shift); images are lazy-loaded with fixed dimensions; YouTube uses a click-to-load facade; sprites are drawn as a few SVG paths to keep the DOM small.
- `prefers-reduced-motion`: no parallax, particles freeze, no cursor trail/confetti/3D, static typewriter and dividers — all content stays visible.
- Run Lighthouse on the **production** build (`npm run build && npm run preview`, or the Vercel URL) in an incognito window. Scores vary a little between runs.
