Scaffold a new post on a draft branch.

Steps:
1. Ask the user for the post title, the section/category (used as the social
   card's tag label, e.g. "Build Log"), topic tags, a one-sentence description,
   and the markdown body if not provided.
2. Generate a slug from the title (lowercase, hyphens, no punctuation).
3. Create branch `posts/draft-{slug}` from `main`.
4. Create directory `content/blog/{slug}/`.
5. Write `content/blog/{slug}/index.md` with frontmatter matching the site schema:
   ```yaml
   ---
   title: "{title}"
   date: {today}
   draft: true
   description: "{description}"
   images: ["/images/social/social-card-{slug}.png"]
   tags: [{tags}]
   categories: ["{category}"]
   ShowToc: true
   ---
   ```
   Then the body. Do NOT add `tag` or `subtitle` fields — the card generator
   derives the tag from `categories[0]` and uses a default byline.
6. Source 3 hero image candidates from Unsplash matching the post's topic.
   Attach them as a single comment on the PR (not committed to the branch).
7. Open a **draft** PR titled "Draft: {title}" with a body that includes the
   Cloudflare preview URL placeholder, a checklist (hero image picked, social
   card generated, final read), and a note that the social card Action will run
   automatically and commit `static/images/social/social-card-{slug}.png` back
   to the branch.
8. Reply with the PR URL.
