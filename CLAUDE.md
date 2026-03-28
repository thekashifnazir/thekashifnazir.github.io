# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Hugo site for **kashifnazir.com** — a personal portfolio built on the PaperMod theme with a heavily customised "circuit spine editorial" visual layer. The design uses a warm cream/terracotta palette (Fraunces + Outfit typography) with scroll-driven SVG circuit-board animations connecting homepage sections.

See the parent `../CLAUDE.md` for general Hugo/PaperMod conventions, git workflow, branch naming, and PR requirements. This file covers what's specific to the `claude-site/` subdirectory.

## Commands

```bash
# Dev server (drafts included)
hugo server -D

# Production build (validation — must pass before any PR)
hugo --gc --minify

# New blog post
hugo new blog/my-post-title.md

# Install JS dependencies (required for GSAP/Lenis — CI runs npm ci)
npm ci
```

Hugo version: **0.157.0 extended** (required — the baseof template enforces >= 0.146.0).

## Architecture

### Layout Override Layer

Every major page type has a custom layout that replaces PaperMod's defaults. Hugo's lookup order means these take precedence over `themes/PaperMod/layouts/`:

| Layout file | What it renders |
|---|---|
| `layouts/_default/baseof.html` | Shell: loader animation, skip-link, header/footer wiring |
| `layouts/index.html` | Homepage: editorial hero, writing grid, "beyond" section — all driven by `[params.editorial]` in `hugo.toml` |
| `layouts/_default/single.html` | Blog post (`.editorial-post` wrapper) |
| `layouts/_default/about.html` | About page (selected via `layout: about` in frontmatter) |
| `layouts/blog/list.html` | Blog listing with `.blog-grid` / `.blog-card` components |
| `layouts/projects/list.html` | Project listing with `.project-grid` / `.project-card` components |
| `layouts/projects/single.html` | Individual project page |
| `layouts/partials/header.html` | Custom nav with monogram logo, mobile hamburger + overlay |
| `layouts/partials/footer.html` | Editorial footer (replaces PaperMod's) |
| `layouts/partials/extend_head.html` | Google Fonts (Fraunces, Outfit, JetBrains Mono) |
| `layouts/partials/extend_footer.html` | Bundles `assets/js/main.js` via Hugo Pipes (`js.Build`) |

### CSS: Single Custom File

All custom styling lives in **`assets/css/extended/custom.css`** (~1700 lines). PaperMod auto-loads any CSS in `assets/css/extended/`. The file defines:

- CSS custom properties (`:root` — palette, spacing, PaperMod variable overrides)
- Every custom component (`.hero`, `.writing-card`, `.blog-card`, `.project-card`, `.circuit-*`, `.mobile-spine`, `.editorial-post`, `.editorial-footer`, `.loader`, `.reading-progress`, etc.)
- Full responsive breakpoints (768px mobile threshold throughout)
- Light theme only (`defaultTheme = 'light'`, `disableThemeToggle = true` in hugo.toml) — no dark mode CSS needed

### JavaScript Animation Layer

`assets/js/main.js` is the main animation bundle, built by Hugo Pipes with ES module imports from `node_modules/`:

- **Lenis** — smooth scrolling (disabled for `prefers-reduced-motion`)
- **GSAP** + ScrollTrigger + MotionPathPlugin + DrawSVGPlugin — scroll-driven animations
- **Circuit Spine** (`initCircuit()`) — SVG path drawn along the left edge of the homepage, connecting sections marked with `data-circuit-node` attributes. Generates PCB-style traces, via pads, stubs, and an animated "packet" that follows scroll progress
- **Mobile Spine** (`initMobileSpine()`) — simplified vertical thread for mobile (<768px), with node labels that flash on section entry
- **Loader** (`initLoader()`) — monogram "KN" draw animation on first session visit (skipped on repeat via `sessionStorage`)
- **Page transitions** (`initTransitions()`) — View Transitions API with GSAP fallback

`assets/js/circuit-canvas.js` is an older canvas-based circuit background (exported as `initCircuitCanvas`). It is **not currently imported** — the SVG-based circuit spine in `main.js` replaced it. It can be deleted if confirmed unused.

### npm Dependencies

`package.json` declares `gsap`, `lenis`, and `three`. Hugo's `js.Build` resolves imports from `node_modules/`. Three.js does not appear to be actively used — only gsap and lenis are imported in `main.js`.

### Homepage Data Flow

The homepage hero and closing CTA pull content from `hugo.toml` under `[params.editorial]`:
```
headline, role, lede, ctaLabel, ctaUrl, closingText, closingCtaLabel, closingCtaUrl
```
Sections are wired to the circuit spine via `data-circuit-node` attributes: `origin` (hero), `output` (writing), `signal` (beyond).

## Key Constraints

- **Theme is read-only**: `themes/PaperMod/` is a git submodule. Override via repo-level `layouts/` or `assets/css/extended/`, never edit theme files.
- **Light mode only**: Dark mode is disabled in config. No dark-mode CSS or toggle exists.
- **Motion safety**: All animations check `prefers-reduced-motion` and degrade gracefully — maintain this pattern.
- **`public/` is gitignored**: Never commit build output.
- **Hugo Pipes for JS**: JS is bundled via `js.Build` in `extend_footer.html`, not a separate bundler. npm packages are resolved from `node_modules/` at build time.
- **Sensitive files**: `hugo.toml`, `static/CNAME`, `.github/workflows/hugo.yaml` — changes require explanation in PR description.

## Content Maintenance

When adding or removing blog posts, projects, or pages, update `static/llms.txt` to reflect the current site content.

## Design Direction

`DESIGN-REFINEMENT.md` documents the ongoing visual refinement plan. The site intentionally moved away from generic AI-portfolio aesthetics (neon, glassmorphism, particles) toward an editorial, content-first design. Avoid reintroducing effects that serve decoration over content.
