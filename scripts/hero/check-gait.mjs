// Foot-tracking check for the hero walk cycle. Freezes the animations across one
// stride and prints where each foot meets the ground. A planted foot (first or
// second half of the stride, per diagonal pair) should keep the same x value;
// if it drifts, tune GAIT in src/components/hero/HeroScene.astro.
//   npm run build && npm run preview, then: npm run check:hero-gait
import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
await p.addInitScript(() => localStorage.setItem('theme', 'light'));
await p.goto((process.argv[2] ?? 'http://localhost:4321') + '/', { waitUntil: 'networkidle' });
const rows = [];
for (let t = 0; t <= 1900; t += 237.5) {
  await p.evaluate((t) => {
    for (const a of document.getAnimations()) {
      a.pause();
      const walk = a.animationName === 'sv-walk';
      a.currentTime = walk ? 0.55 * 75000 + t : t;
    }
  }, t);
  await p.waitForTimeout(60);
  rows.push(
    await p.evaluate(() => {
      const el = document.querySelector('.elephant');
      const E = el.getBoundingClientRect();
      return [...document.querySelectorAll('.el-leg')].map((leg) => {
        const w = leg.offsetWidth,
          h = leg.offsetHeight;
        const cs = getComputedStyle(leg);
        const [ox, oy] = cs.transformOrigin.split(' ').map(parseFloat);
        const m = new DOMMatrix(cs.transform === 'none' ? undefined : cs.transform);
        // foot = bottom-centre of the leg box, transformed about its origin
        const fx = w / 2 - ox,
          fy = h - oy;
        const x = m.a * fx + m.c * fy + m.e + ox + leg.offsetLeft;
        const y = m.b * fx + m.d * fy + m.f + oy + leg.offsetTop;
        return [Math.round(E.left + (E.width - x)), Math.round(E.top + y)]; // mirrored
      });
    }),
  );
}
const names = ['farFront(a)', 'nearFront(b)', 'farBack(b)', 'nearBack(a)'];
names.forEach((n, i) =>
  console.log(n.padEnd(13), rows.map((r) => `${r[i][0]}@${r[i][1]}`).join(' ')),
);
await b.close();
