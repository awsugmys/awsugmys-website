// Traces the palace skyline from the palace illustrations: for each column,
// the topmost pixel that belongs to the palace rather than the sky. Used to
// (a) align the night image to the day image and (b) draw the footer/CTA
// silhouettes from the real artwork.
import sharp from 'sharp';

/**
 * Returns { width, height, top: Int16Array } where top[x] is the first palace
 * row in column x (or -1), searching rows above `maxY` only.
 */
export async function skyline(file, { night = false, maxY = 1250, scale = 0.5 } = {}) {
  const meta = await sharp(file).metadata();
  const width = Math.round(meta.width * scale);
  const { data, info } = await sharp(file)
    .resize(width)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;
  const limit = Math.round(maxY * scale);
  const px = (x, y) => {
    const i = (y * W + x) * 3;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const isPalace = (x, y) => {
    const [r, g, b] = px(x, y);
    if (night) return r + g > 300 && r > b + 40; // lit gold against a dark sky
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    const skyBlue = b > r + 12;
    const cloud = r > 215 && g > 215 && b > 215 && sat < 30;
    return !skyBlue && !cloud;
  };
  const top = new Int16Array(W).fill(-1);
  for (let x = 0; x < W; x++) {
    // require a short vertical run so stars, birds and noise are ignored
    for (let y = 0; y < limit - 6; y++) {
      if (isPalace(x, y) && isPalace(x, y + 3) && isPalace(x, y + 6)) {
        top[x] = y;
        break;
      }
    }
  }
  return { width: W, height: H, top, scale };
}

/** Left/right extent of the palace and its highest point (in source pixels). */
export function landmarks({ top, scale }, minRun = 12) {
  const W = top.length;
  const solid = (x) => top[x] >= 0;
  let left = 0;
  while (left < W && !(solid(left) && [...Array(minRun)].every((_, k) => solid(left + k)))) left++;
  let right = W - 1;
  while (right > 0 && !(solid(right) && [...Array(minRun)].every((_, k) => solid(right - k))))
    right--;
  let peak = Infinity;
  let peakX = 0;
  for (let x = left; x <= right; x++) {
    if (top[x] >= 0 && top[x] < peak) {
      peak = top[x];
      peakX = x;
    }
  }
  return { left: left / scale, right: right / scale, peak: peak / scale, peakX: peakX / scale };
}
