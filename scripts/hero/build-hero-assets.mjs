// Builds the hero artwork from the illustrations in reference/:
//   - palace-day / palace-night: cropped to remove the generator watermark; the
//     night image is rescaled so its palace lines up with the day one
//   - palace-outline.json: the palace skyline traced from the day image, for
//     the footer and call-to-action silhouettes
//   - elephant: background removed, then sliced into a base plus moving parts
//     (four legs, lower trunk, tail, umbrella) with a manifest of positions and
//     pivots for the CSS walk cycle.
// Every part is cut from the original pixels and placed back at its original
// position, so the still frame is identical to the source illustration.
//   npm run assets:hero   (needs reference/elephant.png, palace-day.png and palace-night.png)
import sharp from 'sharp';
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { matte } from './lib/remove-background.mjs';
import { skyline } from './lib/trace-skyline.mjs';

const REF = 'reference';
const OUT = 'src/assets/hero';
const ELEPHANT_SRC = `${REF}/elephant.png`;
const SCALE = 0.55; // output size relative to the 2048px source
const OVERLAP = 40; // px of extra leg/trunk/tail above each cut line (hidden under the base)

await mkdir(`${OUT}/elephant`, { recursive: true });

/* ---------- Palace backgrounds ---------- */
// The two illustrations frame the palace slightly differently. sx comes from
// the end-tower extents; sy/dy from cross-correlating the facade's cornices,
// window rows and arch tops (npm run check:hero-alignment reports ~0px),
// so switching themes doesn't make the palace jump. The bottom strip (with
// the watermark) is then cropped.
const PALACE_W = 2752;
const CROP_H = 1360;
const NIGHT_FIT = { sx: 1.013, sy: 0.9925, dy: 106 };

// Files are named palace-<theme>.<content hash>.webp so every regeneration gets
// a new URL (the dev server's image URLs don't change with file contents, so
// browsers would otherwise keep showing a stale image).
for (const f of await readdir(OUT))
  if (/^palace-(day|night)(\.[0-9a-f]+)?\.webp$/.test(f)) await rm(`${OUT}/${f}`);
const writeHashed = async (buf, theme) => {
  const hash = createHash('sha256').update(buf).digest('hex').slice(0, 8);
  await writeFile(`${OUT}/palace-${theme}.${hash}.webp`, buf);
};

await writeHashed(
  await sharp(`${REF}/palace-day.png`)
    .extract({ left: 0, top: 0, width: PALACE_W, height: CROP_H })
    .webp({ quality: 90 })
    .toBuffer(),
  'day',
);

{
  const w = Math.round(PALACE_W * NIGHT_FIT.sx);
  const h = Math.round(1536 * NIGHT_FIT.sy);
  const scaled = await sharp(`${REF}/palace-night.png`).resize(w, h, { fit: 'fill' }).toBuffer();
  // Separate pipelines: sharp runs an extract chained after extend *before* it.
  const raised = await sharp(scaled)
    .extend({ top: NIGHT_FIT.dy, extendWith: 'copy' }) // continue the plain night sky upwards
    .toBuffer();
  await writeHashed(
    await sharp(raised)
      .extract({ left: Math.round((w - PALACE_W) / 2), top: 0, width: PALACE_W, height: CROP_H })
      .webp({ quality: 90 })
      .toBuffer(),
    'night',
  );
}

