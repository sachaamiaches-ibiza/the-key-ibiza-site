// Cloudinary image optimization utility
// Transforms external image URLs to use Cloudinary's fetch and optimization
// Includes watermark overlay for all images

const CLOUDINARY_CLOUD_NAME = 'drxf80sho';

// Watermark text overlay configuration
const WATERMARK_TEXT = 'THE KEY IBIZA';
const WATERMARK_FONT = 'Arial'; // Using Arial for better Cloudinary support
const WATERMARK_OPACITY = 40;

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

// Helper to add watermark transformation
function addWatermarkTransform(baseTransforms: string, fontSize: number): string {
  const watermark = `l_text:${WATERMARK_FONT}_${fontSize}_bold:${encodeURIComponent(WATERMARK_TEXT)},co_rgb:ffffff,o_${WATERMARK_OPACITY},g_center`;
  return baseTransforms ? `${baseTransforms}/${watermark}` : watermark;
}

// Preset for villa card thumbnails (listing page)
export function getCardImageUrl(url: string): string {
  const baseUrl = getOptimizedImageUrl(url, {
    width: 600,
    quality: 'auto',
    format: 'auto',
    crop: 'limit'
  });
  // Add watermark for card images
  if (baseUrl.includes('/fetch/')) {
    return baseUrl.replace('/fetch/', `/fetch/l_text:${WATERMARK_FONT}_30_bold:${encodeURIComponent(WATERMARK_TEXT)},co_rgb:ffffff,o_${WATERMARK_OPACITY},g_center/`);
  }
  return baseUrl;
}

// Preset for villa detail header/slideshow
export function getHeaderImageUrl(url: string): string {
  const baseUrl = getOptimizedImageUrl(url, {
    width: 1400,
    quality: 'auto:good',
    format: 'auto',
    crop: 'limit'
  });
  // Add watermark for header images
  if (baseUrl.includes('/fetch/')) {
    return baseUrl.replace('/fetch/', `/fetch/l_text:${WATERMARK_FONT}_60_bold:${encodeURIComponent(WATERMARK_TEXT)},co_rgb:ffffff,o_${WATERMARK_OPACITY},g_center/`);
  }
  return baseUrl;
}

// Preset for gallery images
export function getGalleryImageUrl(url: string): string {
  const baseUrl = getOptimizedImageUrl(url, {
    width: 1000,
    quality: 'auto',
    format: 'auto',
    crop: 'limit'
  });
  // Add watermark for gallery images
  if (baseUrl.includes('/fetch/')) {
    return baseUrl.replace('/fetch/', `/fetch/l_text:${WATERMARK_FONT}_50_bold:${encodeURIComponent(WATERMARK_TEXT)},co_rgb:ffffff,o_${WATERMARK_OPACITY},g_center/`);
  }
  return baseUrl;
}

// Preset for gallery thumbnails
export function getThumbnailUrl(url: string): string {
  const baseUrl = getOptimizedImageUrl(url, {
    width: 150,
    height: 100,
    quality: 'auto:eco',
    format: 'auto',
    crop: 'fill'
  });
  // Add small watermark for thumbnails
  if (baseUrl.includes('/fetch/')) {
    return baseUrl.replace('/fetch/', `/fetch/l_text:${WATERMARK_FONT}_12_bold:${encodeURIComponent(WATERMARK_TEXT)},co_rgb:ffffff,o_${WATERMARK_OPACITY},g_center/`);
  }
  return baseUrl;
}
