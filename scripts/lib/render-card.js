// Pure social-card rendering logic, shared between the in-browser React
// generator and the Node CLI (scripts/generate-card.js). renderCard() takes a
// canvas as a parameter, so the same code drives an HTMLCanvasElement in the
// browser and a node-canvas Canvas in CI. Keep this file framework-free: no
// React, no DOM, no Node APIs. If you change rendering here, both consumers
// pick it up — that is the point.

const W = 1200;
const H = 630;

const P = {
  bg: "#FAF6F0",
  fg: "#2A2017",
  accent: "#B5522E",
  tagText: "#8A7A6A",
  tagBorder: "#D8CFC4",
  muted: "#9A8A7A",
  trace: "rgba(196,98,58,0.07)",
  node: "rgba(196,98,58,0.12)",
  nodeStroke: "rgba(196,98,58,0.20)",
};

function mulberry32(seed) {
  let t = seed + 0x6D2B79F5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function generateCircuit(seed) {
  const rand = mulberry32(seed);
  const nodes = [];
  const lines = [];
  const cols = 14, rows = 7;
  const cellW = W / cols, cellH = H / rows;
  const grid = [];

  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      if (rand() < 0.6) {
        const x = Math.round(c * cellW + cellW * 0.2 + rand() * cellW * 0.6);
        const y = Math.round(r * cellH + cellH * 0.2 + rand() * cellH * 0.6);
        const radius = rand() < 0.3 ? 4 : rand() < 0.6 ? 3 : 2;
        nodes.push({ x, y, r: radius });
        grid[r][c] = nodes[nodes.length - 1];
      } else {
        grid[r][c] = null;
      }
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const nd = grid[r][c];
      if (!nd) continue;
      for (let dc = 1; dc <= 2; dc++) {
        if (c + dc < cols && grid[r][c + dc] && rand() < 0.45) {
          const tg = grid[r][c + dc];
          if (rand() < 0.6) {
            lines.push([nd.x, nd.y, tg.x, nd.y]);
            if (nd.y !== tg.y) lines.push([tg.x, nd.y, tg.x, tg.y]);
          } else {
            const mx = Math.round((nd.x + tg.x) / 2);
            lines.push([nd.x, nd.y, mx, nd.y], [mx, nd.y, mx, tg.y], [mx, tg.y, tg.x, tg.y]);
          }
          break;
        }
      }
      for (let dr = 1; dr <= 2; dr++) {
        if (r + dr < rows && grid[r + dr] && grid[r + dr][c] && rand() < 0.4) {
          const tg = grid[r + dr][c];
          if (rand() < 0.6) {
            lines.push([nd.x, nd.y, nd.x, tg.y]);
            if (nd.x !== tg.x) lines.push([nd.x, tg.y, tg.x, tg.y]);
          } else {
            const my = Math.round((nd.y + tg.y) / 2);
            lines.push([nd.x, nd.y, nd.x, my], [nd.x, my, tg.x, my], [tg.x, my, tg.x, tg.y]);
          }
          break;
        }
      }
    }
  }
  return { nodes, lines };
}

function renderCard(canvas, card) {
  const ctx = canvas.getContext("2d");
  canvas.width = W;
  canvas.height = H;

  ctx.fillStyle = P.bg;
  ctx.fillRect(0, 0, W, H);

  const seed = hashString(card.id + card.title);
  const circuit = generateCircuit(seed);

  ctx.save();
  ctx.strokeStyle = P.trace;
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";
  for (const [x1, y1, x2, y2] of circuit.lines) {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  }
  for (const n of circuit.nodes) {
    ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fillStyle = P.node; ctx.fill();
    ctx.strokeStyle = P.nodeStroke; ctx.lineWidth = 0.8; ctx.stroke();
  }
  ctx.restore();

  ctx.fillStyle = P.accent;
  ctx.fillRect(0, 0, 4, H);

  const fontSize = 72;
  ctx.font = fontSize + "px Georgia, serif";
  const maxTW = 1020, lh = 86;
  const words = card.title.split(" ");
  const tLines = [];
  let cur = words[0] || "";
  for (let i = 1; i < words.length; i++) {
    const test = cur + " " + words[i];
    if (ctx.measureText(test).width > maxTW) { tLines.push(cur); cur = words[i]; }
    else cur = test;
  }
  tLines.push(cur);

  const tagH = 26, tagGap = 16, ruleGap = 18, ruleH = 4, blGap = 14, blSize = 27;
  const totalH = tagH + tagGap + tLines.length * lh + ruleGap + ruleH + blGap + blSize;
  const startY = (H - totalH) / 2;

  let maxLW = 0;
  for (const l of tLines) { const w = ctx.measureText(l).width; if (w > maxLW) maxLW = w; }
  const px = 52, py = 36;
  const bW = Math.max(maxLW, 300) + px * 2;
  const bX = (W - bW) / 2;
  ctx.fillStyle = "rgba(250,246,240,0.88)";
  ctx.fillRect(bX, startY - py, bW, totalH + py * 2);

  const tag = card.tag.toUpperCase();
  ctx.font = "500 12px sans-serif";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  const tW = ctx.measureText(tag).width + 24;
  const tX = (W - tW) / 2, tY = startY;
  ctx.strokeStyle = P.tagBorder; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(tX, tY, tW, tagH, 3); ctx.stroke();
  ctx.fillStyle = P.tagText;
  ctx.fillText(tag, W / 2, tY + tagH / 2 + 1);

  ctx.font = fontSize + "px Georgia, serif";
  ctx.fillStyle = P.fg; ctx.textBaseline = "top"; ctx.textAlign = "center";
  const titY = tY + tagH + tagGap;
  for (let i = 0; i < tLines.length; i++) ctx.fillText(tLines[i], W / 2, titY + i * lh);

  const rY = titY + tLines.length * lh + ruleGap;
  ctx.fillStyle = P.accent;
  ctx.fillRect((W - 64) / 2, rY, 64, ruleH);

  ctx.font = "700 " + blSize + "px sans-serif";
  ctx.fillStyle = P.accent; ctx.textAlign = "center"; ctx.textBaseline = "top";
  ctx.fillText(card.subtitle, W / 2, rY + ruleH + blGap);

  ctx.font = "500 15px sans-serif";
  ctx.fillStyle = P.muted; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
  ctx.fillText("kashifnazir.com", W / 2, H - 22);
}

const api = { W, H, P, mulberry32, hashString, generateCircuit, renderCard };

// Dual-target export: CommonJS for the Node CLI, a global for a browser
// <script> tag. The React generator imports the same functions via its own
// build, so the two renderers never diverge.
if (typeof module !== "undefined" && module.exports) {
  module.exports = api;
}
if (typeof globalThis !== "undefined") {
  globalThis.SocialCard = api;
}
