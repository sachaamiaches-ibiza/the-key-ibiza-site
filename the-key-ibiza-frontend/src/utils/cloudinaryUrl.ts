// Cloudinary image optimization utility
// ALL images include watermark embedded - downloads have logo baked in

const CLOUDINARY_CLOUD_NAME = 'drxf80sho';
const LOGO_PUBLIC_ID = 'THE_KEY_IBIZA_LOGO:logo';
const WATERMARK_OPACITY = 35; // Subtle but visible

interface CloudinaryOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | 'auto:low' | 'auto:eco' | 'auto:good' | 'auto:best' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  crop?: 'fill' | 'fit' | 'scale' | 'limit';
  watermark?: boolean;
  watermarkSize?: number;
}

/**
 * Add watermark transformation to a Cloudinary URL
 */
function addWatermark(url: string, logoWidth: number = 150): string {
  if (!url || !url.includes('cloudinary.com')) return url;

  // Watermark: logo centered with opacity
  const watermarkTransform = `l_${LOGO_PUBLIC_ID},w_${logoWidth},o_${WATERMARK_OPACITY},g_center`;

  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  const beforeUpload = url.substring(0, uploadIndex + 8);
  const afterUpload = url.substring(uploadIndex + 8);

  // Check if there are existing transformations
  if (afterUpload.startsWith('v') || afterUpload.match(/^[a-z]_/)) {
    // Insert watermark before existing transforms
    return `${beforeUpload}${watermarkTransform}/${afterUpload}`;
  }

  return `${beforeUpload}${watermarkTransform}/${afterUpload}`;
}

export function getOptimizedImageUrl(
  originalUrl: string,
  options: CloudinaryOptions = {}
): string {
  if (!originalUrl) return originalUrl;

  // If already a Cloudinary URL, add watermark and return
  if (originalUrl.includes('cloudinary.com')) {
    const { watermark = true, watermarkSize = 150 } = options;
    return watermark ? addWatermark(originalUrl, watermarkSize) : originalUrl;
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
    crop = 'limit',
    watermark = true,
    watermarkSize = 150
  } = options;

  // Build transformation string
  const transforms: string[] = [];

  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (crop) transforms.push(`c_${crop}`);
  transforms.push(`q_${quality}`);
  transforms.push(`f_${format}`);

  // Add watermark for external URLs via fetch
  if (watermark) {
    transforms.push(`l_${LOGO_PUBLIC_ID}`);
    transforms.push(`w_${watermarkSize}`);
    transforms.push(`o_${WATERMARK_OPACITY}`);
    transforms.push(`g_center`);
    transforms.push(`fl_layer_apply`);
  }

  const transformString = transforms.join(',');

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/${transformString}/${encodeURIComponent(originalUrl)}`;
}

// Preset for villa card thumbnails - small watermark
export function getCardImageUrl(url: string): string {
  if (url.includes('cloudinary.com')) {
    return addWatermark(url, 80); // Small logo for cards
  }
  return getOptimizedImageUrl(url, {
    width: 600,
    quality: 'auto',
    format: 'auto',
    crop: 'limit',
    watermark: true,
    watermarkSize: 80
  });
}

// Preset for villa detail header/slideshow - large watermark
export function getHeaderImageUrl(url: string): string {
  if (url.includes('cloudinary.com')) {
    return addWatermark(url, 200); // Large logo for headers
  }
  return getOptimizedImageUrl(url, {
    width: 1400,
    quality: 'auto:good',
    format: 'auto',
    crop: 'limit',
    watermark: true,
    watermarkSize: 200
  });
}

// Preset for gallery images - medium watermark
export function getGalleryImageUrl(url: string): string {
  if (url.includes('cloudinary.com')) {
    return addWatermark(url, 150); // Medium logo for gallery
  }
  return getOptimizedImageUrl(url, {
    width: 1000,
    quality: 'auto',
    format: 'auto',
    crop: 'limit',
    watermark: true,
    watermarkSize: 150
  });
}

// Preset for gallery thumbnails - tiny watermark
export function getThumbnailUrl(url: string): string {
  if (url.includes('cloudinary.com')) {
    return addWatermark(url, 50); // Tiny logo for thumbs
  }
  return getOptimizedImageUrl(url, {
    width: 150,
    height: 100,
    quality: 'auto:eco',
    format: 'auto',
    crop: 'fill',
    watermark: true,
    watermarkSize: 50
  });
}

// Get URL WITHOUT watermark (for specific cases like wishlist white-label)
export function getImageUrlNoWatermark(url: string): string {
  return url; // Return original, no transformation
}
