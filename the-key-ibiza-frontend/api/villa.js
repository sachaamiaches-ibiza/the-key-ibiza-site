// Vercel Serverless Function to proxy villa share requests to backend
const BACKEND_URL = 'https://the-key-ibiza-backend.vercel.app';

export default async function handler(req, res) {
  // Extract slug from the request URL
  // The URL will be /api/villa?slug=xxx
  const slug = req.query.slug || '';

  if (!slug) {
    return res.redirect(302, 'https://thekey-ibiza.com');
  }

  try {
    const backendResponse = await fetch(`${BACKEND_URL}/share/villa/${slug}`, {
      method: 'GET',
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
        'Accept': 'text/html',
      },
    });

    if (backendResponse.ok) {
      const html = await backendResponse.text();
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.status(200).send(html);
    }

    return res.redirect(302, 'https://thekey-ibiza.com');
  } catch (error) {
    console.error('Villa proxy error:', error);
    return res.redirect(302, 'https://thekey-ibiza.com');
  }
}
