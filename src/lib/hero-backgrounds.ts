// Palace backgrounds for the hero scene (day and night illustrations).
//
// The images are generated with a content hash in their file names
// (scripts/hero/build-hero-assets.mjs), so they are looked up by theme rather
// than imported by a fixed path. heroBackgrounds() produces responsive,
// theme-aware CSS (AVIF with WebP fallback at three widths, one set per theme,
// so only the active theme's image downloads) plus srcsets for a <head> preload.
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/hero/palace-*.webp', {
  eager: true,
});

const find = (theme: 'day' | 'night') => {
  const entry = Object.entries(files).find(([path]) => path.includes(`/palace-${theme}.`));
  if (!entry) throw new Error(`Missing palace-${theme} image; run npm run assets:hero`);
  return entry[1].default;
};

export const palaceDay = find('day');
export const palaceNight = find('night');

const WIDTHS = [960, 1600, 2400] as const;
type Width = (typeof WIDTHS)[number];
type Set = Record<Width, { avif: string; webp: string }>;

const variants = async (src: ImageMetadata): Promise<Set> =>
  Object.fromEntries(
    await Promise.all(
      WIDTHS.map(async (w) => {
        const [avif, webp] = await Promise.all([
          getImage({ src, width: w, format: 'avif', quality: 58 }),
          getImage({ src, width: w, format: 'webp', quality: 74 }),
        ]);
        return [w, { avif: avif.src, webp: webp.src }];
      }),
    ),
  ) as Set;

let cached: Promise<{ css: string; preload: { day: string; night: string } }> | undefined;

export function heroBackgrounds() {
  cached ??= (async () => {
    const day = await variants(palaceDay);
    const night = await variants(palaceNight);
    const rule = (sel: string, set: Set, w: Width) =>
      `${sel}{background-image:url(${set[w].webp});background-image:image-set(url(${set[w].avif}) type("image/avif"),url(${set[w].webp}) type("image/webp"))}`;
    const themed = (w: Width) =>
      [
        rule('.sv-palace', day, w),
        rule(':root[data-theme="dark"] .sv-palace', night, w),
        `@media (prefers-color-scheme:dark){${rule(':root:not([data-theme]) .sv-palace', night, w)}}`,
      ].join('');
    return {
      css: [
        themed(960),
        `@media (min-width:40rem){${themed(1600)}}`,
        `@media (min-width:100rem),(min-width:64rem) and (min-resolution:1.5dppx){${themed(2400)}}`,
      ].join(''),
      preload: {
        day: WIDTHS.map((w) => `${day[w].avif} ${w}w`).join(', '),
        night: WIDTHS.map((w) => `${night[w].avif} ${w}w`).join(', '),
      },
    };
  })();
  return cached;
}
