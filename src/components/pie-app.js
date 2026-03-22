import { LitElement, html, css } from 'lit'
import { router } from '../utils/router.js'
import { apiClient } from '../api/gamefront-client.js'
import './pie-header.js'
import './pie-footer.js'
import './pie-api-key-modal.js'
import './pie-spinner.js'
import './pie-games-list.js'
import './pie-game-detail.js'
import './pie-mod-detail.js'

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
  `

  static properties = {
    currentView: { type: String },
    showApiKeyModal: { type: Boolean },
    loading: { type: Boolean }
  }

  constructor() {
    super()
    this.currentView = 'home'
    this.showApiKeyModal = false
    this.loading = false
  }

  connectedCallback() {
    super.connectedCallback()
    
    // Set up router
    router.addRoute('/', () => this.showHome())
    router.addRoute('/games/:slug', (params) => this.showGame(params.slug))
    router.addRoute('/mods/:id', (params) => this.showMod(params.id))
    router.addRoute('/about', () => this.showAbout())
    router.addRoute('/404', () => this.show404())
    
    // Start router (works with or without API key)
    router.start()
  }

  showHome() {
    this.currentView = 'home'
  }

  showGame(slug) {
    this.currentView = 'game'
    this.gameSlug = slug
    this.requestUpdate()
  }

  showMod(id) {
    this.currentView = 'mod'
    this.modId = id
    this.requestUpdate()
  }

  showAbout() {
    this.currentView = 'about'
  }

  show404() {
    this.currentView = '404'
  }

  async handleTestApiKey(e) {
    const { apiKey } = e.detail
    
    try {
      apiClient.setApiKey(apiKey)
      const isValid = await apiClient.testApiKey()
      
      if (isValid) {
        this.showApiKeyModal = false
        this.currentView = 'home'
        router.start()
        return true
      } else {
        apiClient.clearApiKey()
        throw new Error('Invalid API key')
      }
    } catch (error) {
      apiClient.clearApiKey()
      throw new Error(apiClient.getErrorMessage(error))
    }
  }

  handleClearApiKey() {
    apiClient.clearApiKey()
    this.showApiKeyModal = true
    this.currentView = 'loading'
  }

  handleNavigateHome(e) {
    e.preventDefault()
    router.navigate('/')
  }

  handleSearch(e) {
    const { query } = e.detail
    // For now, just navigate to home with search
    // The games list component will handle the actual search
    router.navigate(`/?search=${encodeURIComponent(query)}`)
  }

  handleGameSelected(e) {
    const { slug } = e.detail
    router.navigate(`/games/${slug}`)
  }

  handleModSelected(e) {
    const { modId } = e.detail
    router.navigate(`/mods/${modId}`)
  }

  handleNavigateBack() {
    window.history.back()
  }

  renderView() {
    if (this.showApiKeyModal) {
      return html``
    }

    switch (this.currentView) {
      case 'loading':
        return html`<pie-spinner message="Loading Pie Files..."></pie-spinner>`
      
      case 'home':
        return html`
          <pie-games-list
            @game-selected=${this.handleGameSelected}
          ></pie-games-list>
        `
      
      case 'game':
        return html`
          <pie-game-detail
            .slug=${this.gameSlug}
            @mod-selected=${this.handleModSelected}
            @navigate-back=${this.handleNavigateBack}
          ></pie-game-detail>
        `
      
      case 'mod':
        return html`
          <pie-mod-detail
            .modId=${this.modId}
            @navigate-back=${this.handleNavigateBack}
            @game-selected=${this.handleGameSelected}
          ></pie-mod-detail>
        `
      
      case 'about':
        return html`
          <div class="card">
            <h1>About Pie Files</h1>
            <p>
              PieFiles.com is a humorous parody/joke site that displays gaming content from 
              <a href="https://www.gamefront.com" target="_blank">GameFront.com</a>
              with a retro 2005 PieFiles theme and replaces all instances of "file" with "pie".
            </p>
            <p>
              The original PieFiles.com was an Age of Mythology files site from 2005.
              This project pays homage to that retro aesthetic while having fun with word replacement.
            </p>
            <p>
              All gaming content is provided by GameFront via their public GraphQL API.
              This site is not affiliated with or endorsed by GameFront.
            </p>
          </div>
        `
      
      case '404':
        return html`
          <div class="card center">
            <h1>404 - Pie Not Found</h1>
            <p>The pie you're looking for doesn't exist or has been eaten.</p>
            <button @click=${() => router.navigate('/')}>Go Home</button>
          </div>
        `
      
      default:
        return html`<pie-spinner></pie-spinner>`
    }
  }

  render() {
    return html`
      <pie-header
        @navigate-home=${this.handleNavigateHome}
        @search=${this.handleSearch}
      ></pie-header>
      
      <main class="main-content">
        ${this.renderView()}
      </main>
      
      <pie-footer
        @clear-api-key=${this.handleClearApiKey}
      ></pie-footer>
      
      <pie-api-key-modal
        .open=${this.showApiKeyModal}
        @test-api-key=${this.handleTestApiKey}
      ></pie-api-key-modal>
    `
  }
}

customElements.define('pie-app', PieApp)
