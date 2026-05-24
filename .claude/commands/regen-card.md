Regenerate the social card for a post.

Steps:
1. Ask which post (slug or PR number) if not given.
2. Check out the relevant branch.
3. Run `node scripts/generate-card.js content/blog/{slug}/index.md`.
4. Commit the new PNG (`static/images/social/social-card-{slug}.png`) with
   message `chore: regenerate social card for {slug}`.
5. Push.