/* ---------- Palace outline (from the day illustration) ---------- */
{
  const TRACE_SCALE = 0.5;
  const LEFT = 149; // outer edges of the end towers (source px); lamp posts beyond are ignored
  const RIGHT = 2603;
  const BASE = 1300; // where the silhouette meets the ground
  const { top } = await skyline(`${REF}/palace-day.png`, { scale: TRACE_SCALE });
  const pts = [];
  for (let x = Math.round(LEFT * TRACE_SCALE); x <= Math.round(RIGHT * TRACE_SCALE); x++) {
    const y = top[x] >= 0 ? top[x] : BASE * TRACE_SCALE;
    pts.push([x, y]);
  }
  // Ramer–Douglas–Peucker simplification keeps domes and finials crisp.
  const rdp = (p, eps) => {
    if (p.length < 3) return p;
    const [ax, ay] = p[0];
    const [bx, by] = p[p.length - 1];
    const len = Math.hypot(bx - ax, by - ay) || 1;
    let max = 0;
    let idx = 0;
    for (let i = 1; i < p.length - 1; i++) {
      const d = Math.abs((by - ay) * p[i][0] - (bx - ax) * p[i][1] + bx * ay - by * ax) / len;
      if (d > max) {
        max = d;
        idx = i;
      }
    }
    return max > eps
      ? [...rdp(p.slice(0, idx + 1), eps).slice(0, -1), ...rdp(p.slice(idx), eps)]
      : [p[0], p[p.length - 1]];
  };
  const simple = rdp(pts, 0.9);
  const x0 = simple[0][0];
  const y0 = Math.min(...simple.map(([, y]) => y));
  const base = BASE * TRACE_SCALE - y0;
  const width = simple[simple.length - 1][0] - x0;
  const d =
    `M0 ${base}` + simple.map(([x, y]) => `L${x - x0} ${y - y0}`).join('') + `L${width} ${base}Z`;
  await writeFile(
    `${OUT}/palace-outline.json`,
    JSON.stringify({ width, height: base, d }, null, 2) + '\n',
  );
  console.log(`palace outline: ${simple.length} points, ${width}×${base}`);
}

/* ---------- Elephant ---------- */
// Enclosed background gaps the border flood can't reach.
const SEEDS = [
  [1150, 780],
  [1200, 800],
  [1395, 800],
  [1265, 760],
  [1782, 1560],
  [920, 1830],
  [1335, 430],
];

// Source-pixel polygons. The first two points of each are the cut line (the
// pivot edge); `group` sets which diagonal pair a leg swings with.
const PARTS = [
  {
    name: 'leg-far-front',
    group: 'a',
    pivot: [892, 1520],
    poly: [
      [847, 1520],
      [938, 1520],
      [938, 1700],
      [930, 1725],
      [916, 1780],
      [906, 1840],
      [896, 1880],
      [896, 1902],
      [752, 1902],
      [752, 1835],
      [790, 1800],
      [820, 1745],
      [847, 1700],
    ],
  },
  {
    name: 'leg-near-front',
    group: 'b',
    pivot: [1010, 1560],
    poly: [
      [940, 1560],
      [995, 1560],
      [995, 1754],
      [1086, 1754],
      [1086, 1928],
      [897, 1928],
      [897, 1880],
      [906, 1840],
      [916, 1780],
      [930, 1725],
      [940, 1700],
    ],
  },
  {
    name: 'leg-far-back',
    group: 'b',
    pivot: [1590, 1766],
    poly: [
      [1530, 1766],
      [1645, 1766],
      [1640, 1782],
      [1600, 1840],
      [1595, 1870],
      [1595, 1882],
      [1530, 1882],
    ],
  },
  {
    name: 'leg-near-back',
    group: 'a',
    pivot: [1745, 1640],
    poly: [
      [1712, 1640],
      [1778, 1640],
      [1778, 1752],
      [1803, 1756],
      [1803, 1938],
      [1590, 1938],
      [1595, 1870],
      [1600, 1840],
      [1640, 1782],
      [1712, 1772],
    ],
  },
  {
    name: 'trunk',
    pivot: [622, 1660],
    poly: [
      [570, 1660],
      [674, 1660],
      [680, 1760],
      [702, 1880],
      [702, 1910],
      [630, 1910],
      [598, 1840],
      [570, 1740],
    ],
  },
  {
    name: 'tail',
    pivot: [1797, 1480],
    poly: [
      [1782, 1480],
      [1812, 1480],
      [1812, 1754],
      [1782, 1754],
    ],
  },
  {
    name: 'umbrella',
    pivot: [1349, 505],
    overlap: 0,
    poly: [
      [1118, 115],
      [1582, 115],
      [1582, 380],
      [1357, 380],
      [1357, 505],
      [1342, 505],
      [1342, 338],
      [1268, 338],
      [1268, 380],
      [1118, 380],
    ],
  },
];

const { data: cut, width: W, height: H } = await matte(ELEPHANT_SRC, SEEDS);

