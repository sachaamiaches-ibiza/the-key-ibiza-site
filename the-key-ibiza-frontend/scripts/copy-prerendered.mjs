/**
 * Copies pre-rendered HTML files to dist after Vite build
 * This allows Vercel to serve pre-rendered content for SEO
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRERENDERED_DIR = path.join(__dirname, '../prerendered');
const DIST_DIR = path.join(__dirname, '../dist');

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);

  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    for (const item of fs.readdirSync(src)) {
      // Skip assets folder - Vite generates fresh ones
      if (item === 'assets') continue;
      // Skip files that exist in dist (Vite's are fresher)
      const destPath = path.join(dest, item);
      const srcPath = path.join(src, item);

      if (fs.statSync(srcPath).isDirectory()) {
        copyRecursive(srcPath, destPath);
      } else if (!fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
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

  // Copy all pre-rendered route folders (not root files)
  const items = fs.readdirSync(PRERENDERED_DIR);
  let copied = 0;

  for (const item of items) {
    const srcPath = path.join(PRERENDERED_DIR, item);
    const destPath = path.join(DIST_DIR, item);

    // Only copy directories (route folders with index.html)
    if (fs.statSync(srcPath).isDirectory() && item !== 'assets') {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }

      // Copy the index.html from the pre-rendered folder
      const indexSrc = path.join(srcPath, 'index.html');
      const indexDest = path.join(destPath, 'index.html');

      if (fs.existsSync(indexSrc)) {
        fs.copyFileSync(indexSrc, indexDest);
        copied++;
      }
    }
  }

  console.log(`Copied ${copied} pre-rendered pages to dist`);
}

main();
