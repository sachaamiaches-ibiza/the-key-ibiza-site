// Cloudinary image optimization utility
// Transforms external image URLs to use Cloudinary's fetch and optimization

const CLOUDINARY_CLOUD_NAME = 'drxf80sho';

// Logo for watermark - uploaded to THE KEY IBIZA LOGO folder
const LOGO_PUBLIC_ID = 'THE_KEY_IBIZA_LOGO:logo';

interface CloudinaryOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | 'auto:low' | 'auto:eco' | 'auto:good' | 'auto:best' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  crop?: 'fill' | 'fit' | 'scale' | 'limit';
}

export function getOptimizedImageUrl(
  originalUrl: string,
  options: CloudinaryOptions = {}
): string {
  // Skip if no URL or already a Cloudinary URL
  if (!originalUrl || originalUrl.includes('cloudinary.com')) {
    return originalUrl;
  }

  // Skip if it's a data URL or local file
  if (originalUrl.startsWith('data:') || originalUrl.startsWith('blob:')) {
    return originalUrl;
  }

  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'limit'
  } = options;

  // Build transformation string
  const transforms: string[] = [];

  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (crop) transforms.push(`c_${crop}`);
  transforms.push(`q_${quality}`);
  transforms.push(`f_${format}`);

  const transformString = transforms.join(',');

  // Cloudinary fetch URL format
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/${transformString}/${encodeURIComponent(originalUrl)}`;
}

// Helper to add watermark transformation for fetch URLs
function addWatermarkTransform(baseUrl: string, logoWidth: number = 180): string {
  // For fetch URLs, add watermark as overlay transformation
  // The format is: /l_<public_id>,w_<width>,o_<opacity>,g_center/fl_layer_apply/
  const watermarkTransform = `l_${LOGO_PUBLIC_ID},w_${logoWidth},o_50,g_center/fl_layer_apply`;

  // Insert watermark after /fetch/ part
  const fetchIndex = baseUrl.indexOf('/fetch/');
  if (fetchIndex === -1) return baseUrl;

  const beforeTransform = baseUrl.substring(0, fetchIndex + 7); // includes '/fetch/'
  const afterFetch = baseUrl.substring(fetchIndex + 7);

  // Find where the original transform ends (before the encoded URL)
  const parts = afterFetch.split('/http');
  if (parts.length < 2) return baseUrl;

  return `${beforeTransform}${parts[0]}/${watermarkTransform}/http${parts.slice(1).join('/http')}`;
}

// Preset for villa card thumbnails (listing page)
export function getCardImageUrl(url: string): string {
  const optimized = getOptimizedImageUrl(url, {
    width: 600,
    quality: 'auto',
    format: 'auto',
    crop: 'limit'
  });
  return addWatermarkTransform(optimized, 100);
}

// Preset for villa detail header/slideshow
export function getHeaderImageUrl(url: string): string {
  const optimized = getOptimizedImageUrl(url, {
    width: 1400,
    quality: 'auto:good',
    format: 'auto',
    crop: 'limit'
  });
  return addWatermarkTransform(optimized, 280);
}

// Preset for gallery images
export function getGalleryImageUrl(url: string): string {
  const optimized = getOptimizedImageUrl(url, {
    width: 1000,
    quality: 'auto',
    format: 'auto',
    crop: 'limit'
  });
  return addWatermarkTransform(optimized, 220);
}

// Preset for gallery thumbnails
export function getThumbnailUrl(url: string): string {
  const optimized = getOptimizedImageUrl(url, {
    width: 150,
    height: 100,
    quality: 'auto:eco',
    format: 'auto',
    crop: 'fill'
  });
  // No watermark on tiny thumbnails - too small
  return optimized;
}
