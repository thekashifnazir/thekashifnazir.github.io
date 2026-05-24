#!/usr/bin/env node
// Render the non-post social cards (the About page card and the site-wide
// default OG card). These are not Hugo page bundles, so they cannot go through
// generate-card.js; they use the same renderer via the shared Node helper.
//
//   node scripts/generate-site-cards.js
//
// The card ids match the originals so the seeded circuit background is stable
// across regenerations. Output filenames match the existing references:
//   - About card  -> content/about.md `images:`
//   - Site default -> hugo.toml `params.images`

const fs = require("fs");
const path = require("path");
const { renderToBuffer } = require("./lib/node-render");

const CARDS = [
  {
    file: "social-card-kashif-nazir.png",
    card: { id: "about", tag: "About", title: "Kashif Nazir", subtitle: "Senior Technical Architect" },
  },
  {
    file: "social-card-kashif-nazir-site.png",
    card: { id: "fallback", tag: "Site", title: "Kashif Nazir", subtitle: "Architecture · Cloud · AI" },
  },
];

const outDir = path.resolve(__dirname, "..", "static", "images", "social");
fs.mkdirSync(outDir, { recursive: true });

for (const { file, card } of CARDS) {
  const outPath = path.join(outDir, file);
  fs.writeFileSync(outPath, renderToBuffer(card));
  console.log(`generate-site-cards: wrote ${path.relative(process.cwd(), outPath)} (tag="${card.tag}")`);
}
