#!/usr/bin/env node
// Render a post's social card to a 1200x630 PNG.
//
//   node scripts/generate-card.js content/blog/{slug}/index.md
//
// Reads frontmatter, builds the card object, renders via the shared lib, and
// writes static/images/social/social-card-{slug}.png (the central, PaperMod-
// idiomatic location wired through each post's `images:` frontmatter key).
//
// Fonts: the shared renderer asks for "Georgia, serif" (titles) and
// "sans-serif" (tag/byline/footer). Runners do not ship Georgia, so we vendor
// substitutes (both SIL OFL — see scripts/fonts/) and register them under those
// exact family names, keeping output identical in CI and locally:
//   - Gelasio: a metric- and weight-compatible Georgia replacement, so titles
//     match the heavier Georgia weight used by the browser generator (a Times-
//     like serif would render too thin).
//   - Liberation Sans: Arial-compatible, for the tag/byline/footer.

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { createCanvas, registerFont } = require("canvas");

const FONT_DIR = path.join(__dirname, "fonts");
registerFont(path.join(FONT_DIR, "Gelasio.ttf"), { family: "Georgia" });
registerFont(path.join(FONT_DIR, "LiberationSans-Regular.ttf"), { family: "sans-serif", weight: "normal" });
registerFont(path.join(FONT_DIR, "LiberationSans-Bold.ttf"), { family: "sans-serif", weight: "bold" });

const { W, H, renderCard } = require("./lib/render-card");

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

const canvas = createCanvas(W, H);

// roundRect is used by the shared renderer for the tag pill. It is a relatively
// recent canvas API; polyfill it if the installed node-canvas predates support
// so CI never depends on the exact canvas version.
const ctx = canvas.getContext("2d");
if (typeof ctx.roundRect !== "function") {
  ctx.constructor.prototype.roundRect = function (x, y, w, h, r) {
    const radius = Math.min(typeof r === "number" ? r : 0, w / 2, h / 2);
    this.moveTo(x + radius, y);
    this.arcTo(x + w, y, x + w, y + h, radius);
    this.arcTo(x + w, y + h, x, y + h, radius);
    this.arcTo(x, y + h, x, y, radius);
    this.arcTo(x, y, x + w, y, radius);
    this.closePath();
    return this;
  };
}

renderCard(canvas, card);

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
fs.writeFileSync(outPath, canvas.toBuffer("image/png"));

console.log(`generate-card: wrote ${path.relative(process.cwd(), outPath)} (tag="${card.tag}")`);
