// Builds Latin-subset woff2 web fonts from the Amazon type library TTFs in
// fonts/ (git-ignored; the official "Amazon_Typefaces_Complete_Font_Set" package)
// into public/fonts/amazon-ember/, named as expected by src/lib/fonts.ts.
//   npm run assets:fonts
import subsetFont from 'subset-font';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const PKG = 'fonts/Amazon_Typefaces_Complete_Font_Set_Mar2020';
const OUT = 'public/fonts/amazon-ember';
const WANTED = [
  ['Ember/AmazonEmber_Rg.ttf', 'AmazonEmber_Rg'],
  ['Ember/AmazonEmber_RgIt.ttf', 'AmazonEmber_RgIt'],
  ['Ember/AmazonEmber_Bd.ttf', 'AmazonEmber_Bd'],
  ['Ember Display/AmazonEmberDisplay_Bd.ttf', 'AmazonEmberDisplay_Bd'],
];

// Basic Latin, Latin-1 Supplement and common punctuation/symbols (incl. ₹).
const CHARS = [
  [0x20, 0x7e],
  [0xa0, 0xff],
  [0x2010, 0x2027],
  [0x2030, 0x203a],
  [0x20b9, 0x20b9],
  [0x20ac, 0x20ac],
  [0x2122, 0x2122],
  [0x2190, 0x2193],
]
  .flatMap(([a, b]) => Array.from({ length: b - a + 1 }, (_, i) => String.fromCodePoint(a + i)))
  .join('');

if (!existsSync(PKG)) {
  console.error(`Put the Amazon type library package in ${PKG}/ first.`);
  process.exit(1);
}
await mkdir(OUT, { recursive: true });
for (const [file, name] of WANTED) {
  if (!existsSync(`${PKG}/${file}`)) {
    console.warn(`skip ${name} (${PKG}/${file} not found)`);
    continue;
  }
  const out = await subsetFont(await readFile(`${PKG}/${file}`), CHARS, { targetFormat: 'woff2' });
  await writeFile(`${OUT}/${name}.woff2`, out);
  console.log(`${OUT}/${name}.woff2  ${(out.length / 1024).toFixed(1)} KB`);
}
