/**
 * Build script: assembles index.html from src/ and slides/ parts.
 * Run: node build.js
 * Zero dependencies — uses only Node.js built-ins.
 */
const fs = require('fs');
const path = require('path');

const SLIDES_DIR = 'slides';
const HEADER_FILE = path.join('src', 'header.html');
const FOOTER_FILE = path.join('src', 'footer.html');
const OUTPUT_FILE = 'index.html';

// --- Read header ---
if (!fs.existsSync(HEADER_FILE)) {
  console.error(`Error: ${HEADER_FILE} not found`);
  process.exit(1);
}
const header = fs.readFileSync(HEADER_FILE, 'utf8');

// --- Read slides in numeric order ---
if (!fs.existsSync(SLIDES_DIR)) {
  console.error(`Error: ${SLIDES_DIR}/ directory not found`);
  process.exit(1);
}

const slideFiles = fs.readdirSync(SLIDES_DIR)
  .filter(f => f.endsWith('.html'))
  .sort((a, b) => {
    const numA = parseInt(a.split('-')[0], 10);
    const numB = parseInt(b.split('-')[0], 10);
    return numA - numB;
  });

if (slideFiles.length === 0) {
  console.error('Error: no slide files found in slides/');
  process.exit(1);
}

const slides = slideFiles.map(f => fs.readFileSync(path.join(SLIDES_DIR, f), 'utf8'));

// --- Read footer ---
if (!fs.existsSync(FOOTER_FILE)) {
  console.error(`Error: ${FOOTER_FILE} not found`);
  process.exit(1);
}
let footer = fs.readFileSync(FOOTER_FILE, 'utf8');

// --- Update slide indicator total count in footer ---
footer = footer.replace(
  /(<span class="slide-indicator-total">)\d+(<\/span>)/,
  `$1${slideFiles.length}$2`
);

// --- Assemble ---
const output = header + '\n' + slides.join('\n') + '\n' + footer;

fs.writeFileSync(OUTPUT_FILE, output);

// --- Validate ---
const sectionCount = (output.match(/<section class="slide"/g) || []).length;
const byteSize = Buffer.byteLength(output, 'utf8');
const kb = (byteSize / 1024).toFixed(1);

console.log(`Built ${OUTPUT_FILE}:`);
console.log(`  Slides:  ${slideFiles.length} files assembled (${sectionCount} <section> tags found)`);
console.log(`  Size:    ${kb} KB (${byteSize.toLocaleString()} bytes)`);

if (sectionCount !== slideFiles.length) {
  console.error(`\nWARNING: Expected ${slideFiles.length} <section> tags but found ${sectionCount}`);
  process.exit(1);
}

console.log('\nBuild successful!');
