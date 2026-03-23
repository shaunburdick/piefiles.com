import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { apiClient } from '../api/gamefront-client.js';
import { replaceTextInElement } from '../utils/text-replacer.js';
import { sanitizeHTML } from '../utils/sanitize.js';
import { buttonStyles } from '../styles/shared-styles.js';
import './pie-spinner.js';

export class PieGameDetail extends LitElement {
    static styles = [
        buttonStyles,
        css`
      :host {
        display: block;
      }

      .game-header {
        background-color: var(--color-content-bg, #d0aa68);
        border: 1px solid var(--color-border, #000000);
        padding: 24px;
        margin-bottom: 24px;
      }

      .game-header h1 {
        color: var(--color-primary-text, #543f20);
        font-size: 24px;
        margin: 0 0 12px 0;
      }

      .game-meta {
        color: var(--color-primary-text, #543f20);
        font-size: 12px;
        margin-bottom: 12px;
      }

      .categories {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 12px;
      }

      .category-tag {
        background-color: var(--color-accent-brown, #c89d5f);
        color: var(--color-white, #ffffff);
        padding: 4px 12px;
        font-size: 11px;
        border: 1px solid var(--color-border, #000000);
      }

      .mods-section h2 {
        color: var(--color-primary-text, #543f20);
        font-size: 18px;
        margin-bottom: 16px;
      }

      .mods-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
        margin-bottom: 24px;
      }

      @media (min-width: 768px) {
        .mods-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      .mod-card {
        background-color: var(--color-content-bg, #d0aa68);
        border: 1px solid var(--color-border, #000000);
        padding: 16px;
        transition: background-color 0.2s;
        cursor: pointer;
      }

      .mod-card:hover {
        background-color: var(--color-content-bg-alt, #b4a57e);
      }

      .mod-card h3 {
        color: var(--color-primary-text, #543f20);
        font-size: 14px;
        margin: 0 0 8px 0;
        font-weight: bold;
      }

      .mod-card .description {
        color: var(--color-primary-text, #543f20);
        font-size: 11px;
        line-height: 1.5;
        margin-bottom: 8px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .mod-card .meta {
      color: var(--color-primary-text, #543f20);
      font-size: 10px;
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid var(--color-accent-brown, #c89d5f);
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 12px;
      padding: 24px 0;
      flex-wrap: wrap;
    }

    .pagination button {
      padding: 8px 20px;
      font-size: 12px;
      font-family: Arial, sans-serif;
      background-color: var(--color-accent-brown, #c89d5f);
      color: var(--color-white, #ffffff);
      border: 1px solid var(--color-white, #ffffff);
      cursor: pointer;
      min-width: 80px;
    }

    .pagination button:hover:not(:disabled) {
      background-color: var(--color-accent-brown-alt, #ad915f);
    }

    .pagination button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .error {
      background-color: #ffe5e5;
      color: #cc0000;
      padding: 16px;
      border: 1px solid #cc0000;
      margin-bottom: 16px;
    }

      .no-mods {
        text-align: center;
        padding: 40px;
        color: var(--color-primary-text, #543f20);
        background-color: var(--color-content-bg, #d0aa68);
        border: 1px solid var(--color-border, #000000);
      }
    `,
    ];

    static properties = {
        slug: { type: String },
        game: { type: Object },
        mods: { type: Array },
        loading: { type: Boolean },
        error: { type: String },
        currentPage: { type: Number },
        totalPages: { type: Number },
        hasMore: { type: Boolean },
    };

    constructor() {
        super();
        this.slug = '';
        this.game = null;
        this.mods = [];
        this.loading = true;
        this.error = '';
        this.currentPage = 1;
        this.totalPages = 1;
        this.hasMore = false;
    }

    async connectedCallback() {
        super.connectedCallback();
        await this.loadGameAndMods();
    }

