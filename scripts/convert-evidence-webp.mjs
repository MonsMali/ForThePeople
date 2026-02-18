import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const EVIDENCE_DIR = join(process.cwd(), 'public', 'evidence');
const QUALITY = 80;

async function convert() {
  const files = await readdir(EVIDENCE_DIR);
  const pngs = files.filter((f) => f.endsWith('.png'));

  if (pngs.length === 0) {
    console.log('No PNG files found in public/evidence/');
    return;
  }

  console.log(`Found ${pngs.length} PNG files. Converting to WebP (quality ${QUALITY})...\n`);

  let converted = 0;
  for (const file of pngs) {
    const input = join(EVIDENCE_DIR, file);
    const output = join(EVIDENCE_DIR, file.replace(/\.png$/i, '.webp'));
    try {
      const info = await sharp(input).webp({ quality: QUALITY }).toFile(output);
      const origStats = await sharp(input).metadata();
      const savings = origStats.size ? Math.round((1 - info.size / origStats.size) * 100) : '?';
      console.log(`  ✓ ${file} → ${file.replace('.png', '.webp')} (${savings}% smaller)`);
      converted++;
    } catch (err) {
      console.error(`  ✗ ${file}: ${err.message}`);
    }
  }

  console.log(`\nDone. Converted ${converted}/${pngs.length} files.`);
}

convert();
