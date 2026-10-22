// Day/night palace alignment check. Cross-correlates the facade's horizontal
// structure (cornices, window rows, arch tops) between the two hero images and
// prints the vertical offset of the night features (source px; 0 = aligned).
// Re-run after changing NIGHT_FIT in scripts/hero/build-hero-assets.mjs:
//   npm run check:hero-alignment
import sharp from 'sharp';
import { readdirSync } from 'node:fs';

const find = (t) =>
  'src/assets/hero/' + readdirSync('src/assets/hero').find((f) => f.startsWith(`palace-${t}.`));
const DAY = find('day');
const NIGHT = find('night');
const rows = async (f, x0, x1, y0, y1) => {
  const { data, info } = await sharp(f).greyscale().raw().toBuffer({ resolveWithObject: true });
  const W = info.width;
  const o = [];
  for (let y = y0; y < y1; y++) {
    let s = 0;
    for (let x = x0; x < x1; x++) s += Math.abs(data[(y + 1) * W + x] - data[y * W + x]);
    o.push(s / (x1 - x0));
  }
  return o;
};
const norm = (a) => {
  const m = a.reduce((p, q) => p + q, 0) / a.length;
  const s = Math.sqrt(a.reduce((p, q) => p + (q - m) ** 2, 0) / a.length) || 1;
  return a.map((v) => (v - m) / s);
};
const off = async (x0, x1, y0, y1) => {
  const D = norm(await rows(DAY, x0, x1, y0, y1));
  const N = norm(await rows(NIGHT, x0, x1, y0, y1));
  let b = [0, -1e9];
  for (let k = -60; k <= 60; k++) {
    let c = 0,
      n = 0;
    for (let i = 0; i < D.length; i++) {
      const j = i + k;
      if (j >= 0 && j < N.length) {
        c += D[i] * N[j];
        n++;
      }
    }
    c /= n;
    if (c > b[1]) b = [k, c];
  }
  return b;
};
for (const [l, a] of [
  ['facade', [700, 2050, 500, 1300]],
  ['upper', [700, 2050, 500, 900]],
  ['lower', [700, 2050, 900, 1300]],
  ['L towers', [170, 560, 500, 1300]],
  ['R towers', [2190, 2580, 500, 1300]],
]) {
  const [k, c] = await off(...a);
  console.log(l.padEnd(9), (k > 0 ? '+' : '') + k, 'corr', c.toFixed(2));
}
