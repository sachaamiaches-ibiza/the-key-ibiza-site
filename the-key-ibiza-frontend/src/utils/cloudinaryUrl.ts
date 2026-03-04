// Cloudinary image optimization utility
// ALL images include The Key Ibiza watermark embedded

const CLOUDINARY_CLOUD_NAME = 'drxf80sho';
const WATERMARK_LOGO = 'watermark_logo'; // Public ID in Cloudinary
const WATERMARK_OPACITY = 40; // 0-100, subtle but visible

interface CloudinaryOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | 'auto:low' | 'auto:eco' | 'auto:good' | 'auto:best' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  crop?: 'fill' | 'fit' | 'scale' | 'limit';
}

/**
 * Add watermark to a Cloudinary URL
 * @param url - Original Cloudinary image URL
 * @param logoWidth - Width of watermark logo in pixels
 */
function addWatermark(url: string, logoWidth: number = 150): string {
  if (!url || !url.includes('cloudinary.com')) return url;

  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  // Watermark transformation: overlay logo, centered, with opacity
  const watermarkTransform = `l_${WATERMARK_LOGO},w_${logoWidth},o_${WATERMARK_OPACITY},g_center`;

  const beforeUpload = url.substring(0, uploadIndex + 8); // includes '/upload/'
  const afterUpload = url.substring(uploadIndex + 8);

  return `${beforeUpload}${watermarkTransform}/${afterUpload}`;
}

export function getOptimizedImageUrl(
  originalUrl: string,
  options: CloudinaryOptions = {}
): string {
  if (!originalUrl) return originalUrl;

  // If already Cloudinary URL, add watermark
  if (originalUrl.includes('cloudinary.com')) {
    return addWatermark(originalUrl, 150);
  }

  // Skip data/blob URLs
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

  const transforms: string[] = [];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (crop) transforms.push(`c_${crop}`);
  transforms.push(`q_${quality}`);
  transforms.push(`f_${format}`);

  const transformString = transforms.join(',');

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/${transformString}/${encodeURIComponent(originalUrl)}`;
}

// Preset for villa card thumbnails - small watermark
export function getCardImageUrl(url: string): string {
  if (url.includes('cloudinary.com')) {
    return addWatermark(url, 100);
  }
  return getOptimizedImageUrl(url, {
    width: 600,
    quality: 'auto',
    format: 'auto',
    crop: 'limit'
  });
}

// Preset for villa detail header/slideshow - large watermark
export function getHeaderImageUrl(url: string): string {
  if (url.includes('cloudinary.com')) {
    return addWatermark(url, 250);
  }
  return getOptimizedImageUrl(url, {
    width: 1400,
    quality: 'auto:good',
    format: 'auto',
    crop: 'limit'
  });
}

// Preset for gallery images - medium watermark
export function getGalleryImageUrl(url: string): string {
  if (url.includes('cloudinary.com')) {
    return addWatermark(url, 200);
  }
  return getOptimizedImageUrl(url, {
    width: 1000,
    quality: 'auto',
    format: 'auto',
    crop: 'limit'
  });
}

// Preset for gallery thumbnails - small watermark
export function getThumbnailUrl(url: string): string {
  if (url.includes('cloudinary.com')) {
    return addWatermark(url, 60);
  }
  return getOptimizedImageUrl(url, {
    width: 150,
    height: 100,
    quality: 'auto:eco',
    format: 'auto',
    crop: 'fill'
  });
}

// Get URL WITHOUT watermark (for white-label mode)
export function getImageUrlNoWatermark(url: string): string {
  return url;
}
