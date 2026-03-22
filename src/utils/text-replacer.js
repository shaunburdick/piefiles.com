/**
 * Text Replacer Utility
 * Replaces "file" with "pie" throughout text nodes, preserving case
 * @module text-replacer
 */

/**
 * Replace "file" with "pie" in text, preserving case
 * Examples: file→pie, File→Pie, FILE→PIE, files→pies, Files→Pies, FILES→PIES
 *
 * @param {string} text - The text to process
 * @returns {string} Text with replacements applied
 */
export function replaceFileWithPie(text) {
  // Match "file" or "files" with word boundaries, case-insensitive
  return text.replace(/\b(f|F)(ile|ILE)(s|S)?\b/g, (match, f, ile, s) => {
    // Determine case of each part
    const isUpperF = f === 'F'
    const isUpperILE = ile === 'ILE'
    const isUpperS = s === 'S'

    // Build replacement
    let result = isUpperF ? 'P' : 'p'
    result += isUpperILE ? 'IE' : 'ie'
    if (s) {
      result += isUpperS ? 'S' : 's'
    }

    return result
  })
}

/**
 * Replace text in all text nodes of a DOM element
 * Only processes TEXT_NODE types, preserving HTML structure and attributes
 *
 * @param {HTMLElement} element - Root element to process
 */
export function replaceTextInElement(element) {
  if (!element) return

  // Use TreeWalker to efficiently traverse text nodes only
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      // Skip script and style tags
      const parent = node.parentElement
      if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE')) {
        return NodeFilter.FILTER_REJECT
      }
      // Only process nodes with text content
      return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    },
  })

  const nodesToReplace = []
  let node

  // Collect all text nodes first (don't modify during traversal)
  while ((node = walker.nextNode())) {
    nodesToReplace.push(node)
  }

  // Now replace text in collected nodes
  nodesToReplace.forEach((textNode) => {
    const original = textNode.textContent
    const replaced = replaceFileWithPie(original)
    if (replaced !== original) {
      textNode.textContent = replaced
    }
  })
}

/**
 * Apply text replacement to an element and observe future changes
 * Useful for dynamic content that updates after initial render
 *
 * @param {HTMLElement} element - Element to observe
 * @returns {MutationObserver} Observer instance (call .disconnect() to stop)
 */
export function observeAndReplace(element) {
  // Initial replacement
  replaceTextInElement(element)

  // Watch for future DOM changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            replaceTextInElement(node)
          } else if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = replaceFileWithPie(node.textContent)
          }
        })
      } else if (mutation.type === 'characterData') {
        mutation.target.textContent = replaceFileWithPie(mutation.target.textContent)
      }
    })
  })

  observer.observe(element, {
    childList: true,
    subtree: true,
    characterData: true,
  })

  return observer
}
