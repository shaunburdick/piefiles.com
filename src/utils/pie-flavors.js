/**
 * Pie flavor themes with color palettes
 * @module pie-flavors
 */

export const PIE_FLAVORS = {
  apple: {
    name: '🍎 Apple',
    colors: {
      '--color-accent-brown': '#C89D5F',
      '--color-accent-brown-alt': '#AD915F',
    },
  },
  cherry: {
    name: '🍒 Cherry',
    colors: {
      '--color-accent-brown': '#D64545',
      '--color-accent-brown-alt': '#A83737',
    },
  },
  blueberry: {
    name: '🫐 Blueberry',
    colors: {
      '--color-accent-brown': '#5B7FB8',
      '--color-accent-brown-alt': '#4A6694',
    },
  },
  pumpkin: {
    name: '🎃 Pumpkin',
    colors: {
      '--color-accent-brown': '#E9862C',
      '--color-accent-brown-alt': '#C47024',
    },
  },
  lemon: {
    name: '🍋 Lemon',
    colors: {
      '--color-accent-brown': '#E8D14E',
      '--color-accent-brown-alt': '#C4AD3F',
    },
  },
  pecan: {
    name: '🥧 Pecan',
    colors: {
      '--color-accent-brown': '#8B6834',
      '--color-accent-brown-alt': '#6F5329',
    },
  },
}

export const DEFAULT_FLAVOR = 'apple'

/**
 * Apply a flavor theme to the document
 * @param {string} flavorId - Flavor ID from PIE_FLAVORS
 */
export function applyFlavor(flavorId) {
  const flavor = PIE_FLAVORS[flavorId] || PIE_FLAVORS[DEFAULT_FLAVOR]
  const root = document.documentElement

  Object.entries(flavor.colors).forEach(([property, value]) => {
    root.style.setProperty(property, value)
  })

  // Store in localStorage
  localStorage.setItem('pie-flavor', flavorId)
}

/**
 * Get the currently active flavor from localStorage
 * @returns {string} Flavor ID
 */
export function getCurrentFlavor() {
  return localStorage.getItem('pie-flavor') || DEFAULT_FLAVOR
}
