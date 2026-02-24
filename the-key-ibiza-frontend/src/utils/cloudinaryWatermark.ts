/**
 * Cloudinary Watermark Utility
 * Transforms Cloudinary URLs to include a watermark overlay
 * The watermark is embedded in the image, so downloads include it
 */

// Watermark configuration - using Cloudinary text overlay
// To use a logo image instead, upload it to Cloudinary and use: l_<public_id>
const WATERMARK_TEXT = 'THE KEY IBIZA';
const WATERMARK_FONT = 'Playfair Display';
const WATERMARK_OPACITY = 40; // 0-100

/**
 * Add watermark transformation to a Cloudinary URL
 * @param url - Original Cloudinary image URL
 * @param size - Size of watermark: 'small', 'medium', 'large'
 * @returns URL with watermark transformation
 */
export function addCloudinaryWatermark(
  url: string,
  size: 'small' | 'medium' | 'large' | 'gallery' = 'medium'
): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url; // Return unchanged if not a Cloudinary URL
  }

  // Size configurations for text
  const sizeConfig = {
    small: { fontSize: 30, spacing: 8 },
    medium: { fontSize: 50, spacing: 12 },
    large: { fontSize: 80, spacing: 16 },
    gallery: { fontSize: 60, spacing: 14 },
  };

  const config = sizeConfig[size];

  // Cloudinary text overlay transformation
  // Format: l_text:<font>_<size>:<text>,co_rgb:ffffff,o_<opacity>,g_center
  const watermarkTransform = `l_text:${encodeURIComponent(WATERMARK_FONT)}_${config.fontSize}_bold:${encodeURIComponent(WATERMARK_TEXT)},co_rgb:ffffff,o_${WATERMARK_OPACITY},g_center`;

  // Find the upload/ part of the URL and insert transformation after it
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) {
    return url; // Not a standard Cloudinary URL
  }

  const beforeUpload = url.substring(0, uploadIndex + 8); // includes '/upload/'
  const afterUpload = url.substring(uploadIndex + 8);

  // Check if there are already transformations
  if (afterUpload.startsWith('v') && /^v\d+\//.test(afterUpload)) {
    // Has version, insert before version
    return `${beforeUpload}${watermarkTransform}/${afterUpload}`;
  } else if (afterUpload.includes('/')) {
    // Has other transformations, append to them
    const firstSlash = afterUpload.indexOf('/');
    const existingTransforms = afterUpload.substring(0, firstSlash);
    const rest = afterUpload.substring(firstSlash + 1);
    return `${beforeUpload}${existingTransforms},${watermarkTransform}/${rest}`;
  } else {
    // No transformations, just add it
    return `${beforeUpload}${watermarkTransform}/${afterUpload}`;
  }
}

/**
 * Add watermark with logo overlay (requires logo uploaded to Cloudinary)
 * @param url - Original Cloudinary image URL
 * @param logoPublicId - Public ID of the logo in Cloudinary
 * @param size - Size of watermark
 * @returns URL with logo watermark
 */
export function addCloudinaryLogoWatermark(
  url: string,
  logoPublicId: string = 'the-key-ibiza-watermark',
  size: 'small' | 'medium' | 'large' | 'gallery' = 'medium'
): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const sizeConfig = {
    small: { width: 80, opacity: 50 },
    medium: { width: 150, opacity: 45 },
    large: { width: 250, opacity: 40 },
    gallery: { width: 200, opacity: 45 },
  };

  const config = sizeConfig[size];

  // Logo overlay transformation
  const watermarkTransform = `l_${logoPublicId},w_${config.width},o_${config.opacity},g_center`;

  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) {
    return url;
  }

  const beforeUpload = url.substring(0, uploadIndex + 8);
  const afterUpload = url.substring(uploadIndex + 8);

  if (afterUpload.startsWith('v') && /^v\d+\//.test(afterUpload)) {
    return `${beforeUpload}${watermarkTransform}/${afterUpload}`;
  } else {
    return `${beforeUpload}${watermarkTransform}/${afterUpload}`;
  }
}

export default addCloudinaryWatermark;
