# Design: Professional mode

> Scope: the **Professional** mode only. **Player One** (retro game theme, `src/styles/*`) is the incumbent world and is documented by its own code; it is not blended with, or restyled by, anything below.
> Status: built. Code lives in `src/pro/`; tokens in `src/pro/styles/pro-tokens.css`.

All Professional styles live in `src/pro/styles/` and are scoped to `[data-mode='pro']`. Nothing here leaks into Player One.

## Visitor mode and job

Experience (a portfolio) with a Persuade job: a recruiter skims on phone or laptop for about a minute and must find name, role, availability, resume, projects, verifiable credentials and contact without hunting. The interface recedes; the work and the facts lead.

## Thesis

A well-set CV that happens to be a website: ruled, typographic, quiet. Structure comes from hairlines, whitespace and type scale, not from boxes, icons or color. One cobalt accent marks only what is actionable or live. Refuses: the card-grid SaaS template, glass, gradient text, eyebrow labels above headings, section numbers.

## Color (restrained: tinted neutrals + one accent)

Cool, slightly blue-tinted neutrals. The accent echoes the NU blue and is the only chroma on the page.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--pro-bg` | `#f5f6f9` | `#0a0e1a` | page ground |
| `--pro-surface` | `#ffffff` | `#111729` | cards, drawer, inputs |
| `--pro-ink` | `#0d1222` | `#eceff7` | headings, body (17.3:1 / 16.7:1) |
| `--pro-muted` | `#4a5368` | `#a4aec4` | secondary text (7.1:1 / 8.7:1) |
| `--pro-faint` | `#5d6679` | `#8f9ab3` | meta text (5.3:1 / 6.8:1) |
| `--pro-line` | `#d9dde6` | `#252d44` | hairlines (decorative) |
| `--pro-line-strong` | `#7b849a` | `#5b6684` | control borders (≥3:1) |
| `--pro-accent` | `#1d4ed8` | `#8aa9ff` | links, primary button, focus, live dot (6.2:1 / 8.4:1) |
| `--pro-accent-ink` | `#ffffff` | `#0a0e1a` | text on accent fills (6.7:1 / 8.4:1) |

Light/dark follows the shared theme state (stored `p1-theme` choice, else `prefers-color-scheme`). Status is carried by shape and text, never hue alone: Live = filled accent dot, In development = hollow dot.

## Typography

Self-hosted in `public/fonts`, latin subset, `font-display: swap`, no CDN.

- **UI / body: Geist** (variable, 100–900). 16px base, line-height 1.6, measure ≤ 68ch.
- **Display: Gloock** (400). Used only for the hero name, section titles and numerals. Swap candidate if it fails the screenshot review: Bricolage Grotesque.
- Fluid scale with `clamp()`: hero `clamp(2.75rem, 1.2rem + 7vw, 6rem)`, section title `clamp(2rem, 1.2rem + 3vw, 3.25rem)`, body 1rem, small 0.875rem. Display tracking ≥ -0.02em, `text-wrap: balance` on headings, `pretty` on paragraphs. Tabular figures for counts and dates.
- Monospace (system stack) only for credential IDs.

## Spacing, shape, depth

- 8px grid: `--pro-s-1…9` = 4, 8, 16, 24, 32, 48, 64, 96, 128px. Section padding `clamp(64px, 10vw, 128px)`; more space above a heading than below.
- Container 1120px, gutter 24px (16px under 480px).
- Radius: 6 (tags), 8 (buttons, inputs), 12 (cards), 20 (drawer). Pills only for status and filter chips.
- Shadow: two soft layers with real offset and blur (`0 1px 2px` + `0 12px 32px -12px`); in dark mode borders carry elevation, shadows nearly vanish.
- Never: colored side borders, hard offset shadows, nested cards.

## Components

- **Mode switch**: native radio group styled as a segmented control, "Player One | Professional", visible focus ring, 44px targets.
- **Nav**: sticky, hairline bottom border, 94% ground (no blur), name left, section links, mode switch, theme toggle; scroll-spy underline; 2px scroll-progress line under the bar. Mobile: popover menu.
- **Project card**: 16:9 screenshot (explicit ratio, lazy; projects that only have Player One's SVG cover art get a neutral panel, or a text-only card when featured), title button stretched over the card, status dot, tagline, tech tags, live/source links raised above. Cursor-following spotlight on hover (pointer: fine).
- **Project detail**: native `<dialog>` drawer (right on desktop, bottom sheet on mobile), `closedby="any"`.
- **Skills**: grouped lists, each skill shows its tier word from `skills.json` (Learning / Working / Confident / Expert) plus a 4-step indicator; "learning" skills are labelled. No XP bars.
- **Certifications**: compact issuer-badge cards, issuer filter, "Verify" link only when `verifyUrl` exists.
- **Timeline**: vertical rule that draws on scroll; markers distinguish in-progress (accent) from complete (neutral).
- **Buttons**: primary (accent fill), secondary (hairline outline), text link. Press = `scale(0.97)`.
- **Form**: visible labels, 3:1 control borders, inline errors tied with `aria-describedby`.

## Motion

Language: calm, fast, exponential ease-out. Only `transform` and `opacity` animate (plus `clip-path` for none; no layout properties).

| Moment | Duration | Easing |
| --- | --- | --- |
| Hero entrance (name, role, pitch, CTAs, facts) | 600ms, 70ms stagger, 14px rise | `cubic-bezier(0.23, 1, 0.32, 1)` |
| Scroll reveal (GSAP + ScrollTrigger, once) | 500ms, 60ms stagger, 16px rise | `power3.out` |
| Button press / release | 120ms / 160ms | ease-out |
| Card lift + spotlight fade | 220ms | ease-out |
| Nav underline | 200ms, `scaleX` from left | ease-out |
| Count-up (once, tabular figures) | 900ms | `power2.out` |
| Timeline rule draw | scrubbed to scroll | linear |
| Drawer open / close | 260ms / 160ms | `cubic-bezier(0.32, 0.72, 0, 1)` |
| Mode switch | 350ms View Transitions cross-fade; plain swap where unsupported or reduced motion | ease-out |
| Hero gradient drift | 28s alternate, `transform` only | ease-in-out |

Spotlight and card lift need a fine pointer; `will-change` is applied only while a card is hovered. Does not animate: scroll-spy state, filter result swaps, theme toggle, form validation, anything triggered by keyboard shortcuts. `prefers-reduced-motion` (via the `motion-ok` class): no movement, no count-up, no drift, no view-transition animation; opacity-only fades at most; all content is visible and usable without motion.

## Layout

Hero (id `title`) → About (`about`) → Selected Projects (`projects`) → Experience & Education (`quests`) → Technical Skills (`skills`) → Certifications (`achievements`) → Contact (`contact`). Section ids match Player One's so `#hash` links and scroll position carry across modes. Mobile-first; verified at 360 / 768 / 1024 / 1440px.
