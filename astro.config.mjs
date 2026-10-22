// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://awsugmys.in',
  output: 'static',
  // Directory output + trailing slashes map 1:1 onto S3 keys (`/about/index.html`).
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'always',
  },
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes('/404') })],
  devToolbar: { enabled: false },
});
