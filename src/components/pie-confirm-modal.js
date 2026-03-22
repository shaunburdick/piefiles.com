import { LitElement, html, css } from 'lit';

/**
 * Confirmation Modal Component
 * A simple modal for yes/no confirmations
 */
export class PieConfirmModal extends LitElement {
    static properties = {
        message: { type: String },
        confirmText: { type: String },
        cancelText: { type: String },
    };

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
      background-color: var(--color-content-bg, #d0aa68);
      border: 2px solid var(--color-border, #000000);
      padding: 24px;
      max-width: 400px;
      width: 100%;
    }

    .modal-message {
      color: var(--color-primary-text, #543f20);
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 24px;
    }

    .modal-buttons {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    button {
      padding: 8px 16px;
      font-size: 12px;
      font-weight: bold;
      cursor: pointer;
      border: 1px solid var(--color-border, #000000);
      background-color: var(--color-background, #d4bc94);
      color: var(--color-primary-text, #543f20);
    }

    button:hover {
      background-color: var(--color-accent, #c8a060);
    }

    .confirm-button {
      background-color: var(--color-accent, #c8a060);
    }

    .confirm-button:hover {
      background-color: var(--color-primary-text, #543f20);
      color: var(--color-background, #d4bc94);
    }
  `;

    constructor() {
        super();
        this.message = 'Are you sure?';
        this.confirmText = 'OK';
        this.cancelText = 'Cancel';
    }

    handleConfirm() {
        this.dispatchEvent(
            new CustomEvent('confirm', {
                bubbles: true,
                composed: true,
            }),
        );
    }

    handleCancel() {
        this.dispatchEvent(
            new CustomEvent('cancel', {
                bubbles: true,
                composed: true,
            }),
        );
    }

    render() {
        return html`
      <div class="modal-overlay" @click=${this.handleCancel}>
        <div class="modal" @click=${(e) => e.stopPropagation()}>
          <p class="modal-message">${this.message}</p>
          <div class="modal-buttons">
            <button class="cancel-button" @click=${this.handleCancel}>
              ${this.cancelText}
            </button>
            <button class="confirm-button" @click=${this.handleConfirm}>
              ${this.confirmText}
            </button>
          </div>
        </div>
      </div>
    `;
    }
}

customElements.define('pie-confirm-modal', PieConfirmModal);
