# Contributing

Thanks for helping improve the AWS User Group Mysuru website! Content fixes, new blog posts,
event updates and code improvements are all welcome.

## How changes reach the live site

1. You open a pull request against `main`.
2. Automated checks build the site and run type, lint and formatting checks.
3. An organiser reviews and merges it.
4. The merge to `main` deploys automatically.

Only organisers with write access can merge, so nothing goes live without review. See
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for how the workflows and AWS hosting fit together.

## Making a change

```bash
git clone https://github.com/awsugmys/awsugmys-website.git   # or your fork
cd awsugmys-website
npm ci
git checkout -b update/short-description
npm run dev                                                    # http://localhost:4321
```

Before opening a pull request:

```bash
npm run format   # fix formatting
npm run check    # type-check, lint and formatting check — must pass
npm run build    # make sure the production build works
```

## Content changes

Templates for every content type are in the [README](README.md#editing-content):

| What              | Where                                     |
| ----------------- | ----------------------------------------- |
| Blog post         | `src/content/blog/YYYY-MM-DD-title.md`    |
| Event             | `src/content/events/YYYY-MM-DD-name.json` |
| Team member       | `src/content/team/name.json`              |
| Student group     | `src/content/student-groups/name.json`    |
| Community links   | `src/content/links/links.json`            |
| Email, URLs, menu | `src/data/site.ts`                        |

Content is validated when the site builds, so a missing field or a typo in a date fails the build
with a message pointing to the file.

Please don't invent facts: dates, speakers, numbers and quotes should come from a real source
(Meetup, the event organisers, a recording).

## Code changes

- Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) first; it explains the theming, fonts and the
  hero animation.
- Use the design tokens in `src/styles/tokens.css` instead of new hard-coded colours, and check
  both the light and dark themes at phone (390px) and desktop (1440px) widths
  (`npm run screenshots`).
- Keep components small and reuse the existing ones in `src/components/`.
- Use semantic HTML, keep heading levels in order, give meaningful images alt text, and keep
  everything usable with a keyboard.
- Images for posts go in `src/assets/blog/` and are optimised at build time.

## Pull requests

Use a short, descriptive title with a prefix: `Add:`, `Fix:`, `Update:`, `Docs:` or `Style:`.
In the description, say what changed and why, and add screenshots for visual changes.

## Reporting issues

Open a [GitHub issue](https://github.com/awsugmys/awsugmys-website/issues) with what you expected,
what happened, and steps or a screenshot. For anything else, email
[awsugmys@gmail.com](mailto:awsugmys@gmail.com).

Everyone taking part is expected to follow the
[Code of Conduct](https://awsugmys.in/code-of-conduct/).
