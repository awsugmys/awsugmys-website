// Static Mysore Palace silhouette (traced from the palace illustration), used
// as a CSS mask by post cards and the call-to-action panel. Served once and
// cached instead of being inlined on every page.
import outline from '../assets/hero/palace-outline.json';

export function GET() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${outline.width} ${outline.height}"><path d="${outline.d}"/></svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
}
