/**
 * Cloudinary Watermark Utility
 * Transforms Cloudinary URLs to include the logo watermark overlay
 * The watermark is embedded in the image, so downloads include it
 */

// Logo configuration - using uploaded logo from "THE KEY IBIZA LOGO" folder
// The public_id format for folders is: folder_name/image_name (spaces become underscores in some cases)
const LOGO_PUBLIC_ID = 'THE_KEY_IBIZA_LOGO/logo'; // Adjust if the actual filename is different

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

  // Size configurations - width of logo and opacity
  const sizeConfig = {
    small: { width: 100, opacity: 50 },
    medium: { width: 180, opacity: 50 },
    large: { width: 280, opacity: 50 },
    gallery: { width: 220, opacity: 50 },
  };

  const config = sizeConfig[size];

  // Logo overlay transformation
  // Format: l_<public_id>,w_<width>,o_<opacity>,g_center
  // fl_layer_apply applies the overlay
  const watermarkTransform = `l_${LOGO_PUBLIC_ID.replace(/\//g, ':')},w_${config.width},o_${config.opacity},g_center,fl_layer_apply`;

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

export default addCloudinaryWatermark;
