// Node-side rendering helper shared by the post CLI (generate-card.js) and the
// site-card script (generate-site-cards.js). It owns the node-canvas specifics
// — font registration and the roundRect polyfill — in one place so the two
// entry points can never drift apart.
//
// Fonts: the shared renderer asks for "Georgia, serif" (titles) and
// "sans-serif" (tag/byline/footer). Runners do not ship Georgia, so we vendor
// substitutes (both SIL OFL — see scripts/fonts/) and register them under those
// exact family names, keeping output identical in CI and locally:
//   - Gelasio: a metric- and weight-compatible Georgia replacement, so titles
//     match the heavier Georgia weight used by the browser generator (a Times-
//     like serif would render too thin).
//   - Liberation Sans: Arial-compatible, for the tag/byline/footer.
// registerFont must run before any canvas context is created, so it happens
// here at module load.

const path = require("path");
const { createCanvas, registerFont } = require("canvas");
const { W, H, renderCard } = require("./render-card");

const FONT_DIR = path.join(__dirname, "..", "fonts");
registerFont(path.join(FONT_DIR, "Gelasio.ttf"), { family: "Georgia" });
registerFont(path.join(FONT_DIR, "LiberationSans-Regular.ttf"), { family: "sans-serif", weight: "normal" });
registerFont(path.join(FONT_DIR, "LiberationSans-Bold.ttf"), { family: "sans-serif", weight: "bold" });

// renderCard draws the tag pill with roundRect, a relatively recent canvas API.
// Polyfill it if the installed node-canvas predates support, so output never
// depends on the exact canvas version.
function ensureRoundRect(ctx) {
  if (typeof ctx.roundRect === "function") return;
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

// Render a card object ({ id, tag, title, subtitle }) to a PNG Buffer.
function renderToBuffer(card) {
  const canvas = createCanvas(W, H);
  ensureRoundRect(canvas.getContext("2d"));
  renderCard(canvas, card);
  return canvas.toBuffer("image/png");
}

module.exports = { renderToBuffer };
