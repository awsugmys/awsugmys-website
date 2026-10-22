// Renders public/og-image.png (1200x630) from the built home page hero in the
// dark theme (the night palace with the elephant), with the logo. The image carries
// its own background, so it reads well on light and dark social feeds alike.
// Usage: npm run build && npm run preview (another terminal), then
//   npm run assets:social-image
import { chromium } from 'playwright';
import sharp from 'sharp';

const base = process.argv[2] ?? 'http://localhost:4321';
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
  colorScheme: 'dark',
  reducedMotion: 'reduce',
});
await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
await page.goto(base + '/', { waitUntil: 'networkidle' });

await page.addStyleTag({
  content: `
    .site-header, main > :not(.hero), footer, .hero__ctas, .hero__lede { display: none !important; }
    .hero { height: 630px !important; min-height: 0 !important; border: 0 !important; }
    .hero__content { padding-top: 34px !important; }
    .hero h1 { font-size: 46px !important; }
    .hero__lede { font-size: 17px !important; }
    .og-logo { display: block; width: 150px; margin-bottom: 14px; }
  `,
});
// Reuse the dark wordmark already on the page, above the eyebrow.
await page.evaluate(() => {
  const src = document.querySelector('.logo__img--dark')?.getAttribute('src');
  if (!src) return;
  const img = Object.assign(document.createElement('img'), { src, className: 'og-logo', alt: '' });
  document.querySelector('.hero__copy')?.prepend(img);
});
await page.waitForTimeout(500);
const shot = await page.screenshot({ clip: { x: 0, y: 0, width: 1200, height: 630 } });
await sharp(shot)
  .png({ palette: true, quality: 90, compressionLevel: 9 })
  .toFile('public/og-image.png');
await browser.close();
console.log('public/og-image.png written');
