/**
 * Dynamic Sitemap Generator for The Key Ibiza
 * Fetches all villas and blog posts from backend and generates sitemap.xml
 *
 * Run: node scripts/generate-sitemap.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_URL = 'https://the-key-ibiza-backend.vercel.app';
const SITE_URL = 'https://thekey-ibiza.com';

// Supported languages (en = default, no prefix)
const LANGUAGES = ['en', 'fr', 'es', 'de'];

// Static pages with their priorities and change frequencies
const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/holiday-rentals', priority: '0.9', changefreq: 'daily' },
  { path: '/long-term', priority: '0.8', changefreq: 'weekly' },
  { path: '/for-sale', priority: '0.8', changefreq: 'weekly' },
  { path: '/boats', priority: '0.9', changefreq: 'weekly' },
  { path: '/catamarans', priority: '0.8', changefreq: 'weekly' },
  { path: '/services', priority: '0.8', changefreq: 'monthly' },
  { path: '/yacht', priority: '0.7', changefreq: 'monthly' },
  { path: '/security', priority: '0.7', changefreq: 'monthly' },
  { path: '/wellness', priority: '0.7', changefreq: 'monthly' },
  { path: '/nightlife', priority: '0.7', changefreq: 'monthly' },
  { path: '/events', priority: '0.7', changefreq: 'monthly' },
  { path: '/catering', priority: '0.7', changefreq: 'monthly' },
  { path: '/furniture', priority: '0.6', changefreq: 'monthly' },
  { path: '/health', priority: '0.6', changefreq: 'monthly' },
  { path: '/yoga', priority: '0.6', changefreq: 'monthly' },
  { path: '/cleaning', priority: '0.6', changefreq: 'monthly' },
  { path: '/driver', priority: '0.6', changefreq: 'monthly' },
  { path: '/babysitting', priority: '0.6', changefreq: 'monthly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/blog', priority: '0.8', changefreq: 'daily' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
];

async function fetchVillas() {
  try {
    const res = await fetch(`${BACKEND_URL}/villas`);
    if (!res.ok) {
      console.error('Failed to fetch villas:', res.status);
      return [];
    }
    const data = await res.json();
    const villas = Array.isArray(data) ? data : (data.data || []);
    // Filter out VIP-only villas from sitemap
    return villas.filter(v => !v.vip_only);
  } catch (e) {
    console.error('Error fetching villas:', e);
    return [];
  }
}

async function fetchYachts() {
  try {
    const res = await fetch(`${BACKEND_URL}/yachts`);
    if (!res.ok) {
      console.error('Failed to fetch yachts:', res.status);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : (data.data || []);
  } catch (e) {
    console.error('Error fetching yachts:', e);
    return [];
  }
}

async function fetchBlogPosts() {
  try {
    const res = await fetch(`${BACKEND_URL}/blog`);
    if (!res.ok) {
      console.error('Failed to fetch blog posts:', res.status);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : (data.posts || data.data || []);
  } catch (e) {
    console.error('Error fetching blog posts:', e);
    return [];
  }
}

function generateSitemapXml(pages) {
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  for (const page of pages) {
    // For each page, generate entries for all languages
    for (const lang of LANGUAGES) {
      const langPrefix = lang === 'en' ? '' : `/${lang}`;
      const fullPath = page.path === '/' ? (langPrefix || '/') : `${langPrefix}${page.path}`;

      xml += `  <url>
    <loc>${SITE_URL}${fullPath}</loc>
    <lastmod>${page.lastmod || today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>`;

      // Add hreflang links for all language variants
      for (const altLang of LANGUAGES) {
        const altPrefix = altLang === 'en' ? '' : `/${altLang}`;
        const altPath = page.path === '/' ? (altPrefix || '/') : `${altPrefix}${page.path}`;
        xml += `
    <xhtml:link rel="alternate" hreflang="${altLang}" href="${SITE_URL}${altPath}"/>`;
      }
      // Add x-default (pointing to English version)
      const defaultPath = page.path === '/' ? '/' : page.path;
      xml += `
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${defaultPath}"/>`;

      // Add image if available
      if (page.image) {
        xml += `
    <image:image>
      <image:loc>${page.image}</image:loc>
      <image:title>${(page.title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</image:title>
    </image:image>`;
      }

      xml += `
  </url>
`;
    }
  }

  xml += `</urlset>`;
  return xml;
}

async function main() {
  console.log('🗺️  Generating sitemap for The Key Ibiza...\n');

  const allPages = [...STATIC_PAGES];

  // Fetch villas
  console.log('📍 Fetching villas...');
  const villas = await fetchVillas();
  console.log(`   Found ${villas.length} public villas`);

  for (const villa of villas) {
    const slug = villa.slug || villa.id;
    if (slug) {
      allPages.push({
        path: `/villa-${slug}`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: villa.updated_at?.split('T')[0] || undefined,
        image: villa.header_images?.[0] || undefined,
        title: villa.villa_name || villa.name,
      });
    }
  }

  // Fetch yachts
  console.log('⛵ Fetching yachts...');
  const yachts = await fetchYachts();
  console.log(`   Found ${yachts.length} yachts`);

  for (const yacht of yachts) {
    const id = yacht.id || yacht.slug;
    if (id) {
      allPages.push({
        path: `/yacht-${id}`,
        priority: '0.7',
        changefreq: 'weekly',
        image: yacht.image_url || yacht.header_image || undefined,
        title: yacht.name,
      });
    }
  }

  // Fetch blog posts
  console.log('📝 Fetching blog posts...');
  const posts = await fetchBlogPosts();
  console.log(`   Found ${posts.length} blog posts`);

  for (const post of posts) {
    const slug = post.slug || post.id;
    if (slug && post.status !== 'draft') {
      allPages.push({
        path: `/blog-${slug}`,
        priority: '0.7',
        changefreq: 'monthly',
        lastmod: post.published_at?.split('T')[0] || post.created_at?.split('T')[0] || undefined,
        image: post.featured_image || post.image || undefined,
        title: post.title,
      });
    }
  }

  // Generate sitemap
  console.log('\n📄 Generating sitemap.xml...');
  const sitemapXml = generateSitemapXml(allPages);

  // Write to public folder
  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, sitemapXml, 'utf-8');

  const totalUrls = allPages.length * LANGUAGES.length;
  console.log(`✅ Sitemap generated with ${totalUrls} URLs (${allPages.length} pages × ${LANGUAGES.length} languages)`);
  console.log(`   Output: ${outputPath}`);

  // Summary
  console.log('\n📊 Summary:');
  console.log(`   Languages: ${LANGUAGES.join(', ')}`);
  console.log(`   Static pages: ${STATIC_PAGES.length}`);
  console.log(`   Villas: ${villas.length}`);
  console.log(`   Yachts: ${yachts.length}`);
  console.log(`   Blog posts: ${posts.length}`);
  console.log(`   Base pages: ${allPages.length}`);
  console.log(`   Total URLs (with languages): ${totalUrls}`);
}

main().catch(console.error);
