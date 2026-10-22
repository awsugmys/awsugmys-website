// Captures pages in light and dark at phone and desktop widths.
// Usage: npm run preview (in another terminal), then
//   npm run screenshots -- [baseUrl] [path ...]
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const [base = 'http://localhost:4321', ...paths] = process.argv.slice(2);
const targets = paths.length ? paths : ['/'];
const OUT = 'screenshots';
const WIDTHS = [390, 1440];
const THEMES = ['light', 'dark'];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();

for (const theme of THEMES) {
  for (const width of WIDTHS) {
    const page = await browser.newPage({
      viewport: { width, height: width < 600 ? 844 : 900 },
      deviceScaleFactor: 1,
      colorScheme: theme,
    });
    await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
    for (const path of targets) {
      await page.goto(base + path, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);
      const name =
        (path.replace(/\/$/, '').replace(/^\//, '').replace(/\//g, '_') || 'home') +
        `-${theme}-${width}`;
      await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: process.env.FULL !== '0' });
      console.log(`${OUT}/${name}.png`);
    }
    await page.close();
  }
}
await browser.close();
