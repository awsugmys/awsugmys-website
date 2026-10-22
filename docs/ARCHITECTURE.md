# Architecture

How the AWS User Group Mysuru website is put together. For everyday content edits you don't need
any of this; see the [README](../README.md).

## Stack

- **Astro 7** (pinned to 7.4.1 for Node 22.22 compatibility) in static mode:
  `output: 'static'`, `build.format: 'directory'` and `trailingSlash: 'always'`, so every page is
  `/<path>/index.html`. Stylesheets are inlined (`inlineStylesheets: 'always'`).
- TypeScript (strict), plain CSS with custom properties (no CSS framework), `@astrojs/mdx`,
  `@astrojs/sitemap`, `@astrojs/rss`, and `astro:assets` + sharp for images.
- No runtime dependencies, third-party requests or analytics. The only client-side JavaScript is
  the theme toggle, the mobile menu and pausing the hero animation when it's off-screen.

## Pages and content

- `src/pages/` maps one file to one URL. Blog listing (`blog/[...page].astro`, 10 per page), posts
  (`blog/[slug].astro`) and tags (`tags/`) are generated from the blog collection; `rss.xml.ts`
  builds the feed and `palace-silhouette.svg.ts` serves a cached SVG mask.
- `src/content.config.ts` defines five collections, validated with Zod at build time:
  `blog` (Markdown/MDX), `events`, `team`, `studentGroups` (JSON per entry) and `links` (one JSON
  file). A typo in a content file fails the build with a clear message.
- `src/lib/content.ts` holds the queries and formatting: IST dates, the upcoming/past split
  (computed at build time), reading time, tags, platform names for registration links and
  schema.org Event data. `src/lib/structured-data.ts` builds the Organization JSON-LD.
- New collections are discovered when the dev server starts: restart `npm run dev` after adding
  one.

## Theming

- All design tokens live in `src/styles/tokens.css`. Colours are `light-dark(light, dark)`.
- An inline script in `BaseLayout` sets `data-theme` on `<html>` before first paint (no flash of
  the wrong theme). It uses the visitor's saved choice (`localStorage.theme`) or the OS setting.
- `--night` (0 or 1) drives non-colour switches through `opacity`/`calc()` (logo swap, toggle
  icon). `.night-only` / `.day-only` hide elements per theme.

## Fonts

Only Amazon's typefaces are used: **Amazon Ember** for text and UI (`--font-sans`) and **Amazon
Ember Display** for headings (`--font-display`), with Arial as the fallback (as on amazon.com).

- `npm run assets:fonts` subsets the TTFs from the Amazon type library package in `fonts/`
  (not in git) to Latin `.woff2` files in `public/fonts/amazon-ember/` (committed).
- `src/lib/fonts.ts` writes the `@font-face` rules and preloads at build time for whichever files
  exist, so the site still builds (with Arial) if they're missing.
- Avoid emoji and non-Latin scripts in the UI; use the inline SVG icons in
  `src/components/ui/Icon.astro`.

## The hero scene

The home page hero (`src/components/hero/`) shows the Mysore Palace illustration with a
ceremonial elephant walking past.

**Layout.** Full-screen on desktop, with the copy over the open sky at top left. On smaller
screens the copy comes first on the image's sky colour, followed by a 4:3 or 16:9 scene. Layout
knobs per breakpoint are CSS variables in `Hero.astro`: `--el-height`, `--el-cross` (crossing
time), `--el-rest` (resting position for reduced motion), `--palace-size`, `--palace-blur` and
`--road-h` (height of the procession path).

**Artwork pipeline.** `npm run assets:hero` (`scripts/hero/build-hero-assets.mjs`) turns the
illustrations in `reference/` (not in git) into the committed files in `src/assets/hero/`:

- `palace-day.<hash>.webp` / `palace-night.<hash>.webp`: cropped to remove the generator
  watermark. The night image is rescaled (`NIGHT_FIT`) so its palace lines up with the day one;
  `npm run check:hero-alignment` should report about 0px. File names carry a content hash so a
  regenerated image always gets a new URL (the dev server would otherwise serve a stale copy).
  `src/lib/hero-backgrounds.ts` serves them as theme-specific CSS backgrounds (AVIF + WebP at 960,
  1600 and 2400px), so only the active theme's image downloads; the home page preloads it.
- `palace-outline.json`: the palace skyline traced from the day image. It's used for the footer
  skyline and, through `/palace-silhouette.svg`, the blog card art and the call-to-action panel.
- `elephant/`: the elephant with its background removed (`lib/remove-background.mjs`), then
  sliced into `base.png` plus the parts that move (four legs, trunk, tail, umbrella), with
  `manifest.json` giving each part's position and pivot. Parts sit exactly where they were cut
  from, so the still frame matches the source art; the base has hard-edged holes and each part is
  slightly larger, extending 40px above its cut line, so movement never shows a gap.

**Animation** (`HeroScene.astro`). The artwork faces left and is mirrored to walk left to right.
The walk cycle is a 1.9s stride with diagonal leg pairs, body bob, and trunk, tail and umbrella
sway. Each leg has its own gait (`GAIT`: swing angle plus a backward slide while planted) so
planted feet stay fixed while the body travels; check with `npm run check:hero-gait` after
changing the elephant's size or `--el-cross`. At night the elephant is dimmed to sit in the
palace light, and a small lamp glows inside the howdah (`.el-lamp`, positioned from
`manifest.lamp`). Ambient touches: birds by day, stars and a palace-light glow at night.

**Performance and accessibility.** Animations use only `transform` and `opacity`, pause when the
hero is off-screen or the tab is hidden (`.savari.is-paused`), and `prefers-reduced-motion` shows
the still frame.

**Respect.** Goddess Chamundeshwari rides in the howdah; never use the deity in a joke context.
The 404 page shows the palace without the elephant ("the elephant has wandered off").

## Quality bar

- Lighthouse (mobile) 95+ in every category; the home page stays well under 200 KB transferred,
  excluding images.
- WCAG AA contrast in both themes, visible focus states, a skip link, one `h1` per page, logical
  heading order, and `aria-hidden` on decorative graphics.
- `npm run check` must pass before merging. For visual changes, run `npm run screenshots` and
  check both themes at 390px and 1440px.
