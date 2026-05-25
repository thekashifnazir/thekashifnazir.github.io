Scaffold a publish-ready post branch.

Steps:
1. Ask the user for the post title and a one-sentence description.
2. Ask separately: "What's the category?" (one value, e.g. Infrastructure,
   Build Log, AI Strategy — this drives the social card tag label).
3. Ask separately: "What topic tags apply?" (multiple, lowercase-hyphenated).
   Ask for the markdown body if not provided.
4. Generate a slug from the title (lowercase, hyphens, no punctuation).
5. Create branch named EXACTLY `content/{slug}` from `main`.
   Do not use the default `claude/` prefix. Do not add any other prefix or suffix.
   This is the repo convention for publish-ready post work.
6. After creating the branch, output the exact branch name to the conversation
   so the user can verify the prefix is correct before proceeding.
7. Create directory `content/blog/{slug}/`.
8. Write `content/blog/{slug}/index.md` with frontmatter matching the site schema:
   ```yaml
   ---
   title: "{title}"
   date: {today}
   draft: false
   description: "{description}"
   images: ["/images/social/social-card-{slug}.png"]
   tags: ["{tag1}", "{tag2}"]
   categories: ["{category}"]
   ShowToc: true
   ---
   ```
   Tags must use double-quoted strings to match the existing post format.
   Then the body. Do NOT add `tag` or `subtitle` fields — the card generator
   derives the tag from `categories[0]` and uses a default byline.
9. Generate the social card locally:
   `node scripts/generate-card.js content/blog/{slug}/index.md`
   Confirm `static/images/social/social-card-{slug}.png` exists.
10. Source 3 hero image candidates from Unsplash matching the post's topic.
   Attach them as a single comment on the PR (not committed to the branch).
11. Commit `content/blog/{slug}/index.md` and
    `static/images/social/social-card-{slug}.png`, push the branch, and open a
    ready PR titled "{title}" using `.github/pull_request_template.md` with a
    body that includes the Cloudflare preview URL placeholder and a checklist
    (hero image picked, social card generated, final read).
12. Reply with the PR URL and the branch name.
