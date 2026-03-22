import { LitElement, html, css } from 'lit'
import { apiClient } from '../api/gamefront-client.js'
import { replaceTextInElement } from '../utils/text-replacer.js'
import './pie-spinner.js'

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
      border: 1px solid var(--color-border, #000000);
      padding: 16px;
      transition: background-color 0.2s;
      cursor: pointer;
    }

    .game-card:hover {
      background-color: var(--color-content-bg-alt, #b4a57e);
    }

    .game-card h3 {
      color: var(--color-primary-text, #543f20);
      font-size: 14px;
      margin: 0 0 8px 0;
      font-weight: bold;
    }

    .game-card .file-count {
      color: var(--color-primary-text, #543f20);
      font-size: 12px;
      margin-bottom: 8px;
    }

    .game-card .categories {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 8px;
    }

    .category-tag {
      background-color: var(--color-accent-brown, #c89d5f);
      color: var(--color-white, #ffffff);
      padding: 2px 8px;
      font-size: 10px;
      border: 1px solid var(--color-border, #000000);
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
  `

  static properties = {
    games: { type: Array },
    loading: { type: Boolean },
    error: { type: String },
    currentPage: { type: Number },
    totalPages: { type: Number },
    hasMore: { type: Boolean },
    searchQuery: { type: String },
  }

  constructor() {
    super()
    this.games = []
    this.loading = true
    this.error = ''
    this.currentPage = 1
    this.totalPages = 1
    this.hasMore = false
    this.searchQuery = ''
  }

  connectedCallback() {
    super.connectedCallback()

    // If searchQuery wasn't passed as property, get it from URL
    if (!this.searchQuery) {
      const params = new URLSearchParams(window.location.search)
      this.searchQuery = params.get('search') || ''
    }

    this.loadGames()
  }

  /**
   * Called when a reactive property changes
   * Reload games when searchQuery changes
   */
  willUpdate(changedProperties) {
    if (changedProperties.has('searchQuery') && this.hasUpdated) {
      // Reset to page 1 when search query changes
      this.currentPage = 1
      this.loadGames()
    }
  }

  async loadGames() {
    this.loading = true
    this.error = ''

    try {
      const result = await apiClient.getGames({
        search: this.searchQuery,
        page: this.currentPage,
        perPage: 20,
        orderBy: 'FILE_COUNT',
        orderDirection: 'DESC',
      })

      this.games = result.data
      this.currentPage = result.paginatorInfo.currentPage
      this.totalPages = result.paginatorInfo.lastPage
      this.hasMore = result.paginatorInfo.hasMorePages
    } catch (err) {
      console.error('Failed to load games:', err)
      this.error = apiClient.getErrorMessage(err)
    } finally {
      this.loading = false
    }
  }

  handleGameClick(game) {
    this.dispatchEvent(
      new CustomEvent('game-selected', {
        detail: { slug: game.slug },
        bubbles: true,
        composed: true,
      })
    )
  }

  handleConfigureApiKey() {
    this.dispatchEvent(
      new CustomEvent('open-api-key-modal', {
        bubbles: true,
        composed: true,
      })
    )
  }

  async handlePrevPage() {
    if (this.currentPage > 1) {
      this.currentPage--
      await this.loadGames()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  async handleNextPage() {
    if (this.hasMore) {
      this.currentPage++
      await this.loadGames()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  updated() {
    // Apply text replacement after render
    replaceTextInElement(this.shadowRoot)
  }

  render() {
    if (this.loading) {
      return html`<pie-spinner message="Loading games..."></pie-spinner>`
    }

    if (this.error) {
      const isAuthError = this.error.includes('API key') || this.error.includes('authentication')
      return html`
        <div class="error">
          <strong>Error:</strong> ${this.error} <br /><br />
          <button @click=${this.loadGames}>Retry</button>
          ${isAuthError
            ? html`
                <button @click=${this.handleConfigureApiKey} style="margin-left: 8px;">
                  Configure API Key
                </button>
              `
            : ''}
        </div>
      `
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
      `
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
        ${this.games.map(
          (game) => html`
            <div class="game-card" @click=${() => this.handleGameClick(game)}>
              <h3>${game.title}</h3>
              <div class="file-count">${game.file_count} files available</div>
              ${game.categories && game.categories.length > 0
                ? html`
                    <div class="categories">
                      ${game.categories.map(
                        (cat) => html` <span class="category-tag">${cat.name}</span> `
                      )}
                    </div>
                  `
                : ''}
            </div>
          `
        )}
      </div>

      ${this.totalPages > 1
        ? html`
            <div class="pagination">
              <button @click=${this.handlePrevPage} ?disabled=${this.currentPage === 1}>
                ← Previous
              </button>

              <span class="page-info"> Page ${this.currentPage} of ${this.totalPages} </span>

              <button @click=${this.handleNextPage} ?disabled=${!this.hasMore}>Next →</button>
            </div>
          `
        : ''}
    `
  }
}

customElements.define('pie-games-list', PieGamesList)
