/**
 * Cloudinary Watermark Utility
 * Transforms Cloudinary URLs to include the logo watermark overlay
 * The watermark is embedded in the image, so downloads include it
 *
 * USAGE: Import and call addCloudinaryWatermark(url, size) on image URLs
 * This is prepared for future implementation when download watermarks are needed.
 */

// Logo configuration - using uploaded logo from "THE KEY IBIZA LOGO" folder
// The public_id uses colons instead of slashes for Cloudinary overlay syntax
const LOGO_PUBLIC_ID = 'THE_KEY_IBIZA_LOGO:logo';
const WATERMARK_OPACITY = 50; // 0-100

/**
 * Add logo watermark to a Cloudinary URL
 * @param url - Original Cloudinary image URL
 * @param size - Size of watermark: 'small', 'medium', 'large', 'gallery'
 * @returns URL with logo watermark transformation
 */
export function addCloudinaryWatermark(
  url: string,
  size: 'small' | 'medium' | 'large' | 'gallery' = 'medium'
): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url; // Return unchanged if not a Cloudinary URL
  }

  // Size configurations - width of logo
  const sizeConfig = {
    small: { width: 100 },
    medium: { width: 180 },
    large: { width: 280 },
    gallery: { width: 220 },
  };

  const config = sizeConfig[size];

  // Logo overlay transformation
  // Format: l_<public_id>,w_<width>,o_<opacity>,g_center,fl_layer_apply
  const watermarkTransform = `l_${LOGO_PUBLIC_ID},w_${config.width},o_${WATERMARK_OPACITY},g_center/fl_layer_apply`;

  // Find the upload/ part of the URL and insert transformation after it
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) {
    return url; // Not a standard Cloudinary URL
  }

  const beforeUpload = url.substring(0, uploadIndex + 8); // includes '/upload/'
  const afterUpload = url.substring(uploadIndex + 8);

  // Insert watermark transformation
  return `${beforeUpload}${watermarkTransform}/${afterUpload}`;
}

/**
 * Add watermark to external URL via Cloudinary fetch
 * For non-Cloudinary URLs that need watermarking
 * @param url - External image URL
 * @param size - Size of watermark
 * @returns Cloudinary fetch URL with watermark
 */
export function addWatermarkToExternalUrl(
  url: string,
  size: 'small' | 'medium' | 'large' | 'gallery' = 'medium'
): string {
  if (!url || url.includes('cloudinary.com')) {
    // If already Cloudinary, use the standard function
    return addCloudinaryWatermark(url, size);
  }

  const sizeConfig = {
    small: { width: 100 },
    medium: { width: 180 },
    large: { width: 280 },
    gallery: { width: 220 },
  };

  const config = sizeConfig[size];
  const CLOUD_NAME = 'drxf80sho';

  // Fetch URL with watermark overlay
  const transforms = `l_${LOGO_PUBLIC_ID},w_${config.width},o_${WATERMARK_OPACITY},g_center/fl_layer_apply`;

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/${transforms}/${encodeURIComponent(url)}`;
}

export default addCloudinaryWatermark;