    async loadGameAndMods() {
        this.loading = true;
        this.error = '';

        try {
            // Load game details
            this.game = await apiClient.getGame(this.slug);

            // Load mods for this game
            const result = await apiClient.getMods(this.slug, {
                page: this.currentPage,
                perPage: 20,
            });

            this.mods = result.data;
            this.currentPage = result.paginatorInfo.currentPage;
            this.totalPages = result.paginatorInfo.lastPage;
            this.hasMore = result.paginatorInfo.hasMorePages;
        } catch (err) {
            this.error = apiClient.getErrorMessage(err);
        } finally {
            this.loading = false;
        }
    }

    handleBackClick() {
        this.dispatchEvent(
            new CustomEvent('navigate-back', {
                bubbles: true,
                composed: true,
            }),
        );
    }

    handleModClick(mod) {
        this.dispatchEvent(
            new CustomEvent('mod-selected', {
                detail: {
                    slug: mod.slug,
                    gameSlug: this.slug,
                },
                bubbles: true,
                composed: true,
            }),
        );
    }

    async handlePrevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            await this.loadGameAndMods();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    async handleNextPage() {
        if (this.hasMore) {
            this.currentPage++;
            await this.loadGameAndMods();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }

    formatFileSize(bytes) {
        if (!bytes) {
            return 'Unknown size';
        }
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(2)} MB`;
    }

    updated() {
    // Apply text replacement after render
        replaceTextInElement(this.shadowRoot);
    }

    render() {
        if (this.loading) {
            return html`<pie-spinner
        message="Loading game details..."
      ></pie-spinner>`;
        }

        if (this.error) {
            return html`
        <div class="error">
          <strong>Error:</strong> ${this.error} <br /><br />
          <button @click=${this.loadGameAndMods}>Retry</button>
          <button @click=${this.handleBackClick}>Go Back</button>
        </div>
      `;
        }

        if (!this.game) {
            return html`
        <div class="error">
          Game not found.
          <br /><br />
          <button @click=${this.handleBackClick}>Go Back</button>
        </div>
      `;
        }

        return html`
      <button class="back-button" @click=${this.handleBackClick}>
        ← Back to Games
      </button>

      <div class="game-header">
        <h1>${this.game.title}</h1>
        <div class="game-meta">${this.game.file_count} files available</div>

        ${this.game.categories && this.game.categories.length > 0
            ? html`
              <div class="categories">
                ${this.game.categories.map(
                    (cat) => html`
                    <span class="category-tag">${cat.name}</span>
                  `,
                )}
              </div>
            `
            : ''}
      </div>

      <div class="mods-section">
        <h2>Available Mods</h2>

        ${this.mods.length === 0
            ? html`
              <div class="no-mods">
                <h3>No Pies Found</h3>
                <p>No mods are available for this game yet.</p>
              </div>
            `
            : html`
              <div class="mods-grid">
                ${this.mods.map(
                    (mod) => html`
                    <div
                      class="mod-card"
                      @click=${() => this.handleModClick(mod)}
                    >
                      <h3>${mod.title}</h3>
                      ${mod.description
                            ? html`
                            <div class="description">
                              ${unsafeHTML(sanitizeHTML(mod.description))}
                            </div>
                          `
                            : ''}
                      <div class="meta">
                        ${mod.downloads || 0} downloads
                        ${mod.created_at
                            ? ` • ${this.formatDate(mod.created_at)}`
                            : ''}
                      </div>
                    </div>
                  `,
                )}
              </div>

              ${this.totalPages > 1
                    ? html`
                    <div class="pagination">
                      <button
                        @click=${this.handlePrevPage}
                        ?disabled=${this.currentPage === 1}
                      >
                        ← Previous
                      </button>

                      <span
                        style="color: var(--color-primary-text); font-size: 12px;"
                      >
                        Page ${this.currentPage} of ${this.totalPages}
                      </span>

                      <button
                        @click=${this.handleNextPage}
                        ?disabled=${!this.hasMore}
                      >
                        Next →
                      </button>
                    </div>
                  `
                    : ''}
            `}
      </div>
    `;
    }
}

customElements.define('pie-game-detail', PieGameDetail);
