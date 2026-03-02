// Vercel Serverless Function to proxy share requests to backend
// This ensures proper OG tag delivery for social media sharing

const BACKEND_URL = 'https://the-key-ibiza-backend.vercel.app';

export default async function handler(req, res) {
  const { path } = req.query;
  const pathStr = Array.isArray(path) ? path.join('/') : path;

  if (!pathStr) {
    return res.redirect(302, 'https://thekey-ibiza.com');
  }

  try {
    const backendResponse = await fetch(`${BACKEND_URL}/share/${pathStr}`, {
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

    // If backend returned a redirect, follow it
    if (backendResponse.status >= 300 && backendResponse.status < 400) {
      const location = backendResponse.headers.get('location');
      if (location) {
        return res.redirect(302, location);
      }
    }

    // Fallback to homepage
    return res.redirect(302, 'https://thekey-ibiza.com');
  } catch (error) {
    console.error('Share proxy error:', error);
    return res.redirect(302, 'https://thekey-ibiza.com');
  }
}
