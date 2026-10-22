# AWS User Group Mysuru — website

The community website for **AWS User Group Mysuru** ([awsugmys.in](https://awsugmys.in)): meetups,
workshops, blog, student builder groups and how to get involved. The home page shows the Mysore
Palace (day or night, following your theme) with a ceremonial Dasara elephant walking past.

It's a fully static site built with [Astro](https://astro.build): plain HTML/CSS with a few tiny
scripts, no server, no database and no trackers. `npm run build` produces a self-contained
`dist/` folder.

## Quick start

Requires **Node.js 22.22+** (see `.nvmrc`).

```bash
npm ci            # install the exact dependency versions from package-lock.json
npm run dev       # http://localhost:4321, reloads as you edit
npm run build     # type-check + production build into dist/
npm run preview   # serve dist/ locally
npm run check     # type-check, lint and formatting check (run before opening a PR)
```

Most changes are content edits: see [Editing content](#editing-content) below.

### Setting up on another machine

Clone the repository (or copy the folder **without** `node_modules/`, `dist/` and `.astro/`),
then run `npm ci`. `node_modules/` contains platform-specific binaries (sharp, esbuild, Rollup),
so a copy from another computer can fail; `npm ci` installs the right ones. The build is
reproducible: a fresh clone produces a byte-identical `dist/`.

Only needed for some scripts: `npx playwright install chromium` (screenshots, social image,
gait check), and the git-ignored `fonts/` and `reference/` folders (regenerating fonts and hero
artwork).

## Project map

```
.
├── src/
│   ├── pages/              One file per URL (index, about, events, blog, student-builders, …)
│   ├── content/            Site content, edited via pull requests
│   │   ├── blog/             Blog posts (Markdown)
│   │   ├── events/           Meetups and workshops (one JSON file per event)
│   │   ├── team/             Organising team (one JSON file per person)
│   │   ├── student-groups/   AWS Student Builder Groups (one JSON file per group)
│   │   └── links/            Community links (Meetup, Luma, LinkedIn, …)
│   ├── content.config.ts   Schemas that validate the content above
│   ├── components/
│   │   ├── layout/           Header, footer, logo, theme toggle, footer skyline
│   │   ├── hero/             Home page hero and the animated palace scene
│   │   ├── cards/            Event, blog post and team cards
│   │   ├── ui/               Icons, sections, pagination, call-to-action panel
│   │   └── seo/              Meta tags and structured data
│   ├── layouts/            Page shells (BaseLayout, PostLayout)
│   ├── lib/                Helpers: content queries, fonts, hero backgrounds, structured data
│   ├── data/site.ts        Site name, email, URLs and navigation
│   ├── styles/             Design tokens (tokens.css) and global styles
│   └── assets/             Images processed at build time (logos, hero artwork, blog images)
├── public/                 Files served as-is (favicons, fonts, social image, robots.txt)
├── logos/                  Official AWS UG Mysuru logo files (source of truth; don't edit)
├── scripts/                Asset generation and checks (see "Regenerating assets")
│   ├── brand/                Logos/favicons, web fonts, social preview image
│   ├── hero/                 Hero artwork pipeline and its checks
│   └── take-screenshots.mjs
├── docs/                   Architecture, deployment and branding guides
├── infrastructure/         Terraform for AWS hosting (S3, CloudFront, certificate, DNS, deploy role)
└── .github/workflows/      CI for pull requests; deploy on merge to main
```

## Editing content

### Add a blog post

Create `src/content/blog/YYYY-MM-DD-your-post-title.md`. The filename becomes the URL
(`/blog/YYYY-MM-DD-your-post-title/`).

```markdown
---
title: Your Post Title
date: 2026-11-20T10:00:00.000Z
description: One or two sentences shown on cards and in search results.
featuredpost: false
featuredimage: my-photo.jpg # optional — put the file in src/assets/blog/
tags:
  - aws
  - community
---

Your post in Markdown. `.mdx` works too.
```

- Don't repeat the title as a `#` heading; the page already shows it.
- Add `draft: true` to keep a post out of production builds.
- Without a `featuredimage`, cards show a palace skyline illustration.

### Add an event

Create `src/content/events/YYYY-MM-DD-short-name.json`:

```json
{
  "title": "AWS User Group Mysuru Meetup #5",
  "date": "2026-11-29",
  "startTime": "10:00",
  "endTime": "13:00",
  "format": "in-person",
  "venue": { "name": "Venue name", "city": "Mysuru", "address": "Optional street address" },
  "speakers": [
    { "name": "Speaker Name", "title": "Optional title", "url": "https://linkedin.com/in/..." }
  ],
  "description": "What the session is about.",
  "registrationUrl": "https://www.meetup.com/awsugmys/events/...",
  "slidesUrl": "https://... (optional, add after the event)",
  "recordingUrl": "https://youtube.com/... (optional)",
  "materialsUrl": "https://github.com/... (optional: workshop code/labs)",
  "alternateUrl": "https://... (optional: second listing, e.g. on another platform)",
  "blogPost": "2026-11-29-meetup-5-recap (optional: id of a related blog post)"
}
```

- Times are 24-hour **IST**. `format` is `in-person`, `online` or `hybrid` (omit `venue` for online).
- Multi-day events: add `"endDate": "YYYY-MM-DD"`. Informal gatherings can carry a `"note"`.
- The registration button names the platform automatically (Meetup, AWS Builder Center, Luma).
- Events are split into _Upcoming_ and _Past_ **at build time**, so the site needs a rebuild after
  an event to move it to _Past_.

### Edit team members

One JSON file per person in `src/content/team/`:

```json
{
  "name": "Full Name",
  "role": "Co-Organiser",
  "linkedin": "https://www.linkedin.com/in/...",
  "order": 7,
  "photo": "./photos/full-name.jpg",
  "bio": "Optional one-liner."
}
```

`order` sets the position. `photo` and `bio` are optional (without a photo, initials are shown in
a circle). Put photos next to the JSON, e.g. `src/content/team/photos/`.

### Student Builder Groups

One JSON file per group in `src/content/student-groups/`:

```json
{
  "name": "AWS SBG at Vidyavardhaka College of Engineering",
  "institution": "Vidyavardhaka College of Engineering",
  "shortName": "VVCE",
  "area": "Mysuru",
  "location": "Gokulam, Mysuru",
  "leader": "Leader Name (optional)",
  "meetupUrl": "https://www.meetup.com/aws-sbg-at-.../",
  "order": 1
}
```

`area` is `Mysuru` or `Mandya`.

### Community links, email and site details

- Community links (Meetup, Luma, LinkedIn, Twitter/X, Facebook): `src/content/links/links.json`.
  They appear in the footer, on Get Involved and in the site's structured data.
- Email address, speaker form, Meetup/LinkedIn URLs, site description and navigation:
  `src/data/site.ts`.

### Change theme colours

All design tokens live in `src/styles/tokens.css`. Colours use `light-dark(<light>, <dark>)`:

```css
--c-link: light-dark(#6a3fc2, #c9a8ff); /* AWS UG purple; lighter on dark */
```

Change a value there and every component follows. Keep text and button colours at WCAG AA
contrast (4.5:1 for body text).

## Regenerating assets

Generated assets are committed, so you only need these when the source changes.

| Command                        | When to run it                                     | Needs                                                                       |
| ------------------------------ | -------------------------------------------------- | --------------------------------------------------------------------------- |
| `npm run assets:logos`         | Logo files in `logos/` changed                     | —                                                                           |
| `npm run assets:fonts`         | Updating the Amazon Ember web fonts                | Amazon type library package in `fonts/` (not in git)                        |
| `npm run assets:hero`          | Hero illustrations changed                         | `reference/elephant.png`, `palace-day.png`, `palace-night.png` (not in git) |
| `npm run assets:social-image`  | Hero or branding changed (social preview image)    | `npm run build && npm run preview` running                                  |
| `npm run check:hero-alignment` | After `assets:hero`: day/night palace must line up | —                                                                           |
| `npm run check:hero-gait`      | After changing the elephant's size or speed        | `npm run preview` running                                                   |
| `npm run screenshots`          | Visual review in light/dark at 390px and 1440px    | `npm run preview` running                                                   |
| `npm run check:cdn-routing`    | After changing `infrastructure/functions/`         | `npm run build` (tests every page's URL against the CloudFront Function)    |

How the fonts, hero animation and theming work is explained in
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Deployment

The site is hosted on AWS (private S3 bucket + CloudFront, certificate and DNS in the existing
`awsugmys.in` Route 53 zone) and deployed by GitHub Actions on every merge to `main`. See
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the design and
[infrastructure/README.md](infrastructure/README.md) to set it up.

## Contributing

Pull requests are welcome; see [CONTRIBUTING.md](CONTRIBUTING.md) and the
[Code of Conduct](https://awsugmys.in/code-of-conduct/).

## Licence

Code: MIT, see [LICENSE](LICENSE). Logos belong to AWS User Group Mysuru. Amazon Ember fonts are
owned by Amazon. AWS and related marks are trademarks of Amazon.com, Inc. or its affiliates.
