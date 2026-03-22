import { LitElement, html, css } from 'lit'
import { GAMEFRONT_API_KEY_URL } from '../config.js'

export class PieApiKeyModal extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      padding: 16px;
    }
    
    .modal {
      background-color: var(--color-content-bg, #D0AA68);
      border: 2px solid var(--color-border, #000000);
      padding: 24px;
      max-width: 500px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
    }
    
    .modal h2 {
      color: var(--color-primary-text, #543F20);
      font-size: 18px;
      margin-bottom: 16px;
    }
    
    .modal p {
      color: var(--color-primary-text, #543F20);
      font-size: 12px;
      line-height: 1.6;
      margin-bottom: 12px;
    }
    
    .modal a {
      color: var(--color-primary-text, #543F20);
      text-decoration: underline;
    }
    
    .modal a:hover {
      color: var(--color-link-hover, #FFFFFF);
    }
    
    .form-group {
      margin-bottom: 16px;
    }
    
    .form-group label {
      display: block;
      font-weight: bold;
      margin-bottom: 6px;
      color: var(--color-primary-text, #543F20);
    }
    
    .form-group input {
      width: 100%;
      padding: 8px;
      font-size: 12px;
      font-family: Arial, sans-serif;
      background-color: var(--color-white, #FFFFFF);
      color: var(--color-primary-text, #543F20);
      border: 1px solid var(--color-border, #000000);
    }
    
    .error-message {
      background-color: #FFE5E5;
      color: #CC0000;
      padding: 12px;
      margin-bottom: 16px;
      border: 1px solid #CC0000;
      font-size: 11px;
    }
    
    .success-message {
      background-color: #E5F5E5;
      color: #006600;
      padding: 12px;
      margin-bottom: 16px;
      border: 1px solid #006600;
      font-size: 11px;
    }
    
    .button-group {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }
    
    button {
      padding: 8px 20px;
      font-size: 12px;
      font-family: Arial, sans-serif;
      background-color: var(--color-accent-brown, #C89D5F);
      color: var(--color-white, #FFFFFF);
      border: 1px solid var(--color-white, #FFFFFF);
      cursor: pointer;
    }
    
    button:hover:not(:disabled) {
      background-color: var(--color-accent-brown-alt, #AD915F);
    }
    
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .warning {
      background-color: #FFF8E5;
      border: 1px solid #CCA300;
      padding: 12px;
      margin-bottom: 16px;
      font-size: 11px;
      color: var(--color-primary-text, #543F20);
    }
  `

  static properties = {
    open: { type: Boolean },
    apiKey: { type: String },
    error: { type: String },
    success: { type: Boolean },
    testing: { type: Boolean }
  }

  constructor() {
    super()
    this.open = false
    this.apiKey = ''
    this.error = ''
    this.success = false
    this.testing = false
  }

  handleInput(e) {
    this.apiKey = e.target.value
    this.error = ''
    this.success = false
  }

  async handleSubmit(e) {
    e.preventDefault()
    
    if (!this.apiKey.trim()) {
      this.error = 'Please enter an API key'
      return
    }

    this.testing = true
    this.error = ''

    try {
      // Dispatch event for parent to test the key
      const result = await this.dispatchEvent(new CustomEvent('test-api-key', {
        detail: { apiKey: this.apiKey.trim() },
        bubbles: true,
        composed: true,
        cancelable: true
      }))

      if (result) {
        this.success = true
        this.error = ''
        
        // Close modal after 1 second
        setTimeout(() => {
          this.open = false
          this.success = false
        }, 1000)
      }
    } catch (err) {
      this.error = err.message || 'Failed to validate API key. Please try again.'
    } finally {
      this.testing = false
    }
  }

  handleClose() {
    // Only allow closing if we have a valid key
    this.dispatchEvent(new CustomEvent('close', {
      bubbles: true,
      composed: true
    }))
  }

  render() {
    if (!this.open) return html``

    return html`
      <div class="modal-overlay">
        <div class="modal">
          <h2>🥧 Welcome to Pie Files!</h2>
          
          <p>
            This site requires a <strong>GameFront API key</strong> to fetch gaming content.
            Get your free API key from:
          </p>
          
          <p>
            <a href=${GAMEFRONT_API_KEY_URL} target="_blank" rel="noopener noreferrer">
              ${GAMEFRONT_API_KEY_URL}
            </a>
          </p>
          
          <div class="warning">
            <strong>Privacy Note:</strong> Your API key is stored only in your browser's localStorage.
            It is never sent to any server except GameFront's official API.
            Never share your API key with others.
          </div>
          
          ${this.error ? html`
            <div class="error-message">${this.error}</div>
          ` : ''}
          
          ${this.success ? html`
            <div class="success-message">✓ API key validated successfully!</div>
          ` : ''}
          
          <form @submit=${this.handleSubmit}>
            <div class="form-group">
              <label for="api-key">GameFront API Key:</label>
              <input
                type="text"
                id="api-key"
                placeholder="Enter your API key..."
                .value=${this.apiKey}
                @input=${this.handleInput}
                ?disabled=${this.testing}
              />
            </div>
            
            <div class="button-group">
              <button type="submit" ?disabled=${this.testing || !this.apiKey.trim()}>
                ${this.testing ? 'Validating...' : 'Save & Test'}
              </button>
            </div>
          </form>
        </div>
      </div>
    `
  }
}

customElements.define('pie-api-key-modal', PieApiKeyModal)
