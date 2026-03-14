/**
 * Copies pre-rendered HTML files to dist after Vite build
 * Updates asset references to match the new Vite-generated hashes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRERENDERED_DIR = path.join(__dirname, '../prerendered');
const DIST_DIR = path.join(__dirname, '../dist');

// Extract asset hashes from index.html
function extractAssetHashes(html) {
  const jsMatch = html.match(/index-([A-Za-z0-9]+)\.js/);
  const cssMatch = html.match(/index-([A-Za-z0-9]+)\.css/);
  return {
    js: jsMatch ? jsMatch[1] : null,
    css: cssMatch ? cssMatch[1] : null
  };
}

// Replace old asset hashes with new ones
function updateAssetReferences(html, oldHashes, newHashes) {
  let updated = html;

  // Replace JS hash
  if (oldHashes.js && newHashes.js && oldHashes.js !== newHashes.js) {
    updated = updated.replace(
      new RegExp(`index-${oldHashes.js}\\.js`, 'g'),
      `index-${newHashes.js}.js`
    );
  }

  // Replace CSS hash
  if (oldHashes.css && newHashes.css && oldHashes.css !== newHashes.css) {
    updated = updated.replace(
      new RegExp(`index-${oldHashes.css}\\.css`, 'g'),
      `index-${newHashes.css}.css`
    );
  }

  return updated;
}

// Recursively process directories
function processDirectory(srcDir, destDir, oldHashes, newHashes) {
  if (!fs.existsSync(srcDir)) return 0;

  let copied = 0;
  const items = fs.readdirSync(srcDir);

  for (const item of items) {
    if (item === 'assets') continue; // Skip assets folder

    const srcPath = path.join(srcDir, item);
    const destPath = path.join(destDir, item);
    const stats = fs.statSync(srcPath);

    if (stats.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copied += processDirectory(srcPath, destPath, oldHashes, newHashes);
    } else if (item === 'index.html') {
      // Read, update hashes, and write
      let html = fs.readFileSync(srcPath, 'utf-8');
      html = updateAssetReferences(html, oldHashes, newHashes);

      if (!fs.existsSync(path.dirname(destPath))) {
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
      }
      fs.writeFileSync(destPath, html);
      copied++;
    }
  }

  return copied;
}

function main() {
  if (!fs.existsSync(PRERENDERED_DIR)) {
    console.log('No prerendered folder found, skipping...');
    return;
  }

  if (!fs.existsSync(DIST_DIR)) {
    console.log('No dist folder found, skipping...');
    return;
  }

  console.log('Copying pre-rendered HTML files to dist...');

  // Get new hashes from Vite's index.html
  const newIndexHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf-8');
  const newHashes = extractAssetHashes(newIndexHtml);
  console.log(`New asset hashes - JS: ${newHashes.js}, CSS: ${newHashes.css}`);

  // Get old hashes from a sample pre-rendered file
  const sampleDirs = fs.readdirSync(PRERENDERED_DIR).filter(f => {
    const p = path.join(PRERENDERED_DIR, f);
    return fs.statSync(p).isDirectory() && f !== 'assets';
  });

  let oldHashes = { js: null, css: null };
  if (sampleDirs.length > 0) {
    const sampleFile = path.join(PRERENDERED_DIR, sampleDirs[0], 'index.html');
    if (fs.existsSync(sampleFile)) {
      const sampleHtml = fs.readFileSync(sampleFile, 'utf-8');
      oldHashes = extractAssetHashes(sampleHtml);
      console.log(`Old asset hashes - JS: ${oldHashes.js}, CSS: ${oldHashes.css}`);
    }
  }

  // Process all pre-rendered directories
  let copied = 0;
  const items = fs.readdirSync(PRERENDERED_DIR);

  for (const item of items) {
    const srcPath = path.join(PRERENDERED_DIR, item);
    const destPath = path.join(DIST_DIR, item);

    if (fs.statSync(srcPath).isDirectory() && item !== 'assets') {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copied += processDirectory(srcPath, destPath, oldHashes, newHashes);
    }
  }

  console.log(`Copied and updated ${copied} pre-rendered pages`);
}

main();
