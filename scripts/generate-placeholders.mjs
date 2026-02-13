import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', 'public', 'evidence');

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

const WIDTH = 1200;
const HEIGHT = 630;

function buildSvg({ title, subtitle }) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2c3e50"/><stop offset="100%" stop-color="#1a252f"/></linearGradient></defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect x="100" y="60" width="1000" height="510" rx="12" ry="12" fill="#f5f5f0" stroke="#8b8b7a" stroke-width="2"/>
  <rect x="100" y="60" width="1000" height="70" rx="12" ry="12" fill="#34495e"/>
  <rect x="100" y="100" width="1000" height="30" fill="#34495e"/>
  <text x="180" y="104" font-family="Georgia, serif" font-size="24" fill="#ecf0f1" font-weight="bold">OFFICIAL DOCUMENT</text>
  <line x1="160" y1="200" x2="1040" y2="200" stroke="#ccc" stroke-width="1"/>
  <line x1="160" y1="420" x2="1040" y2="420" stroke="#ccc" stroke-width="1"/>
  <text x="600" y="300" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="#2c3e50" font-weight="bold">${esc(title)}</text>
  <text x="600" y="350" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#7f8c8d">${esc(subtitle)}</text>
  <text x="600" y="490" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" letter-spacing="6" fill="#b0b0a0" font-weight="bold">PLACEHOLDER IMAGE</text>
  <rect x="440" y="510" width="320" height="40" rx="6" fill="#e8e8e0" stroke="#c0c0b0" stroke-width="1"/>
  <text x="600" y="536" text-anchor="middle" font-family="monospace" font-size="14" fill="#7f8c8d">ForThePeople Evidence Archive</text>
</svg>`;
}

const placeholders = [
  { filename: 'bondi-transcript-p45.png', title: 'Senate Judiciary Hearing Transcript, Page 45', subtitle: 'Confirmation hearing testimony - official record' },
  { filename: 'doj-section-9-27-220.png', title: 'DOJ Justice Manual, Section 9-27.220', subtitle: 'Principles of Federal Prosecution - charging guidelines' },
  { filename: 'florida-epstein-2006.png', title: 'Florida State Attorney Records, 2006', subtitle: 'Palm Beach County case files - public record' },
];

for (const item of placeholders) {
  const svg = buildSvg({ title: item.title, subtitle: item.subtitle });
  const outputPath = join(OUTPUT_DIR, item.filename);
  await sharp(Buffer.from(svg)).png().toFile(outputPath);
  console.log('Created:', outputPath);
}
console.log('Done.');
