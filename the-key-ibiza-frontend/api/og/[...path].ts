import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path || '';

  // Determine the type and slug
  let type = '';
  let slug = '';

  if (path.startsWith('villa-')) {
    type = 'villa';
    slug = path.replace('villa-', '');
  } else if (path.startsWith('yacht-')) {
    type = 'yacht';
    slug = path.replace('yacht-', '');
  } else if (path.startsWith('blog-')) {
    type = 'blog';
    slug = path.replace('blog-', '');
  } else {
    return res.redirect(302, '/');
  }

  // This endpoint is only reached by bots (filtered by vercel.json routes)
  // Fetch OG data from backend
  try {
    const response = await fetch(`https://the-key-ibiza-backend.vercel.app/og/${type}/${slug}`);
    const html = await response.text();
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.send(html);
  } catch (error) {
    return res.redirect(302, `/${path}`);
  }
}
