import { LitElement, html, css } from 'lit';
import { router } from '../utils/router.js';
import { apiClient } from '../api/gamefront-client.js';
import './pie-header.js';
import './pie-footer.js';
import './pie-api-key-modal.js';
import './pie-confirm-modal.js';
import './pie-spinner.js';
import './pie-games-list.js';
import './pie-game-detail.js';
import './pie-mod-detail.js';

export class PieApp extends LitElement {
    static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      padding: 24px 16px;
    }
  `;

    static properties = {
        currentView: { type: String },
        showApiKeyModal: { type: Boolean },
        showClearApiKeyConfirm: { type: Boolean },
        loading: { type: Boolean },
        searchQuery: { type: String },
    };

    constructor() {
        super();
        this.currentView = 'home';
        this.showApiKeyModal = false;
        this.showClearApiKeyConfirm = false;
        this.loading = false;
        this.searchQuery = '';
    }

    connectedCallback() {
        super.connectedCallback();

        // Check if API key exists on first load
        const apiKey = apiClient.getApiKey();
        if (!apiKey) {
            // No API key found - show modal immediately
            this.showApiKeyModal = true;
            this.currentView = 'loading';
        }

        // Set up router
        router.addRoute('/', () => this.showHome());
        router.addRoute('/games/:slug', (params) => this.showGame(params.slug));
        router.addRoute('/games/:gameSlug/mods/:modSlug', (params) =>
            this.showMod(params.gameSlug, params.modSlug),);
        router.addRoute('/about', () => this.showAbout());
        router.addRoute('/404', () => this.show404());

        // Start router only if we have an API key
        if (apiKey) {
            router.start();
        }
    }

    showHome() {
        this.currentView = 'home';
        // Extract search query from URL
        const params = new URLSearchParams(window.location.search);
        this.searchQuery = params.get('search') || '';
    }

    showGame(slug) {
        this.currentView = 'game';
        this.gameSlug = slug;
        this.requestUpdate();
    }

    showMod(gameSlug, modSlug) {
        this.currentView = 'mod';
        this.gameSlug = gameSlug;
        this.modSlug = modSlug;
        this.requestUpdate();
    }

    showAbout() {
        this.currentView = 'about';
    }

    show404() {
        this.currentView = '404';
    }

    async handleTestApiKey(e) {
        const { apiKey } = e.detail;

        try {
            apiClient.setApiKey(apiKey);
            const isValid = await apiClient.testApiKey();

            if (isValid) {
                this.showApiKeyModal = false;
                this.currentView = 'home';
                router.start();
                return true;
            } else {
                apiClient.clearApiKey();
                throw new Error('Invalid API key');
            }
        } catch (error) {
            apiClient.clearApiKey();
            throw new Error(apiClient.getErrorMessage(error));
        }
    }

    handleClearApiKeyRequest() {
        this.showClearApiKeyConfirm = true;
    }

    handleClearApiKeyConfirm() {
        apiClient.clearApiKey();
        this.showClearApiKeyConfirm = false;
        this.showApiKeyModal = true;
        this.currentView = 'loading';
    }

    handleClearApiKeyCancel() {
        this.showClearApiKeyConfirm = false;
    }

    handleNavigateHome(e) {
        e.preventDefault();
        router.navigate('/');
    }

    handleSearch(e) {
        const { query } = e.detail;
        // For now, just navigate to home with search
        // The games list component will handle the actual search
        router.navigate(`/?search=${encodeURIComponent(query)}`);
    }

    handleGameSelected(e) {
        const { slug } = e.detail;
        router.navigate(`/games/${slug}`);
    }

    handleModSelected(e) {
        const { slug, gameSlug } = e.detail;
        router.navigate(`/games/${gameSlug}/mods/${slug}`);
    }

    handleNavigateBack() {
        window.history.back();
    }

    handleOpenApiKeyModal() {
        this.showApiKeyModal = true;
    }

    renderView() {
        if (this.showApiKeyModal) {
            return html``;
        }

        switch (this.currentView) {
            case 'loading':
                return html`<pie-spinner message="Loading Pie Files..."></pie-spinner>`;

            case 'home':
                return html`
          <pie-games-list
            .searchQuery=${this.searchQuery}
            @game-selected=${this.handleGameSelected}
            @open-api-key-modal=${this.handleOpenApiKeyModal}
          ></pie-games-list>
        `;

            case 'game':
                return html`
          <pie-game-detail
            .slug=${this.gameSlug}
            @mod-selected=${this.handleModSelected}
            @navigate-back=${this.handleNavigateBack}
          ></pie-game-detail>
        `;

            case 'mod':
                return html`
          <pie-mod-detail
            .modSlug=${this.modSlug}
            .gameSlug=${this.gameSlug}
            @navigate-back=${this.handleNavigateBack}
            @game-selected=${this.handleGameSelected}
          ></pie-mod-detail>
        `;

            case 'about':
                return html`
          <div class="card">
            <h1>About Pie Files</h1>
            <p>
              PieFiles.com is a humorous parody/joke site that displays gaming
              content from
              <a href="https://www.gamefront.com" target="_blank"
                >GameFront.com</a
              >
              with a retro 2005 PieFiles theme and replaces all instances of
              "file" with "pie".
            </p>
            <p>
              The original PieFiles.com was an Age of Mythology files site from
              2005. This project pays homage to that retro aesthetic while
              having fun with word replacement.
            </p>
            <p>
              All gaming content is provided by GameFront via their public
              GraphQL API. This site is not affiliated with or endorsed by
              GameFront.
            </p>
          </div>
        `;

            case '404':
                return html`
          <div class="card center">
            <h1>404 - Pie Not Found</h1>
            <p>The pie you're looking for doesn't exist or has been eaten.</p>
            <button @click=${() => router.navigate('/')}>Go Home</button>
          </div>
        `;

            default:
                return html`<pie-spinner></pie-spinner>`;
        }
    }

    render() {
        return html`
      <pie-header
        @navigate-home=${this.handleNavigateHome}
        @search=${this.handleSearch}
      ></pie-header>

      <main class="main-content">${this.renderView()}</main>

      <pie-footer
        @clear-api-key-request=${this.handleClearApiKeyRequest}
      ></pie-footer>

      <pie-api-key-modal
        .open=${this.showApiKeyModal}
        @test-api-key=${this.handleTestApiKey}
      ></pie-api-key-modal>

      ${this.showClearApiKeyConfirm
            ? html`
            <pie-confirm-modal
              message="Are you sure you want to clear your API key? You will need to enter it again."
              confirmText="Clear API Key"
              cancelText="Cancel"
              @confirm=${this.handleClearApiKeyConfirm}
              @cancel=${this.handleClearApiKeyCancel}
            ></pie-confirm-modal>
          `
            : ''}
    `;
    }
}

customElements.define('pie-app', PieApp);
