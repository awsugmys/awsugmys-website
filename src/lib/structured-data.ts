// schema.org JSON-LD builders.
import { getLinks } from './content';
import { SITE } from '../data/site';

export async function organizationSchema() {
  const links = await getLinks();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    alternateName: SITE.handle,
    url: `${SITE.url}/`,
    logo: `${SITE.url}/icon-512.png`,
    email: SITE.email,
    description: SITE.description,
    areaServed: { '@type': 'City', name: 'Mysuru' },
    sameAs: links.map((l) => l.data.url),
  };
}
