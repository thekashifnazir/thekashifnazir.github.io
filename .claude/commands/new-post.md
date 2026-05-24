Scaffold a new post on a draft branch.

Steps:
1. Ask the user for the post title and a one-sentence description.
2. Ask separately: "What's the category?" (one value, e.g. Infrastructure,
   Build Log, AI Strategy — this drives the social card tag label).
3. Ask separately: "What topic tags apply?" (multiple, lowercase-hyphenated).
   Ask for the markdown body if not provided.
4. Generate a slug from the title (lowercase, hyphens, no punctuation).
5. Create branch named EXACTLY `posts/draft-{slug}` from `main`.
   Do not use the default `claude/` prefix. Do not add any other prefix or suffix.
   The branch name must match the pattern `posts/draft-*` exactly,
   because the social card GitHub Action only triggers on that pattern —
   any other prefix will silently skip card generation.
6. After creating the branch, output the exact branch name to the conversation
   so the user can verify the prefix is correct before proceeding.
7. Create directory `content/blog/{slug}/`.
8. Write `content/blog/{slug}/index.md` with frontmatter matching the site schema:
   ```yaml
   ---
   title: "{title}"
   date: {today}
   draft: true
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
9. Source 3 hero image candidates from Unsplash matching the post's topic.
   Attach them as a single comment on the PR (not committed to the branch).
10. Open a **draft** PR titled "Draft: {title}" with a body that includes the
    Cloudflare preview URL placeholder, a checklist (hero image picked, social
    card generated, final read), and a note that the social card Action will run
    automatically and commit `static/images/social/social-card-{slug}.png` back
    to the branch.
11. Reply with the PR URL and the branch name.
