# kashifnazir.com

Personal site. Hugo + PaperMod theme, deployed to GitHub Pages from `main`.
Public repo — assume anything committed here is visible.

## Structure

- `content/blog/{slug}/index.md` — each post is a page bundle (folder, not flat file)
- `content/blog/{slug}/*.{png,jpg,webp}` — inline post images, sourced manually
- `static/images/social/social-card-{slug}.png` — OG card, 1200×630, generated
  (do not hand-edit); wired into the post via the `images:` frontmatter key
- `static/images/social/site-default.png` — fallback OG card for non-post pages
- `layouts/`, `assets/`, `themes/PaperMod/` — theme and overrides
- `scripts/generate-card.js` — Node CLI that renders the social card for a post
- `scripts/lib/render-card.js` — pure rendering logic, shared with the React generator
- `scripts/fonts/` — vendored Liberation Serif/Sans (SIL OFL) used by the renderer

## Frontmatter schema (new posts)

```yaml
---
title: "Post title"
date: 2026-05-24
draft: true
description: "One-sentence summary for search and OG."
images: ["/images/social/social-card-{slug}.png"]
tags: ["topic", "topic"]
categories: ["Section"]
ShowToc: true
---
```

The social card generator reads `categories[0]` (preferred) or `tags[0]`
(fallback) from existing frontmatter for the card's tag label. No new fields
required. The byline defaults to "Kashif Nazir"; add an optional `subtitle:`
field only if a post needs to override it.

`draft: true` is the default. Posts only go live when this is flipped to `false`
on `main`. Never push `draft: false` to a branch without intending to ship.

## Branch and PR conventions

- Never commit posts directly to `main`. Always work on `posts/draft-{slug}`.
- Open the PR as a **draft PR**. Mark ready for review only when the post is final.
- One post per branch. Don't bundle multiple posts.
- Branches under `posts/draft-*` are excluded from production deploys.

## The social card generator

The card is a 1200×630 PNG with a procedurally generated PCB-style background,
seeded from the post's slug + title so the same post always produces the same card.

Two ways to run it:

- **CI (canonical):** `node scripts/generate-card.js content/blog/{slug}/index.md`
  Writes to the path the post references via its `images:` frontmatter (the
  archetype sets this to `/images/social/social-card-{slug}.png`, so new posts
  are slug-based; older posts keep their existing card filename). This is what
  the GitHub Action runs on every push to a `posts/draft-*` branch.
- **Manual (React):** an in-browser generator (lives outside this repo) is for
  fiddling with copy and previewing variations. Do not let it diverge from the
  Node version — both must call the same `scripts/lib/render-card.js`.

If you touch one, touch the other. The Node script is the source of truth for
what ships to the repo.

## What not to do

- Do not write content here. Posts arrive pre-written from outside the repo.
  Your job is to scaffold, source images, regenerate cards, and open PRs.
- Do not edit `themes/PaperMod/` directly — override in `layouts/` instead.
- Do not commit anything with `draft: false` outside a deliberate publish step.
- Do not mention or reference any external workflow, project, or skill in
  commit messages, PR descriptions, or files. Keep the repo self-contained.
