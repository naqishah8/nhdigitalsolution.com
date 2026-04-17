// One-off: compress every PNG in public/ into a much smaller version.
// Sharp (bundled with Next) resizes to a sensible max width and re-encodes
// both as WebP (for modern browsers) and as a light-weight PNG fallback.
// Run with: `node scripts/optimize-images.mjs`

import sharp from 'sharp';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '..', 'public');

// Images larger than this max width get downscaled. The site never renders
// these above ~900 px intrinsic, so 1400 is safe overkill for retina.
const MAX_WIDTH = 1400;
const WEBP_QUALITY = 78;
const PNG_QUALITY = 78;

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (/\.png$/i.test(entry.name)) out.push(full);
  }
  return out;
}

function fmt(bytes) {
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

const files = await walk(publicDir);
let saved = 0;
let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const rel = path.relative(publicDir, file);
  const before = (await fs.stat(file)).size;
  totalBefore += before;

  // Read file into a buffer first, then close the handle before writing.
  // Sharp pipelines can hold the input file open on Windows otherwise.
  const buf = await fs.readFile(file);
  const img = sharp(buf);
  const meta = await img.metadata();
  const needsResize = meta.width && meta.width > MAX_WIDTH;

  const pipeline = needsResize
    ? img.resize({ width: MAX_WIDTH, withoutEnlargement: true })
    : img;

  // 1. Emit optimised PNG — write to a temp sibling then rename atomically.
  const optimised = await pipeline
    .clone()
    .png({ quality: PNG_QUALITY, compressionLevel: 9, palette: true })
    .toBuffer();

  if (optimised.length < before) {
    const tmp = file + '.tmp';
    await fs.writeFile(tmp, optimised);
    await fs.rename(tmp, file);
    saved += before - optimised.length;
  }

  // 2. Emit a WebP sibling for modern browsers / future use.
  const webpPath = file.replace(/\.png$/i, '.webp');
  const webpBuf = await pipeline
    .clone()
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
  const webpTmp = webpPath + '.tmp';
  await fs.writeFile(webpTmp, webpBuf);
  await fs.rename(webpTmp, webpPath);

  const after = (await fs.stat(file)).size;
  const webp = (await fs.stat(webpPath)).size;
  totalAfter += after;

  console.log(
    `  ${rel}: ${fmt(before)} → ${fmt(after)} (PNG) · ${fmt(webp)} (WebP)`
  );
}

console.log('—');
console.log(`Total PNG size: ${fmt(totalBefore)} → ${fmt(totalAfter)}`);
console.log(`Saved: ${fmt(saved)}`);
