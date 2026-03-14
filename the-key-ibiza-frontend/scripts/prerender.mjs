/**
 * Pre-rendering Script for The Key Ibiza
 * Renders all pages at build time so Google can see the content
 *
 * Run: node scripts/prerender.mjs
 */

import puppeteer from 'puppeteer';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Output to prerendered/ folder (committed to repo) or dist/ if running locally after build
const DIST_DIR = path.join(__dirname, '../dist');
const PRERENDERED_DIR = path.join(__dirname, '../prerendered');
const PORT = 4173;
const BACKEND_URL = 'https://the-key-ibiza-backend.vercel.app';

// Languages to pre-render (en = default, no prefix)
const LANGUAGES = ['en', 'fr', 'es', 'de'];

// Static routes to pre-render
const STATIC_ROUTES = [
  '/',
  '/villas',
  '/holiday-rentals',
  '/long-term',
  '/for-sale',
  '/boats',
  '/yachts',
  '/catamarans',
  '/services',
  '/yacht',
  '/security',
  '/wellness',
  '/nightlife',
  '/events',
  '/catering',
  '/furniture',
  '/health',
  '/yoga',
  '/cleaning',
  '/driver',
  '/babysitting',
  '/about',
  '/blog',
  '/contact',
];

// Fetch dynamic routes from backend
async function fetchDynamicRoutes() {
  const routes = [];

  try {
    // Fetch villas
    console.log('   Fetching villas from backend...');
    const villasRes = await fetch(`${BACKEND_URL}/villas`);
    const villasData = await villasRes.json();
    const villas = Array.isArray(villasData) ? villasData : (villasData.data || []);

    for (const villa of villas) {
      if (!villa.vip_only) {
        const slug = villa.slug || nameToSlug(villa.villa_name || villa.name);
        if (slug) {
          routes.push(`/villa-${slug}`);
        }
      }
    }
    console.log(`   Found ${routes.length} villa routes`);

    // Fetch yachts
    console.log('   Fetching yachts from backend...');
    const yachtsRes = await fetch(`${BACKEND_URL}/yachts`);
    const yachtsData = await yachtsRes.json();
    const yachts = Array.isArray(yachtsData) ? yachtsData : (yachtsData.data || []);

    const yachtRoutes = [];
    for (const yacht of yachts) {
      const id = yacht.id || yacht.slug;
      if (id) {
        yachtRoutes.push(`/yacht-${id}`);
      }
    }
    console.log(`   Found ${yachtRoutes.length} yacht routes`);
    routes.push(...yachtRoutes);

    // Fetch blog posts
    console.log('   Fetching blog posts from backend...');
    const blogRes = await fetch(`${BACKEND_URL}/blog`);
    const blogData = await blogRes.json();
    const posts = Array.isArray(blogData) ? blogData : (blogData.posts || blogData.data || []);

    const blogRoutes = [];
    for (const post of posts) {
      const slug = post.slug || post.id;
      if (slug && post.status !== 'draft') {
        blogRoutes.push(`/blog-${slug}`);
      }
    }
    console.log(`   Found ${blogRoutes.length} blog routes`);
    routes.push(...blogRoutes);

  } catch (error) {
    console.error('   Error fetching dynamic routes:', error.message);
  }

  return routes;
}

function nameToSlug(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Start static server
function startServer() {
  return new Promise((resolve) => {
    const app = express();

    // Serve static files
    app.use(express.static(DIST_DIR));

    // SPA fallback - serve index.html for all routes (Express 5 syntax)
    app.get('/{*path}', (req, res) => {
      res.sendFile(path.join(DIST_DIR, 'index.html'));
    });

    const server = app.listen(PORT, () => {
      console.log(`   Static server started on port ${PORT}`);
      resolve(server);
    });
  });
}

// Render a single page
async function renderPage(browser, route) {
  const page = await browser.newPage();
  const url = `http://localhost:${PORT}${route}`;

  try {
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Wait for React to render
    await page.waitForSelector('#root > *', { timeout: 10000 });

    // Wait a bit more for async data
    await new Promise(r => setTimeout(r, 2000));

    // Get the rendered HTML
    const html = await page.content();

    // Create directory structure for the route
    const filePath = route === '/'
      ? path.join(DIST_DIR, 'index.html')
      : path.join(DIST_DIR, route, 'index.html');

    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write the pre-rendered HTML
    fs.writeFileSync(filePath, html);

    return true;
  } catch (error) {
    console.error(`   Error rendering ${route}:`, error.message);
    return false;
  } finally {
    await page.close();
  }
}

async function main() {
  console.log('\n🚀 Pre-rendering The Key Ibiza...\n');

  // Check if dist exists
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ dist/ folder not found. Run "npm run build" first.\n');
    process.exit(1);
  }

  // Fetch all routes
  console.log('📍 Collecting routes...');
  const dynamicRoutes = await fetchDynamicRoutes();
  const baseRoutes = [...STATIC_ROUTES, ...dynamicRoutes];
  console.log(`   Base routes: ${baseRoutes.length}`);

  // Generate routes for all languages
  const allRoutes = [];
  for (const route of baseRoutes) {
    for (const lang of LANGUAGES) {
      if (lang === 'en') {
        allRoutes.push(route);
      } else {
        // Add language prefix
        allRoutes.push(`/${lang}${route === '/' ? '' : route}`);
      }
    }
  }
  console.log(`   Total routes (${LANGUAGES.length} languages): ${allRoutes.length}\n`);

  // Start server
  console.log('🖥️  Starting static server...');
  const server = await startServer();

  // Launch browser
  console.log('\n🌐 Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  // Render pages
  console.log('\n📄 Pre-rendering pages...\n');
  let success = 0;
  let failed = 0;

  for (let i = 0; i < allRoutes.length; i++) {
    const route = allRoutes[i];
    process.stdout.write(`   [${i + 1}/${allRoutes.length}] ${route}... `);

    const ok = await renderPage(browser, route);
    if (ok) {
      success++;
      console.log('✓');
    } else {
      failed++;
      console.log('✗');
    }
  }

  // Cleanup
  await browser.close();
  server.close();

  // Summary
  console.log('\n📊 Summary:');
  console.log(`   🌐 Languages: ${LANGUAGES.join(', ')}`);
  console.log(`   ✅ Success: ${success}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📁 Output: ${DIST_DIR}\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch(console.error);
