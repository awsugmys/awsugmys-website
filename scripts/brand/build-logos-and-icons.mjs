// Builds the web logos and favicons from the official files in /logos.
// Only transparent padding is trimmed and images are resized; the artwork
// itself is never altered. Re-run after changing /logos:
//   npm run assets:logos
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const LOGOS = new URL('../../logos/', import.meta.url);
const ASSETS = new URL('../../src/assets/logos/', import.meta.url);
const PUBLIC = new URL('../../public/', import.meta.url);
const NAVY = '#1C283C'; // sampled from the hexagon background

await mkdir(ASSETS, { recursive: true });
await mkdir(PUBLIC, { recursive: true });

const path = (file, dir) => fileURLToPath(new URL(file, dir));
const trimmed = (file, width) =>
  sharp(path(file, LOGOS))
    .trim()
    .resize({ width, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true });

// Header/footer wordmarks: dark text for the light theme, white text for dark.
await trimmed('wordmark-for-light-backgrounds.png', 960).toFile(path('logo-light.png', ASSETS));
await trimmed('wordmark-for-dark-backgrounds.png', 960).toFile(path('logo-dark.png', ASSETS));

const iconBuf = await sharp(path('icon.png', LOGOS)).trim().png().toBuffer();

// Square icon with the hexagon centred; `scale` leaves breathing room.
const square = async (size, { bg = null, scale = 1 } = {}) => {
  const inner = Math.round(size * scale);
  const icon = await sharp(iconBuf)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: bg ?? { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: icon, gravity: 'center' }])
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
};

const out = async (name, buf) => writeFile(new URL(name, PUBLIC), buf);

await out('favicon-16x16.png', await square(16));
await out('favicon-32x32.png', await square(32));
await out('icon-192.png', await square(192));
await out('icon-512.png', await square(512));
await out('icon-maskable-512.png', await square(512, { bg: NAVY, scale: 0.72 }));
await out('apple-touch-icon.png', await square(180, { bg: NAVY, scale: 0.86 }));

// favicon.ico containing a single 32x32 PNG (supported by every modern browser).
const png32 = await square(32);
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // image count
header.writeUInt8(32, 6); // width
header.writeUInt8(32, 7); // height
header.writeUInt8(0, 8); // palette
header.writeUInt8(0, 9); // reserved
header.writeUInt16LE(1, 10); // colour planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(png32.length, 14);
header.writeUInt32LE(22, 18); // data offset
await out('favicon.ico', Buffer.concat([header, png32]));

console.log('Logos and favicons written.');
