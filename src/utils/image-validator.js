/**
 * Validates image URLs to prevent loading malicious content
 *
 * Ensures that image URLs come from trusted domains and use secure protocols.
 * This prevents loading images from untrusted sources that could be used for
 * tracking, phishing, or serving malicious content.
 */

/**
 * List of allowed image domains for the GameFront API
 *
 * Only images from these domains will be loaded.
 * All URLs must use HTTPS protocol.
 */
const ALLOWED_IMAGE_DOMAINS = [
  'osiris.gamefront.com', // GameFront's image CDN
  'www.gamefront.com', // GameFront main domain
  'gamefront.com', // GameFront root domain
]

/**
 * Default placeholder image path (local to the site)
 */
const PLACEHOLDER_IMAGE = '/placeholder.png'

/**
 * Validates an image URL against the whitelist of allowed domains
 *
 * @param {string} url - The image URL to validate
 * @returns {boolean} - True if the URL is from an allowed domain, false otherwise
 *
 * @example
 * isValidImageURL('https://osiris.gamefront.com/image.jpg'); // true
 * isValidImageURL('https://evil.com/image.jpg'); // false
 * isValidImageURL('http://osiris.gamefront.com/image.jpg'); // false (not HTTPS)
 */
export function isValidImageURL(url) {
  if (!url || typeof url !== 'string') {
    return false
  }

  try {
    const parsedURL = new URL(url)

    // Must use HTTPS protocol
    if (parsedURL.protocol !== 'https:') {
      return false
    }

    // Check if hostname is in the allowed list
    const hostname = parsedURL.hostname.toLowerCase()
    return ALLOWED_IMAGE_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    )
  } catch {
    // Invalid URL format
    return false
  }
}

/**
 * Returns a safe image URL or a placeholder if the URL is invalid
 *
 * Use this function whenever rendering images from external sources.
 * If the URL is not from an allowed domain, returns a placeholder instead.
 *
 * @param {string} url - The image URL to validate
 * @param {string} [fallback] - Optional fallback URL (must also be validated)
 * @returns {string} - The validated URL or a placeholder
 *
 * @example
 * const safeURL = getSafeImageURL(game.box_art);
 * // Returns the URL if valid, or placeholder if not
 */
export function getSafeImageURL(url, fallback = null) {
  // Try primary URL first
  if (isValidImageURL(url)) {
    return url
  }

  // Try fallback URL if provided
  if (fallback && isValidImageURL(fallback)) {
    return fallback
  }

  // Return placeholder for invalid URLs
  return PLACEHOLDER_IMAGE
}

/**
 * Validates multiple image URLs and returns the first valid one
 *
 * Useful when you have multiple potential image sources (e.g., box_art, thumbnail, etc.)
 *
 * @param {string[]} urls - Array of image URLs to validate
 * @returns {string} - The first valid URL or a placeholder if none are valid
 *
 * @example
 * const safeURL = getFirstValidImageURL([game.box_art, game.thumbnail, game.icon]);
 */
export function getFirstValidImageURL(urls) {
  if (!Array.isArray(urls)) {
    return PLACEHOLDER_IMAGE
  }

  for (const url of urls) {
    if (isValidImageURL(url)) {
      return url
    }
  }

  return PLACEHOLDER_IMAGE
}
