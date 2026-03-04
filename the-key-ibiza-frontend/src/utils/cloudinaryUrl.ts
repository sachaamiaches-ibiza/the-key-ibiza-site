// Cloudinary image optimization utility
// Watermarks temporarily disabled - need to configure logo in Cloudinary first

const CLOUDINARY_CLOUD_NAME = 'drxf80sho';

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
  // Return as-is for Cloudinary URLs (already optimized)
  if (!originalUrl || originalUrl.includes('cloudinary.com')) {
    return originalUrl;
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

// Preset for villa card thumbnails
export function getCardImageUrl(url: string): string {
  if (url.includes('cloudinary.com')) return url;
  return getOptimizedImageUrl(url, {
    width: 600,
    quality: 'auto',
    format: 'auto',
    crop: 'limit'
  });
}

// Preset for villa detail header/slideshow
export function getHeaderImageUrl(url: string): string {
  if (url.includes('cloudinary.com')) return url;
  return getOptimizedImageUrl(url, {
    width: 1400,
    quality: 'auto:good',
    format: 'auto',
    crop: 'limit'
  });
}

// Preset for gallery images
export function getGalleryImageUrl(url: string): string {
  if (url.includes('cloudinary.com')) return url;
  return getOptimizedImageUrl(url, {
    width: 1000,
    quality: 'auto',
    format: 'auto',
    crop: 'limit'
  });
}

// Preset for gallery thumbnails
export function getThumbnailUrl(url: string): string {
  if (url.includes('cloudinary.com')) return url;
  return getOptimizedImageUrl(url, {
    width: 150,
    height: 100,
    quality: 'auto:eco',
    format: 'auto',
    crop: 'fill'
  });
}
