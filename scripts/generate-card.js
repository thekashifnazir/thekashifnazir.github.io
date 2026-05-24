#!/usr/bin/env node
// Render a post's social card to a 1200x630 PNG.
//
//   node scripts/generate-card.js content/blog/{slug}/index.md
//
// Reads frontmatter, builds the card object, renders via the shared lib, and
// writes the PNG to the path the post references through its `images:`
// frontmatter (the central, PaperMod-idiomatic location).

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { renderToBuffer } = require("./lib/node-render");

function fail(msg) {
  console.error(`generate-card: ${msg}`);
  process.exit(1);
}

const input = process.argv[2];
if (!input) fail("usage: node scripts/generate-card.js content/blog/{slug}/index.md");

const mdPath = path.resolve(input);
if (!fs.existsSync(mdPath)) fail(`file not found: ${input}`);
if (path.basename(mdPath) !== "index.md") fail(`expected a post bundle index.md, got: ${input}`);

const slug = path.basename(path.dirname(mdPath));
if (!slug || slug === "blog" || slug === "content") fail(`could not derive slug from path: ${input}`);

const { data } = matter(fs.readFileSync(mdPath, "utf8"));
if (!data.title) fail(`missing required frontmatter field 'title' in ${input}`);

// Map the existing PaperMod schema onto the card's input contract. No new
// frontmatter fields are required: tag falls back through categories -> tags ->
// "Article", and subtitle defaults to the byline unless a post overrides it.
const tag =
  (Array.isArray(data.categories) && data.categories[0]) ||
  (Array.isArray(data.tags) && data.tags[0]) ||
  "Article";
const subtitle = data.subtitle || "Kashif Nazir";

const card = { id: slug, tag: String(tag), title: String(data.title), subtitle: String(subtitle) };

// Write to the path the post already references via `images:`. That frontmatter
// is the source of truth for the card's URL (baked into og:image tags), and it
// is not always slug-based on older posts. New posts get social-card-{slug}.png
// from the archetype, so the two coincide; the slug name is the fallback only
// when a post has no usable images: entry.
const repoRoot = path.resolve(__dirname, "..");
const imageRef = Array.isArray(data.images) ? data.images[0] : null;
const relOut =
  typeof imageRef === "string" && imageRef.startsWith("/images/social/") && imageRef.endsWith(".png")
    ? path.join("static", imageRef)
    : path.join("static", "images", "social", `social-card-${slug}.png`);
const outPath = path.join(repoRoot, relOut);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, renderToBuffer(card));

console.log(`generate-card: wrote ${path.relative(process.cwd(), outPath)} (tag="${card.tag}")`);
