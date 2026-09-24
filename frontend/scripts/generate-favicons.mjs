import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Master 512x512 SVG for SyncBridge
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <linearGradient id="sb-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563EB" />
      <stop offset="45%" stop-color="#1D4ED8" />
      <stop offset="100%" stop-color="#1E3A8A" />
    </linearGradient>
    <linearGradient id="sb-badge" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <linearGradient id="sb-glow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#1D4ED8" stop-opacity="0" />
    </linearGradient>
    <filter id="badge-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0F172A" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Modern squircle background -->
  <rect x="16" y="16" width="480" height="480" rx="112" fill="url(#sb-bg)" />
  <rect x="16" y="16" width="480" height="480" rx="112" fill="url(#sb-glow)" />
  <rect x="16" y="16" width="480" height="480" rx="112" stroke="rgba(255, 255, 255, 0.2)" stroke-width="10" />

  <!-- Cooperative Solidarity Community & Sync Emblem -->
  <g stroke="#FFFFFF" stroke-width="32" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <!-- Primary Worker Body & Head -->
    <path d="M304 384v-32a64 64 0 0 0-64-64H160a64 64 0 0 0-64 64v32" />
    <circle cx="200" cy="176" r="48" />

    <!-- Connected Cooperative Ally / Society Member -->
    <path d="M384 384v-28a56 56 0 0 0-42-54" />
    <path d="M308 126a48 48 0 0 1 0 92" />

    <!-- Bridge Arch Foundation (SyncBridge baseline) -->
    <path d="M120 416h272" stroke-width="26" stroke="rgba(255, 255, 255, 0.7)" />
  </g>

  <!-- Cooperative Verified Emerald Badge (Top-Right) -->
  <g filter="url(#badge-shadow)">
    <circle cx="396" cy="116" r="46" fill="url(#sb-badge)" stroke="#FFFFFF" stroke-width="12" />
    <!-- Checkmark icon inside emerald badge -->
    <path d="M380 116l11 11 21-21" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />
  </g>
</svg>`;

// Helper: pack PNG buffers into an ICO file
function createIco(images) {
  // images: array of { width, height, buffer }
  const count = images.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = count * dirEntrySize;
  let offset = headerSize + dirSize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = ICO
  header.writeUInt16LE(count, 4); // count

  const dirEntries = [];
  for (const img of images) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // color palette count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // size of image data
    entry.writeUInt32LE(offset, 12); // offset of image data
    dirEntries.push(entry);
    offset += img.buffer.length;
  }

  return Buffer.concat([
    header,
    ...dirEntries,
    ...images.map(img => img.buffer)
  ]);
}

async function run() {
  console.log('Generating SyncBridge Favicons...');
  const svgBuffer = Buffer.from(svgContent);

  // 1. Write SVG icons
  const srcAppDir = path.join(rootDir, 'src', 'app');
  const publicDir = path.join(rootDir, 'public');

  fs.writeFileSync(path.join(srcAppDir, 'icon.svg'), svgContent, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf8');
  console.log('✓ Written icon.svg to src/app and public/');

  // 2. Generate PNGs at multiple resolutions
  const p16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const p32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const p48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();
  const p180 = await sharp(svgBuffer).resize(180, 180).png().toBuffer();
  const p512 = await sharp(svgBuffer).resize(512, 512).png().toBuffer();

  // Save standard icon PNGs
  fs.writeFileSync(path.join(srcAppDir, 'icon.png'), p32);
  fs.writeFileSync(path.join(publicDir, 'icon.png'), p32);
  fs.writeFileSync(path.join(srcAppDir, 'apple-icon.png'), p180);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), p180);
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), p512);
  console.log('✓ Written icon.png (32x32), apple-icon.png (180x180), and icon-512.png');

  // 3. Create multi-resolution ICO file
  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: p16 },
    { width: 32, height: 32, buffer: p32 },
    { width: 48, height: 48, buffer: p48 }
  ]);

  fs.writeFileSync(path.join(srcAppDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('✓ Written multi-resolution favicon.ico (16, 32, 48) to src/app and public/');

  console.log('All favicons successfully generated!');
}

run().catch(err => {
  console.error('Failed to generate favicons:', err);
  process.exit(1);
});
