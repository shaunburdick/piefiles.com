import { LitElement, html, css } from 'lit'
import { APP_NAME, APP_TAGLINE } from '../config.js'

export class PieHeader extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    
    .header {
      background-color: var(--color-header-bg, #C89D5F);
      border-bottom: 1px solid var(--color-border, #000000);
      padding: 16px;
    }
    
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
    }
    
    .logo {
      text-align: center;
    }
    
    .logo h1 {
      color: var(--color-primary-text, #543F20);
      font-size: 24px;
      margin: 0;
      font-weight: bold;
    }
    
    .logo a {
      color: var(--color-primary-text, #543F20);
      text-decoration: none;
    }
    
    .logo a:hover {
      color: var(--color-link-hover, #FFFFFF);
    }
    
    .tagline {
      color: var(--color-primary-text, #543F20);
      font-size: 11px;
      margin: 4px 0 0 0;
    }
    
    .search-form {
      display: flex;
      gap: 8px;
      width: 100%;
    }
    
    .search-input {
      flex: 1;
      padding: 6px 12px;
      font-size: 12px;
      font-family: Arial, sans-serif;
      background-color: var(--color-content-bg, #D0AA68);
      color: var(--color-primary-text, #543F20);
      border: 1px solid var(--color-white, #FFFFFF);
    }
    
    .search-button {
      padding: 6px 20px;
      font-size: 12px;
      font-family: Arial, sans-serif;
      background-color: var(--color-accent-brown, #C89D5F);
      color: var(--color-white, #FFFFFF);
      border: 1px solid var(--color-white, #FFFFFF);
      cursor: pointer;
    }
    
    .search-button:hover {
      background-color: var(--color-accent-brown-alt, #AD915F);
    }
    
    @media (min-width: 768px) {
      .header-content {
        flex-direction: row;
        justify-content: space-between;
      }
      
      .logo {
        text-align: left;
      }
      
      .search-form {
        width: auto;
        min-width: 300px;
      }
    }
    
    @media (min-width: 1024px) {
      .search-form {
        min-width: 400px;
      }
    }
  `

  static properties = {
    searchQuery: { type: String }
  }

  constructor() {
    super()
    this.searchQuery = ''
    this.searchTimeout = null
  }

  handleSearchInput(e) {
    this.searchQuery = e.target.value
    
    // Debounce search (300ms)
    clearTimeout(this.searchTimeout)
    this.searchTimeout = setTimeout(() => {
      this.dispatchSearch()
    }, 300)
  }

  handleSearchSubmit(e) {
    e.preventDefault()
    clearTimeout(this.searchTimeout)
    this.dispatchSearch()
  }

  dispatchSearch() {
    this.dispatchEvent(new CustomEvent('search', {
      detail: { query: this.searchQuery },
      bubbles: true,
      composed: true
    }))
  }

  handleLogoClick(e) {
    e.preventDefault()
    this.dispatchEvent(new CustomEvent('navigate-home', {
      bubbles: true,
      composed: true
    }))
  }

  render() {
    return html`
      <header class="header">
        <div class="header-content">
          <div class="logo">
            <h1>
              <a href="/" @click=${this.handleLogoClick}>
                🥧 ${APP_NAME}
              </a>
            </h1>
            <p class="tagline">${APP_TAGLINE}</p>
          </div>
          
          <form class="search-form" @submit=${this.handleSearchSubmit}>
            <input
              type="search"
              class="search-input"
              placeholder="Search games..."
              .value=${this.searchQuery}
              @input=${this.handleSearchInput}
            />
            <button type="submit" class="search-button">Search</button>
          </form>
        </div>
      </header>
    `
  }
}

customElements.define('pie-header', PieHeader)
