import { LitElement, html, css } from 'lit'
import { apiClient } from '../api/gamefront-client.js'
import { replaceTextInElement } from '../utils/text-replacer.js'
import './pie-spinner.js'

export class PieModDetail extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    
    .back-button {
      padding: 8px 16px;
      font-size: 12px;
      font-family: Arial, sans-serif;
      background-color: var(--color-accent-brown, #C89D5F);
      color: var(--color-white, #FFFFFF);
      border: 1px solid var(--color-white, #FFFFFF);
      cursor: pointer;
      margin-bottom: 24px;
      display: inline-block;
    }
    
    .back-button:hover {
      background-color: var(--color-accent-brown-alt, #AD915F);
    }
    
    .mod-header {
      background-color: var(--color-content-bg, #D0AA68);
      border: 1px solid var(--color-border, #000000);
      padding: 24px;
      margin-bottom: 24px;
    }
    
    .mod-header h1 {
      color: var(--color-primary-text, #543F20);
      font-size: 24px;
      margin: 0 0 16px 0;
    }
    
    .mod-meta {
      color: var(--color-primary-text, #543F20);
      font-size: 12px;
      margin-bottom: 16px;
      line-height: 1.8;
    }
    
    .mod-meta strong {
      font-weight: bold;
    }
    
    .download-button {
      padding: 12px 32px;
      font-size: 14px;
      font-family: Arial, sans-serif;
      background-color: var(--color-accent-brown, #C89D5F);
      color: var(--color-white, #FFFFFF);
      border: 2px solid var(--color-border, #000000);
      cursor: pointer;
      font-weight: bold;
      display: inline-block;
      text-decoration: none;
      margin-top: 16px;
    }
    
    .download-button:hover {
      background-color: var(--color-accent-brown-alt, #AD915F);
    }
    
    .game-info {
      background-color: var(--color-content-bg-alt, #B4A57E);
      padding: 12px;
      margin-bottom: 24px;
      border: 1px solid var(--color-border, #000000);
    }
    
    .game-info a {
      color: var(--color-primary-text, #543F20);
      text-decoration: underline;
      font-weight: bold;
    }
    
    .game-info a:hover {
      color: var(--color-link-hover, #FFFFFF);
    }
    
    .description-section {
      background-color: var(--color-content-bg, #D0AA68);
      border: 1px solid var(--color-border, #000000);
      padding: 24px;
      margin-bottom: 24px;
    }
    
    .description-section h2 {
      color: var(--color-primary-text, #543F20);
      font-size: 18px;
      margin: 0 0 12px 0;
    }
    
    .description-section p {
      color: var(--color-primary-text, #543F20);
      font-size: 12px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    
    .screenshots {
      margin-bottom: 24px;
    }
    
    .screenshots h2 {
      color: var(--color-primary-text, #543F20);
      font-size: 18px;
      margin-bottom: 16px;
    }
    
    .screenshots-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }
    
    .screenshot {
      border: 1px solid var(--color-border, #000000);
      cursor: pointer;
      transition: transform 0.2s;
    }
    
    .screenshot:hover {
      transform: scale(1.05);
    }
    
    .screenshot img {
      width: 100%;
      height: auto;
      display: block;
    }
    
    .error {
      background-color: #FFE5E5;
      color: #CC0000;
      padding: 16px;
      border: 1px solid #CC0000;
      margin-bottom: 16px;
    }
  `

  static properties = {
    modId: { type: String },
    mod: { type: Object },
    loading: { type: Boolean },
    error: { type: String }
  }

  constructor() {
    super()
    this.modId = ''
    this.mod = null
    this.loading = true
    this.error = ''
  }

  async connectedCallback() {
    super.connectedCallback()
    await this.loadMod()
  }

  async loadMod() {
    this.loading = true
    this.error = ''

    try {
      this.mod = await apiClient.getMod(this.modId)
    } catch (err) {
      console.error('Failed to load mod:', err)
      this.error = apiClient.getErrorMessage(err)
    } finally {
      this.loading = false
    }
  }

  handleBackClick() {
    this.dispatchEvent(new CustomEvent('navigate-back', {
      bubbles: true,
      composed: true
    }))
  }

  handleGameClick(e) {
    e.preventDefault()
    if (this.mod?.game) {
      this.dispatchEvent(new CustomEvent('game-selected', {
        detail: { slug: this.mod.game.slug },
        bubbles: true,
        composed: true
      }))
    }
  }

  formatDate(dateString) {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  formatFileSize(bytes) {
    if (!bytes) return 'Unknown size'
    const mb = bytes / (1024 * 1024)
    if (mb < 1) {
      const kb = bytes / 1024
      return `${kb.toFixed(2)} KB`
    }
    return `${mb.toFixed(2)} MB`
  }

  updated() {
    // Apply text replacement after render
    replaceTextInElement(this.shadowRoot)
  }

  render() {
    if (this.loading) {
      return html`<pie-spinner message="Loading mod details..."></pie-spinner>`
    }

    if (this.error) {
      return html`
        <div class="error">
          <strong>Error:</strong> ${this.error}
          <br><br>
          <button @click=${this.loadMod}>Retry</button>
          <button @click=${this.handleBackClick}>Go Back</button>
        </div>
      `
    }

    if (!this.mod) {
      return html`
        <div class="error">
          Mod not found.
          <br><br>
          <button @click=${this.handleBackClick}>Go Back</button>
        </div>
      `
    }

    return html`
      <button class="back-button" @click=${this.handleBackClick}>
        ← Back
      </button>

      ${this.mod.game ? html`
        <div class="game-info">
          <strong>Game:</strong> 
          <a href="#" @click=${this.handleGameClick}>
            ${this.mod.game.title}
          </a>
        </div>
      ` : ''}

      <div class="mod-header">
        <h1>${this.mod.title}</h1>
        
        <div class="mod-meta">
          ${this.mod.author ? html`
            <div><strong>Author:</strong> ${this.mod.author.name}</div>
          ` : ''}
          ${this.mod.file_size ? html`
            <div><strong>File Size:</strong> ${this.formatFileSize(this.mod.file_size)}</div>
          ` : ''}
          <div><strong>Downloads:</strong> ${this.mod.download_count || 0}</div>
          ${this.mod.created_at ? html`
            <div><strong>Uploaded:</strong> ${this.formatDate(this.mod.created_at)}</div>
          ` : ''}
          ${this.mod.updated_at && this.mod.updated_at !== this.mod.created_at ? html`
            <div><strong>Updated:</strong> ${this.formatDate(this.mod.updated_at)}</div>
          ` : ''}
        </div>

        ${this.mod.download_url ? html`
          <a 
            href=${this.mod.download_url} 
            target="_blank" 
            rel="noopener noreferrer"
            class="download-button"
          >
            ⬇ Download This File
          </a>
        ` : ''}
      </div>

      ${this.mod.description ? html`
        <div class="description-section">
          <h2>Description</h2>
          <p>${this.mod.description}</p>
        </div>
      ` : ''}

      ${this.mod.screenshots && this.mod.screenshots.length > 0 ? html`
        <div class="screenshots">
          <h2>Screenshots</h2>
          <div class="screenshots-grid">
            ${this.mod.screenshots.map(screenshot => html`
              <div class="screenshot">
                <img 
                  src=${screenshot.thumbnail_url || screenshot.url} 
                  alt="Screenshot"
                  loading="lazy"
                />
              </div>
            `)}
          </div>
        </div>
      ` : ''}
    `
  }
}

customElements.define('pie-mod-detail', PieModDetail)
