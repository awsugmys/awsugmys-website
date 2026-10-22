# Branding

## Logos

The official logo files live in `logos/` and are the source of truth. Don't edit them.

| File                                       | Use                                                              |
| ------------------------------------------ | ---------------------------------------------------------------- |
| `logos/wordmark-for-light-backgrounds.png` | Wordmark with dark "AWS" text: header in the light theme         |
| `logos/wordmark-for-dark-backgrounds.png`  | Wordmark with white "AWS" text: header in dark theme, and footer |
| `logos/icon.png`                           | Palace hexagon on its own: favicons and app icons                |
| `logos/icon-with-padding.png`              | Palace hexagon with padding, for social profiles and print       |

`npm run assets:logos` trims the transparent padding and resizes these into
`src/assets/logos/` (header/footer) and the favicons and app icons in `public/`. Only padding is
trimmed; the artwork is never altered.

The social preview image (`public/og-image.png`, 1200×630) is rendered from the night-time hero
with `npm run assets:social-image`.

## Colours

Defined in `src/styles/tokens.css`:

| Colour       | Value                 | Use                                                                    |
| ------------ | --------------------- | ---------------------------------------------------------------------- |
| Brand purple | `#AD7FF6`             | Logo text. On light backgrounds use `#6A3FC2` for text and links (AA). |
| Brand navy   | `#1C283C`             | Logo hexagon background                                                |
| AWS orange   | `#FF9900`             | Primary buttons, with dark `#16191F` text                              |
| Orange text  | `#C45500` / `#FFB84D` | When orange is needed as text (light / dark theme)                     |
| Squid ink    | `#232F3E`             | Footer and call-to-action panels                                       |

## Typography

Amazon fonts only: **Amazon Ember** for text and UI, **Amazon Ember Display** (bold) for headings,
with Arial as the fallback. See [ARCHITECTURE.md](ARCHITECTURE.md#fonts) for how they're built and
loaded.

## Visual motif

The Mysore Palace: the day and night illustrations in the home page hero, and the palace skyline
traced from them (footer, blog cards, call-to-action panel). Keep the look clean and
professional; avoid festival decoration such as fireworks or garlands.

## Contact

Brand questions: [awsugmys@gmail.com](mailto:awsugmys@gmail.com). Follow the AWS trademark
guidelines when using AWS names and marks.
