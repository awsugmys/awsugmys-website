// Removes the elephant illustration's white background. Background =
// near-white, low-chroma pixels connected to the image border; extra seed
// points flood enclosed gaps (inside the howdah, between legs) with a strict
// pure-white test so outlined jasmine petals survive. Edge pixels get a soft
// alpha and are un-premultiplied against white so no white fringe remains.
import sharp from 'sharp';

export async function matte(input, seeds = []) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const N = W * H;

  const minC = (i) => Math.min(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]);
  const chroma = (i) => Math.max(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]) - minC(i);
  const isBg = (i) => minC(i) >= 226 && chroma(i) <= 16;
  const isPure = (i) => minC(i) >= 238 && chroma(i) <= 10;

  const bg = new Uint8Array(N);
  const queue = new Int32Array(N);
  let head = 0;
  let tail = 0;
  let test = isBg;
  const push = (i) => {
    if (!bg[i] && test(i)) {
      bg[i] = 1;
      queue[tail++] = i;
    }
  };
  const flood = () => {
    while (head < tail) {
      const i = queue[head++];
      const x = i % W;
      if (x > 0) push(i - 1);
      if (x < W - 1) push(i + 1);
      if (i >= W) push(i - W);
      if (i < N - W) push(i + W);
    }
  };

  for (let x = 0; x < W; x++) {
    push(x);
    push((H - 1) * W + x);
  }
  for (let y = 0; y < H; y++) {
    push(y * W);
    push(y * W + W - 1);
  }
  flood();
  test = isPure;
  for (const [x, y] of seeds) push(y * W + x);
  flood();

  const out = Buffer.from(data);
  for (let i = 0; i < N; i++) {
    if (bg[i]) {
      out[i * 4 + 3] = 0;
      continue;
    }
    const x = i % W;
    let edge = false;
    for (const j of [i - 1, i + 1, i - W, i + W, i - W - 1, i - W + 1, i + W - 1, i + W + 1]) {
      if (j >= 0 && j < N && Math.abs((j % W) - x) <= 1 && bg[j]) {
        edge = true;
        break;
      }
    }
    if (!edge) continue;
    const a = Math.min(1, Math.max(0, (255 - minC(i)) / 70));
    if (a <= 0.02) {
      out[i * 4 + 3] = 0;
      continue;
    }
    for (let c = 0; c < 3; c++) {
      const v = data[i * 4 + c];
      out[i * 4 + c] = Math.max(0, Math.min(255, Math.round(255 - (255 - v) / a)));
    }
    out[i * 4 + 3] = Math.round(a * 255);
  }
  return { data: out, width: W, height: H };
}
