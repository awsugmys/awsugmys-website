# Collaboration logos

Logo / banner images for entries in `src/content/collaborations/*.json`.

Reference one from an entry with a relative path, e.g.:

```json
{ "logo": "./aws-community-day-bengaluru-2026.png" }
```

Astro processes these at build time (`image()` in the collection schema).
Square logos display in a small logo tile; wide event banners display
full-width across the top of the card.

Expected files (add the images, then set `logo` in the matching JSON):

- `aws-community-day-bengaluru-2026.png` — wide event banner
- `agentic-ai-summit-2026.png` — square robot logo
