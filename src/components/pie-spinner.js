import { LitElement, html, css } from 'lit'

export class PieSpinner extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }

    .spinner {
      display: inline-block;
      width: 40px;
      height: 40px;
      border: 4px solid var(--color-content-bg, #d0aa68);
      border-top-color: var(--color-accent-brown, #c89d5f);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .container {
      text-align: center;
      padding: 40px;
    }

    .message {
      margin-top: 16px;
      color: var(--color-primary-text, #543f20);
      font-family: Arial, sans-serif;
      font-size: 14px;
    }
  `

  static properties = {
    message: { type: String },
  }

  constructor() {
    super()
    this.message = 'Loading...'
  }

  render() {
    return html`
      <div class="container">
        <div class="spinner"></div>
        ${this.message ? html`<div class="message">${this.message}</div>` : ''}
      </div>
    `
  }
}

customElements.define('pie-spinner', PieSpinner)
