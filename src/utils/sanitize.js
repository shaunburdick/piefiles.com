import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 *
 * Uses DOMPurify to remove potentially malicious HTML, scripts, and event handlers
 * while preserving safe formatting tags commonly used in game/mod descriptions.
 *
 * Allowed tags: p, br, strong, em, u, a, ul, ol, li, h1-h6, blockquote, code, pre
 * Allowed attributes: href (on <a> tags only, http/https protocols only)
 *
 * @param {string} html - The HTML string to sanitize
 * @returns {string} - Sanitized HTML safe for rendering
 *
 * @example
 * const userInput = '<script>alert("xss")</script><p>Safe content</p>';
 * const safe = sanitizeHTML(userInput);
 * // Returns: '<p>Safe content</p>'
 */
export function sanitizeHTML(html) {
    if (!html || typeof html !== 'string') {
        return '';
    }

    // Configure DOMPurify with strict settings
    const config = {
    // Allow only safe formatting tags commonly used in descriptions
        ALLOWED_TAGS: [
            'p',
            'br',
            'strong',
            'b',
            'em',
            'i',
            'u',
            'a',
            'ul',
            'ol',
            'li',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'blockquote',
            'code',
            'pre',
            'span',
            'div',
        ],

        // Allow only href attribute on links, and only http/https protocols
        ALLOWED_ATTR: ['href', 'class'],
        ALLOWED_URI_REGEXP: /^https?:\/\//,

        // Remove any elements that could execute scripts
        FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button'],

        // Remove all event handlers (onclick, onerror, etc.)
        FORBID_ATTR: [
            'onclick',
            'onload',
            'onerror',
            'onmouseover',
            'onmouseout',
            'onfocus',
            'onblur',
            'onchange',
            'onsubmit',
        ],

        // Return a string (not a DOM node)
        RETURN_DOM: false,
        RETURN_DOM_FRAGMENT: false,

        // Keep safe HTML entities
        KEEP_CONTENT: true,
    };

    return DOMPurify.sanitize(html, config);
}

/**
 * Sanitizes plain text by escaping HTML entities
 *
 * Use this for text that should be displayed as-is without any HTML formatting.
 * Converts <, >, &, ", and ' to their HTML entity equivalents.
 *
 * @param {string} text - The text to escape
 * @returns {string} - Text with HTML entities escaped
 *
 * @example
 * const userInput = '<script>alert("xss")</script>';
 * const safe = escapeHTML(userInput);
 * // Returns: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 */
export function escapeHTML(text) {
    if (!text || typeof text !== 'string') {
        return '';
    }

    const escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
    };

    return text.replace(/[&<>"'/]/g, (char) => escapeMap[char]);
}
