// Cloudinary image optimization utility
// ALL images include The Key Ibiza watermark embedded via Cloudinary fetch

const CLOUDINARY_CLOUD_NAME = 'drxf80sho';
const WATERMARK_LOGO = 'watermark_logo';
const WATERMARK_OPACITY = 40;

/**
 * Add watermark to ANY image URL using Cloudinary's fetch feature
 * Works with: Cloudinary URLs, Azure URLs, any external URL
 */
export function addWatermark(url: string, logoWidth: number = 150): string {
  if (!url) return url;

  // Skip data/blob URLs
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  // If it's already a Cloudinary URL with transformation, extract the original
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    // Add watermark transformation to existing Cloudinary URL
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex !== -1) {
      const beforeUpload = url.substring(0, uploadIndex + 8);
      const afterUpload = url.substring(uploadIndex + 8);
      const watermarkTransform = `l_${WATERMARK_LOGO},w_${logoWidth},o_${WATERMARK_OPACITY},g_center`;
      return `${beforeUpload}${watermarkTransform}/${afterUpload}`;
    }
  }

  // For external URLs (Azure, etc), use Cloudinary fetch with watermark overlay
  const transforms = [
    `l_${WATERMARK_LOGO}`,
    `w_${logoWidth}`,
    `o_${WATERMARK_OPACITY}`,
    `g_center`,
    `fl_layer_apply`
  ].join(',');

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/${transforms}/${encodeURIComponent(url)}`;
}

// Preset for villa card thumbnails - small watermark
export function getCardImageUrl(url: string): string {
  return addWatermark(url, 100);
}

// Preset for villa detail header/slideshow - large watermark
export function getHeaderImageUrl(url: string): string {
  return addWatermark(url, 250);
}

// Preset for gallery images - medium watermark
export function getGalleryImageUrl(url: string): string {
  return addWatermark(url, 200);
}

// Preset for gallery thumbnails - small watermark
export function getThumbnailUrl(url: string): string {
  return addWatermark(url, 80);
}

// Get URL WITHOUT watermark (for white-label mode)
export function getImageUrlNoWatermark(url: string): string {
  return url;
}
