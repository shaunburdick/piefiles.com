import { LitElement, html, css } from 'lit';
import { APP_NAME, APP_TAGLINE } from '../config.js';
import { PIE_FLAVORS, applyFlavor, getCurrentFlavor } from '../utils/pie-flavors.js';

export class PieHeader extends LitElement {
    static styles = css`
    :host {
      display: block;
    }

    .header {
      background-color: var(--color-header-bg, #c89d5f);
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
      color: var(--color-primary-text, #543f20);
      font-size: 24px;
      margin: 0;
      font-weight: bold;
    }

    .logo a {
      color: var(--color-primary-text, #543f20);
      text-decoration: none;
    }

    .logo a:hover {
      color: var(--color-link-hover, #ffffff);
    }

    .tagline {
      color: var(--color-primary-text, #543f20);
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
      padding: 8px 16px;
      font-size: 12px;
      font-family: Arial, sans-serif;
      background-color: var(--color-content-bg, #d0aa68);
      color: var(--color-primary-text, #543f20);
      border: 2px solid var(--color-border, #000000);
      border-radius: 20px;
      box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.2);
    }

    .search-input:focus {
      outline: none;
      border-color: var(--color-accent-brown, #c89d5f);
      box-shadow:
        inset 1px 1px 3px rgba(0, 0, 0, 0.2),
        0 0 0 2px rgba(200, 157, 95, 0.3);
    }

    .search-button {
      padding: 8px 24px;
      font-size: 12px;
      font-family: Arial, sans-serif;
      background-color: var(--color-accent-brown, #c89d5f);
      color: var(--color-white, #ffffff);
      border: 2px solid var(--color-border, #000000);
      border-radius: 20px;
      cursor: pointer;
      box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.3);
      transition: all 0.2s ease;
    }

    .search-button:hover {
      background-color: var(--color-accent-brown-alt, #ad915f);
      transform: translateY(-2px);
      box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.3);
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

    .flavor-switcher {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
      justify-content: center;
      padding: 8px 0;
    }

    .flavor-label {
      color: var(--color-primary-text, #543f20);
      font-size: 11px;
      font-weight: bold;
      margin-right: 4px;
    }

    .flavor-button {
      padding: 6px 12px;
      font-size: 11px;
      font-family: Arial, sans-serif;
      background-color: var(--color-content-bg, #d0aa68);
      color: var(--color-primary-text, #543f20);
      border: 2px solid var(--color-border, #000000);
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
    }

    .flavor-button:hover {
      transform: translateY(-1px);
      box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.3);
    }

    .flavor-button.active {
      background-color: var(--color-accent-brown, #c89d5f);
      color: var(--color-white, #ffffff);
      font-weight: bold;
      box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.3);
    }
  `;

    static properties = {
        searchQuery: { type: String },
        currentFlavor: { type: String },
    };

    constructor() {
        super();
        this.searchQuery = '';
        this.searchTimeout = null;
        this.currentFlavor = getCurrentFlavor();
    }

    connectedCallback() {
        super.connectedCallback();
        // Apply the saved flavor on load
        applyFlavor(this.currentFlavor);
    }

    handleSearchInput(e) {
        this.searchQuery = e.target.value;

        // Debounce search (300ms)
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.dispatchSearch();
        }, 300);
    }

    handleSearchSubmit(e) {
        e.preventDefault();
        clearTimeout(this.searchTimeout);
        this.dispatchSearch();
    }

    dispatchSearch() {
        this.dispatchEvent(
            new CustomEvent('search', {
                detail: { query: this.searchQuery },
                bubbles: true,
                composed: true,
            })
        );
    }

    handleLogoClick(e) {
        e.preventDefault();
        this.dispatchEvent(
            new CustomEvent('navigate-home', {
                bubbles: true,
                composed: true,
            })
        );
    }

    handleFlavorChange(flavorId) {
        this.currentFlavor = flavorId;
        applyFlavor(flavorId);
    }

    render() {
        return html`
      <header class="header">
        <div class="header-content">
          <div class="logo">
            <h1>
              <a href="/" @click=${this.handleLogoClick}> 🥧 ${APP_NAME} </a>
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

        <div class="flavor-switcher">
          <span class="flavor-label">Pie Flavor:</span>
          ${Object.entries(PIE_FLAVORS).map(
                ([id, flavor]) => html`
              <button
                type="button"
                class="flavor-button ${this.currentFlavor === id ? 'active' : ''}"
                @click=${() => this.handleFlavorChange(id)}
              >
                ${flavor.name}
              </button>
            `
            )}
        </div>
      </header>
    `;
    }
}

customElements.define('pie-header', PieHeader);