// Rasterise a polygon to a 0/255 mask. `grow` thickens it with a stroke.
const mask = async (poly, grow = 0) => {
  const pts = poly.map(([x, y]) => `${x},${y}`).join(' ');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" shape-rendering="crispEdges"><polygon points="${pts}" fill="#fff" stroke="#fff" stroke-width="${grow * 2}" stroke-linejoin="round"/></svg>`;
  const { data } = await sharp(Buffer.from(svg))
    .extractChannel(0)
    .raw()
    .toBuffer({ resolveWithObject: true });
  return data;
};

const base = Buffer.from(cut);
const manifest = { parts: [] };
const parts = [];

for (const part of PARTS) {
  const overlap = part.overlap ?? OVERLAP;
  // The hole in the base is the exact polygon; the part is the polygon raised
  // by `overlap` at its cut line and grown by 2px so it tucks under the base.
  const hole = await mask(part.poly);
  const raised = part.poly.map(([x, y], i) => (i < 2 ? [x, y - overlap] : [x, y]));
  const keep = await mask(raised, 2);

  const piece = Buffer.alloc(W * H * 4);
  let minX = W,
    minY = H,
    maxX = 0,
    maxY = 0;
  for (let i = 0; i < W * H; i++) {
    if (keep[i] && cut[i * 4 + 3]) {
      piece[i * 4] = cut[i * 4];
      piece[i * 4 + 1] = cut[i * 4 + 1];
      piece[i * 4 + 2] = cut[i * 4 + 2];
      piece[i * 4 + 3] = cut[i * 4 + 3];
      const x = i % W;
      const y = (i / W) | 0;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    if (hole[i]) base[i * 4 + 3] = 0;
  }
  parts.push({ ...part, piece, box: [minX, minY, maxX + 1, maxY + 1] });
}

// Crop everything to the elephant's bounding box.
let bx0 = W,
  by0 = H,
  bx1 = 0,
  by1 = 0;
for (let i = 0; i < W * H; i++) {
  if (cut[i * 4 + 3] > 8) {
    const x = i % W;
    const y = (i / W) | 0;
    if (x < bx0) bx0 = x;
    if (x > bx1) bx1 = x;
    if (y < by0) by0 = y;
    if (y > by1) by1 = y;
  }
}
const pad = 24;
bx0 = Math.max(0, bx0 - pad);
by0 = Math.max(0, by0 - pad);
bx1 = Math.min(W, bx1 + pad);
by1 = Math.min(H, by1 + pad);
const cw = bx1 - bx0;
const ch = by1 - by0;

const save = async (buf, [x0, y0, x1, y1], file) => {
  const w = Math.round((x1 - x0) * SCALE);
  const h = Math.round((y1 - y0) * SCALE);
  await sharp(buf, { raw: { width: W, height: H, channels: 4 } })
    .extract({ left: x0, top: y0, width: x1 - x0, height: y1 - y0 })
    .resize(w, h)
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/elephant/${file}.png`);
};

await save(base, [bx0, by0, bx1, by1], 'base');
const pct = (v, total) => Math.round((v / total) * 100000) / 1000;
for (const p of parts) {
  const [x0, y0, x1, y1] = p.box;
  await save(p.piece, p.box, p.name);
  manifest.parts.push({
    name: p.name,
    group: p.group ?? null,
    // position and size as % of the elephant canvas
    left: pct(x0 - bx0, cw),
    top: pct(y0 - by0, ch),
    width: pct(x1 - x0, cw),
    height: pct(y1 - y0, ch),
    // pivot as % of the part's own box
    originX: pct(p.pivot[0] - x0, x1 - x0),
    originY: pct(p.pivot[1] - y0, y1 - y0),
  });
}
manifest.aspect = Math.round((cw / ch) * 10000) / 10000;
// Where the night-time lamp glows: inside the howdah, just in front of the deity.
const LAMP = [1295, 745];
manifest.lamp = { x: pct(LAMP[0] - bx0, cw), y: pct(LAMP[1] - by0, ch) };
// Where the feet touch the ground (lowest leg pixel), as % of canvas height.
manifest.groundY = pct(Math.max(...parts.filter((p) => p.group).map((p) => p.box[3])) - by0, ch);
await writeFile(`${OUT}/elephant/manifest.json`, JSON.stringify(manifest, null, 2) + '\n');
console.log(
  `elephant canvas ${Math.round(cw * SCALE)}×${Math.round(ch * SCALE)}, ${parts.length} parts`,
);
