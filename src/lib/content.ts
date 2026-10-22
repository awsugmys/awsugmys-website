// Helpers for querying and formatting collection entries.
import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { SITE } from '../data/site';

export type Post = CollectionEntry<'blog'>;
export type Event = CollectionEntry<'events'>;

/* ---------- Blog ---------- */

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !(import.meta.env.PROD && data.draft));
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const postUrl = (post: Post) => `/blog/${post.id}/`;

export function readingTime(body = ''): number {
  const words = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]+>/g, '')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export const tagSlug = (tag: string) =>
  tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export async function getTags(): Promise<{ tag: string; slug: string; count: number }[]> {
  const counts = new Map<string, { tag: string; count: number }>();
  for (const post of await getPosts()) {
    for (const tag of post.data.tags) {
      const slug = tagSlug(tag);
      const entry = counts.get(slug) ?? { tag, count: 0 };
      entry.count++;
      counts.set(slug, entry);
    }
  }
  return [...counts.entries()]
    .map(([slug, v]) => ({ slug, ...v }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

const blogImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/blog/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

/** Resolves `featuredimage` to an optimisable asset, or undefined if absent. */
export function featuredImage(post: Post): ImageMetadata | undefined {
  const name = post.data.featuredimage?.split('/').pop();
  return name ? blogImages[`/src/assets/blog/${name}`]?.default : undefined;
}

export async function getLinks() {
  return (await getCollection('links')).sort((a, b) => a.data.order - b.data.order);
}

export const formatDate = (d: Date) =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: SITE.timezone,
  }).format(d);

/* ---------- Events ---------- */

const IST = '+05:30';

/** Today's date in IST as YYYY-MM-DD. Evaluated at build time. */
const todayIST = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: SITE.timezone }).format(new Date());

export const eventStart = (e: Event) =>
  new Date(`${e.data.date}T${e.data.startTime ?? '00:00'}:00${IST}`);

export const isUpcoming = (e: Event) => (e.data.endDate ?? e.data.date) >= todayIST();

export async function getEvents() {
  const all = await getCollection('events');
  const byDate = (a: Event, b: Event) => eventStart(a).valueOf() - eventStart(b).valueOf();
  return {
    upcoming: all.filter(isUpcoming).sort(byDate),
    past: all.filter((e) => !isUpcoming(e)).sort((a, b) => byDate(b, a)),
  };
}

const dayFmt = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: SITE.timezone,
});

const at = (date: string, time = '12:00') => new Date(`${date}T${time}:00${IST}`);

export function eventDateLabel(e: Event): string {
  const { date, endDate } = e.data;
  return endDate && endDate !== date
    ? dayFmt.formatRange(at(date), at(endDate))
    : dayFmt.format(at(date));
}

const to12h = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
};

export function eventTimeLabel(e: Event): string | undefined {
  const { startTime, endTime } = e.data;
  if (!startTime) return undefined;
  return `${to12h(startTime)}${endTime ? ` – ${to12h(endTime)}` : ''} IST`;
}

export function eventLocationLabel(e: Event): string {
  const { venue, format } = e.data;
  if (format === 'online') return 'Online';
  const place = venue ? `${venue.name}, ${venue.city}` : 'Venue to be announced';
  return format === 'hybrid' ? `${place} + online` : place;
}

const PLATFORMS: [RegExp, string][] = [
  [/meetup\.com/, 'Meetup'],
  [/builder\.aws\.com/, 'AWS Builder Center'],
  [/(^|\.)lu\.ma|luma\.com/, 'Luma'],
];

/** Human name of the platform hosting an event link, e.g. "Meetup". */
export function platformName(url: string): string {
  const host = new URL(url).hostname;
  return PLATFORMS.find(([re]) => re.test(host))?.[1] ?? host.replace(/^www\./, '');
}

/** Month/day parts for the calendar badge on event cards. */
export function eventBadge(e: Event) {
  const d = at(e.data.date);
  const part = (o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('en-GB', { ...o, timeZone: SITE.timezone }).format(d);
  return { month: part({ month: 'short' }), day: part({ day: 'numeric' }) };
}

export function eventSchema(e: Event) {
  const { data } = e;
  const tz = (date: string, time?: string) => (time ? `${date}T${time}:00${IST}` : date);
  const online = data.format !== 'in-person';
  const physical = data.venue && {
    '@type': 'Place',
    name: data.venue.name,
    address: {
      '@type': 'PostalAddress',
      addressLocality: data.venue.city,
      addressRegion: 'Karnataka',
      addressCountry: 'IN',
      ...(data.venue.address ? { streetAddress: data.venue.address } : {}),
    },
  };
  const virtual = online && {
    '@type': 'VirtualLocation',
    url: data.registrationUrl ?? `${SITE.url}/events/`,
  };
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: data.title,
    description: data.description,
    startDate: tz(data.date, data.startTime),
    ...(data.endDate || data.endTime
      ? { endDate: tz(data.endDate ?? data.date, data.endTime) }
      : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: {
      'in-person': 'https://schema.org/OfflineEventAttendanceMode',
      online: 'https://schema.org/OnlineEventAttendanceMode',
      hybrid: 'https://schema.org/MixedEventAttendanceMode',
    }[data.format],
    location: [physical, virtual].filter(Boolean),
    organizer: { '@id': `${SITE.url}/#organization` },
    ...(data.registrationUrl ? { url: data.registrationUrl } : {}),
    ...(data.speakers.length
      ? { performer: data.speakers.map((s) => ({ '@type': 'Person', name: s.name })) }
      : {}),
  };
}
