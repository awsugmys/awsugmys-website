// Tests for the CloudFront viewer-request function, plus a check that every
// page in the built sitemap maps to a file in dist/.
//   npm run check:cdn-routing   (run npm run build first for the sitemap check)
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const source = readFileSync(here('./viewer-request.js.tftpl'), 'utf8').replaceAll(
  '${apex_domain}',
  'awsugmys.in',
);
const handler = new Function(`${source}\nreturn handler;`)();
const request = (uri, host = 'awsugmys.in', querystring = {}) => ({
  request: { uri, headers: { host: { value: host } }, querystring },
});
const result = (r) => (r.statusCode ? `${r.statusCode} ${r.headers.location.value}` : `uri ${r.uri}`);

const cases = [
  ['/', 'awsugmys.in', {}, 'uri /index.html'],
  ['/about/', 'awsugmys.in', {}, 'uri /about/index.html'],
  ['/events', 'awsugmys.in', {}, '301 /events/'],
  ['/events', 'awsugmys.in', { utm_source: { value: 'li' } }, '301 /events/?utm_source=li'],
  ['/_astro/logo.abc.webp', 'awsugmys.in', {}, 'uri /_astro/logo.abc.webp'],
  ['/rss.xml', 'awsugmys.in', {}, 'uri /rss.xml'],
  ['/about/', 'www.awsugmys.in', {}, '301 https://awsugmys.in/about/'],
  [
    '/',
    'www.awsugmys.in',
    { a: { value: '1', multiValue: [{ value: '1' }, { value: '2' }] } },
    '301 https://awsugmys.in/?a=1&a=2',
  ],
];

let failures = 0;
for (const [uri, host, qs, want] of cases) {
  const got = result(handler(request(uri, host, qs)));
  if (got !== want) {
    failures++;
    console.log(`FAIL ${host}${uri} -> ${got} (expected ${want})`);
  }
}
console.log(`function: ${cases.length - failures}/${cases.length} cases passed`);

const sitemap = here('../../dist/sitemap-0.xml');
if (existsSync(sitemap)) {
  const urls = [...readFileSync(sitemap, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  let missing = 0;
  for (const url of urls) {
    const r = handler(request(new URL(url).pathname));
    const key = r.uri ?? '';
    if (!existsSync(here(`../../dist${key}`))) {
      missing++;
      console.log(`MISSING ${url} -> dist${key}`);
    }
  }
  console.log(`sitemap: ${urls.length - missing}/${urls.length} pages resolve to a file in dist/`);
  failures += missing;
} else {
  console.log('sitemap: skipped (run npm run build first)');
}

process.exit(failures ? 1 : 0);
