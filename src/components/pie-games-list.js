import { LitElement, html, css } from 'lit';
import { apiClient } from '../api/gamefront-client.js';
import { replaceTextInElement } from '../utils/text-replacer.js';
import { getSafeImageURL } from '../utils/image-validator.js';
import './pie-spinner.js';

export class PieGamesList extends LitElement {
    static styles = css`
    :host {
      display: block;
    }

    .games-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }

    @media (min-width: 768px) {
      .games-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
      }
    }

    @media (min-width: 1024px) {
      .games-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 32px;
      }
    }

    .game-card {
      background-color: var(--color-content-bg, #d0aa68);
      border: 2px solid var(--color-border, #000000);
      border-radius: 12px;
      padding: 0;
      transition: all 0.2s ease;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.3);
    }

    .game-card:hover {
      background-color: var(--color-content-bg-alt, #b4a57e);
      transform: translateY(-2px);
      box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.3);
    }

    .game-image {
      width: 100%;
      height: 240px;
      object-fit: contain;
      object-position: center;
      background-color: var(--color-accent-brown-alt, #ad915f);
      border-bottom: 2px dashed var(--color-border, #000000);
    }

    .no-image {
      width: 100%;
      height: 240px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(
        circle at 30% 30%,
        var(--color-accent-brown, #c89d5f) 0%,
        var(--color-accent-brown-alt, #ad915f) 100%
      );
      border-bottom: 2px dashed var(--color-border, #000000);
      color: var(--color-primary-text, #543f20);
      font-size: 48px;
      text-align: center;
      font-weight: bold;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .game-card-content {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .game-card h3 {
      color: var(--color-primary-text, #543f20);
      font-size: 14px;
      margin: 0;
      font-weight: bold;
    }

    .game-card .file-count {
      color: var(--color-primary-text, #543f20);
      font-size: 12px;
      font-weight: bold;
    }

    .game-card .description {
      color: var(--color-primary-text, #543f20);
      font-size: 11px;
      line-height: 1.4;
      margin: 4px 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .game-card .categories {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 4px;
    }

    .category-tag {
      background-color: var(--color-accent-brown, #c89d5f);
      color: var(--color-white, #ffffff);
      padding: 4px 10px;
      font-size: 10px;
      border: 1px solid var(--color-border, #000000);
      border-radius: 12px;
      white-space: nowrap;
      box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.2);
    }

    .show-more-tags {
      background-color: var(--color-accent-brown-alt, #ad915f);
      color: var(--color-white, #ffffff);
      padding: 4px 10px;
      font-size: 10px;
      border: 1px solid var(--color-border, #000000);
      border-radius: 12px;
      cursor: pointer;
      white-space: nowrap;
      box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.2);
      transition: all 0.2s ease;
    }

    .show-more-tags:hover {
      background-color: var(--color-primary-text, #543f20);
      transform: translateY(-1px);
      box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.3);
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
      padding: 10px 24px;
      font-size: 12px;
      font-family: Arial, sans-serif;
      background-color: var(--color-accent-brown, #c89d5f);
      color: var(--color-white, #ffffff);
      border: 2px solid var(--color-border, #000000);
      border-radius: 20px;
      cursor: pointer;
      min-width: 100px;
      box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.3);
      transition: all 0.2s ease;
    }

    .pagination button:hover:not(:disabled) {
      background-color: var(--color-accent-brown-alt, #ad915f);
      transform: translateY(-2px);
      box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.3);
    }

    .pagination button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pagination .page-info {
      color: var(--color-primary-text, #543f20);
      font-size: 12px;
    }

    .error {
      background-color: #ffe5e5;
      color: #cc0000;
      padding: 16px;
      border: 1px solid #cc0000;
      margin-bottom: 16px;
    }

    .no-results {
      text-align: center;
      padding: 40px;
      color: var(--color-primary-text, #543f20);
    }
  `;

    static properties = {
        games: { type: Array },
        loading: { type: Boolean },
        error: { type: String },
        currentPage: { type: Number },
        totalPages: { type: Number },
        hasMore: { type: Boolean },
        searchQuery: { type: String },
        expandedTags: { type: Object },
    };

    constructor() {
        super();
        this.games = [];
        this.loading = true;
        this.error = '';
        this.currentPage = 1;
        this.totalPages = 1;
        this.hasMore = false;
        this.searchQuery = '';
        this.expandedTags = {};
    }

    connectedCallback() {
        super.connectedCallback();

        // If searchQuery wasn't passed as property, get it from URL
        if (!this.searchQuery) {
            const params = new URLSearchParams(window.location.search);
            this.searchQuery = params.get('search') || '';
        }

        this.loadGames();
    }

    /**
     * Called when a reactive property changes
     * Reload games when searchQuery changes
     */
    willUpdate(changedProperties) {
        if (changedProperties.has('searchQuery') && this.hasUpdated) {
            // Reset to page 1 when search query changes
            this.currentPage = 1;
            this.loadGames();
        }
    }

    async loadGames() {
        this.loading = true;
        this.error = '';

        try {
            const result = await apiClient.getGames({
                search: this.searchQuery,
                page: this.currentPage,
                perPage: 20,
                orderBy: 'FILE_COUNT',
                orderDirection: 'DESC',
            });

            this.games = result.data;
            this.currentPage = result.paginatorInfo.currentPage;
            this.totalPages = result.paginatorInfo.lastPage;
            this.hasMore = result.paginatorInfo.hasMorePages;
            // Reset expanded tags when loading new games
            this.expandedTags = {};
        } catch (err) {
            this.error = apiClient.getErrorMessage(err);
        } finally {
            this.loading = false;
        }
    }

