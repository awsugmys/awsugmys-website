import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, postUrl } from '../lib/content';
import { SITE } from '../data/site';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  const site = context.site ?? new URL(SITE.url);
  const feedUrl = new URL('rss.xml', site).href;
  return rss({
    title: `${SITE.name} — Blog`,
    description: SITE.description,
    site,
    // Declare the Atom namespace so the self link below validates.
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: postUrl(post),
      categories: post.data.tags,
    })),
    // <atom:link rel="self"> is required by the W3C Feed Validator and used by
    // many readers; <language> advertises the feed locale.
    customData: `<language>en-in</language><atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>`,
  });
}
