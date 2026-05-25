# kashifnazir.com

Personal site. Hugo + PaperMod theme, deployed to GitHub Pages from `main`.
Public repo — assume anything committed here is visible.

## Structure

- `content/blog/{slug}/index.md` — each post is a page bundle (folder, not flat file)
- `content/blog/{slug}/*.{png,jpg,webp}` — inline post images, sourced manually
- `static/images/social/social-card-{slug}.png` — per-post OG card, 1200×630,
  generated (do not hand-edit); wired into the post via the `images:` frontmatter key
- `static/images/social/social-card-kashif-nazir.png` — About page OG card
- `static/images/social/social-card-kashif-nazir-site.png` — site-wide default OG
  card (set in `hugo.toml`); this and the About card are produced by `generate-site-cards.js`
- `layouts/`, `assets/`, `themes/PaperMod/` — theme and overrides
- `scripts/generate-card.js` — Node CLI that renders a post's social card
- `scripts/generate-site-cards.js` — renders the About and site-default cards
- `scripts/lib/render-card.js` — pure rendering logic, shared with the browser generator
- `scripts/lib/node-render.js` — Node-side font registration + render helper
- `scripts/fonts/` — vendored Gelasio (Georgia substitute) + Liberation Sans (SIL OFL)

## Frontmatter schema (new posts)

```yaml
---
title: "Post title"
date: 2026-05-24
description: "One-sentence summary for search and OG."
images: ["/images/social/social-card-{slug}.png"]
tags: ["topic", "topic"]
categories: ["Section"]
ShowToc: true
draft: false
---
```

The social card generator reads `categories[0]` (preferred) or `tags[0]`
(fallback) from existing frontmatter for the card's tag label. No new fields
required. The byline defaults to "Kashif Nazir"; add an optional `subtitle:`
field only if a post needs to override it.

`draft: false` is the default for new posts. Post PRs are publish-ready, and the
post goes live when the PR is merged to `main`.

## Branch and PR conventions

- Never commit posts directly to `main`. Always work on `content/{slug}`.
- Open a normal ready PR.
- One post per branch. Don't bundle multiple posts.
- Merge only when the post is final and intended to publish.

## The social card generator

The card is a 1200×630 PNG with a procedurally generated PCB-style background,
seeded from the post's slug + title so the same post always produces the same card.

Two ways to run it:

- **Local (canonical):** `node scripts/generate-card.js content/blog/{slug}/index.md`
  Writes to the path the post references via its `images:` frontmatter (the
  archetype sets this to `/images/social/social-card-{slug}.png`, so new posts
  are slug-based; older posts keep their existing card filename). Run it when
  scaffolding the post and commit the result alongside `index.md`.
- **Manual (React):** an in-browser generator (lives outside this repo) is for
  fiddling with copy and previewing variations. Do not let it diverge from the
  Node version — both must call the same `scripts/lib/render-card.js`.

If you touch one, touch the other. The Node script is the source of truth for
what ships to the repo.

## What not to do

- Don't author post prose here — this repo is for publishing mechanics:
  scaffolding the bundle, sourcing images, generating cards, opening PRs.
- Do not edit `themes/PaperMod/` directly — override in `layouts/` instead.
- Keep new post frontmatter publishable with `draft: false`.
- Do not mention or reference any external workflow, project, or skill in
  commit messages, PR descriptions, or files. Keep the repo self-contained.
