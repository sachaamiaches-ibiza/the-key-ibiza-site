import type { VercelRequest, VercelResponse } from '@vercel/node';

const BACKEND_URL = 'https://the-key-ibiza-backend.vercel.app';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const slug = req.query.slug as string;

  if (!slug) {
    return res.redirect(302, 'https://thekey-ibiza.com');
  }

  try {
    // Fetch yacht data from backend
    const response = await fetch(`${BACKEND_URL}/yachts/${slug}`);

    if (!response.ok) {
      return res.redirect(302, 'https://thekey-ibiza.com');
    }

    const yacht = await response.json();

    const title = `${yacht.nombre} | The Key Ibiza Yacht Charter`;
    const description = yacht.description || `Luxury yacht charter in Ibiza. From €${yacht.price_min_day}/day. Book with The Key Ibiza.`;
    const image = 'https://res.cloudinary.com/drxf80sho/image/upload/v1772298662/95188334-C74E-4CA0-9BC5-315529D6811E_1_201_a_u27ewv.jpg';
    const pageUrl = `https://thekey-ibiza.com/yacht-${yacht.slug || slug}`;

    const html = `<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
  <meta http-equiv="refresh" content="0;url=${pageUrl}">
</head>
<body>Redirecting to ${yacht.nombre}...</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(200).send(html);
  } catch (error) {
    return res.redirect(302, 'https://thekey-ibiza.com');
  }
}
