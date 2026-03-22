import { LitElement, html, css } from 'lit'
import { DISCLAIMER, GAMEFRONT_URL } from '../config.js'

export class PieFooter extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin-top: auto;
    }
    
    .footer {
      background-color: var(--color-accent-brown, #C89D5F);
      border-top: 1px solid var(--color-border, #000000);
      padding: 24px 16px;
      text-align: center;
      color: var(--color-white, #FFFFFF);
      font-size: 11px;
    }
    
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .disclaimer {
      margin-bottom: 12px;
      line-height: 1.6;
    }
    
    .links {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 16px;
      margin-top: 12px;
    }
    
    .links a,
    .links button {
      color: var(--color-white, #FFFFFF);
      text-decoration: underline;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 11px;
      padding: 0;
      font-family: Arial, sans-serif;
    }
    
    .links a:hover,
    .links button:hover {
      color: var(--color-primary-text, #543F20);
    }
    
    .credits {
      margin-top: 16px;
      font-size: 10px;
      opacity: 0.9;
    }
  `

  handleClearApiKey() {
    if (confirm('Are you sure you want to clear your API key? You will need to enter it again.')) {
      this.dispatchEvent(new CustomEvent('clear-api-key', {
        bubbles: true,
        composed: true
      }))
    }
  }

  render() {
    return html`
      <footer class="footer">
        <div class="footer-content">
          <div class="disclaimer">
            ${DISCLAIMER}
          </div>
          
          <div class="links">
            <a href=${GAMEFRONT_URL} target="_blank" rel="noopener noreferrer">
              Visit GameFront.com
            </a>
            <span>•</span>
            <button @click=${this.handleClearApiKey}>
              Clear API Key
            </button>
            <span>•</span>
            <a href="/about" @click=${(e) => {
              e.preventDefault()
              this.dispatchEvent(new CustomEvent('navigate', {
                detail: { path: '/about' },
                bubbles: true,
                composed: true
              }))
            }}>
              About
            </a>
          </div>
          
          <div class="credits">
            Made with 🥧 and humor • Original PieFiles.com (2005) • GameFront (1998-present)
          </div>
        </div>
      </footer>
    `
  }
}

customElements.define('pie-footer', PieFooter)