    /**
     * Get unique categories for a game (deduplicated by ID)
     *
     * @param {Object} game - Game object with categories
     * @returns {Array} Unique categories
     */
    getUniqueCategories(game) {
        if (!game.categories || game.categories.length === 0) {
            return [];
        }

        const seen = new Set();
        return game.categories.filter((cat) => {
            if (seen.has(cat.id)) {
                return false;
            }
            seen.add(cat.id);
            return true;
        });
    }

    /**
     * Toggle showing all tags for a game
     *
     * @param {Event} e - Click event
     * @param {string} gameId - Game ID
     */
    handleToggleTags(e, gameId) {
        e.stopPropagation();
        this.expandedTags = {
            ...this.expandedTags,
            [gameId]: !this.expandedTags[gameId],
        };
    }

    /**
     * Strip HTML tags from a string
     *
     * @param {string} htmlString - HTML string
     * @returns {string} Plain text
     */
    stripHtml(htmlString) {
        if (!htmlString) {
            return '';
        }
        const div = document.createElement('div');
        div.innerHTML = htmlString;
        return div.textContent || div.innerText || '';
    }

    /**
     * Get the first image for a game
     *
     * @param {Object} game - Game object
     * @returns {string|null} Image path or null
     */
    getFirstImage(game) {
    // Use box_art if available
        if (game.box_art) {
            return getSafeImageURL(game.box_art);
        }
        return null;
    }

    handleGameClick(game) {
        this.dispatchEvent(
            new CustomEvent('game-selected', {
                detail: { slug: game.slug },
                bubbles: true,
                composed: true,
            }),
        );
    }

    handleConfigureApiKey() {
        this.dispatchEvent(
            new CustomEvent('open-api-key-modal', {
                bubbles: true,
                composed: true,
            }),
        );
    }

    async handlePrevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            await this.loadGames();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    async handleNextPage() {
        if (this.hasMore) {
            this.currentPage++;
            await this.loadGames();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    updated() {
    // Apply text replacement after render
        replaceTextInElement(this.shadowRoot);
    }

    render() {
        if (this.loading) {
            return html`<pie-spinner message="Loading games..."></pie-spinner>`;
        }

        if (this.error) {
            const isAuthError =
                this.error.includes('API key') || this.error.includes('authentication');
            return html`
        <div class="error">
          <strong>Error:</strong> ${this.error} <br /><br />
          <button @click=${this.loadGames}>Retry</button>
          ${isAuthError
                ? html`
                <button
                  @click=${this.handleConfigureApiKey}
                  style="margin-left: 8px;"
                >
                  Configure API Key
                </button>
              `
                : ''}
        </div>
      `;
        }

        if (this.games.length === 0) {
            return html`
        <div class="no-results">
          <h2>No Pies Found</h2>
          <p>
            ${this.searchQuery
                ? `No games matching "${this.searchQuery}" were found.`
                : 'No games available at this time.'}
          </p>
        </div>
      `;
        }

        return html`
      ${this.searchQuery
            ? html`
            <div style="margin-bottom: 16px; color: var(--color-primary-text);">
              <strong>Search results for:</strong> "${this.searchQuery}"
            </div>
          `
            : ''}

      <div class="games-grid">
        ${this.games.map((game) => {
            const uniqueCategories = this.getUniqueCategories(game);
            const isExpanded = this.expandedTags[game.id];
            const visibleCategories = isExpanded
                ? uniqueCategories
                : uniqueCategories.slice(0, 10);
            const hasMoreCategories = uniqueCategories.length > 10;
            const firstImage = this.getFirstImage(game);

            return html`
            <div class="game-card" @click=${() => this.handleGameClick(game)}>
              ${firstImage
                    ? html`<img
                    src="${firstImage}"
                    alt="${game.title}"
                    class="game-image"
                    loading="lazy"
                  />`
                    : html`<div class="no-image">
                    ${game.title.charAt(0).toUpperCase()}
                  </div>`}

              <div class="game-card-content">
                <h3>${game.title}</h3>
                <div class="file-count">${game.file_count} files available</div>

                ${game.description
                    ? html`
                      <div class="description">
                        ${this.stripHtml(game.description)}
                      </div>
                    `
                    : ''}
                ${uniqueCategories.length > 0
                    ? html`
                      <div class="categories">
                        ${visibleCategories.map(
                            (cat) =>
                                html`<span class="category-tag">${cat.name}</span>`,
                        )}
                        ${hasMoreCategories
                            ? html`
                              <span
                                class="show-more-tags"
                                @click=${(e) =>
                                    this.handleToggleTags(e, game.id)}
                              >
                                ${isExpanded
                                    ? 'Show Less'
                                    : `+${uniqueCategories.length - 10} More`}
                              </span>
                            `
                            : ''}
                      </div>
                    `
                    : ''}
              </div>
            </div>
          `;
        })}
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

              <span class="page-info">
                Page ${this.currentPage} of ${this.totalPages}
              </span>

              <button @click=${this.handleNextPage} ?disabled=${!this.hasMore}>
                Next →
              </button>
            </div>
          `
            : ''}
    `;
    }
}

customElements.define('pie-games-list', PieGamesList);
