import { LitElement, html, css } from 'lit'
import { router } from '../utils/router.js'
import { apiClient } from '../api/gamefront-client.js'
import './pie-header.js'
import './pie-footer.js'
import './pie-api-key-modal.js'
import './pie-spinner.js'

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
    this.currentView = 'loading'
    this.showApiKeyModal = false
    this.loading = true
    
    // Check if API key exists
    const apiKey = apiClient.getApiKey()
    if (!apiKey) {
      this.showApiKeyModal = true
      this.loading = false
    } else {
      this.loading = false
      this.currentView = 'home'
    }
  }

  connectedCallback() {
    super.connectedCallback()
    
    // Set up router
    router.addRoute('/', () => this.showHome())
    router.addRoute('/games/:slug', (params) => this.showGame(params.slug))
    router.addRoute('/mods/:id', (params) => this.showMod(params.id))
    router.addRoute('/about', () => this.showAbout())
    router.addRoute('/404', () => this.show404())
    
    // Start router if we have an API key
    if (apiClient.getApiKey()) {
      router.start()
    }
  }

  showHome() {
    this.currentView = 'home'
  }

  showGame(slug) {
    this.currentView = 'game'
    this.gameSlug = slug
  }

  showMod(id) {
    this.currentView = 'mod'
    this.modId = id
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

  renderView() {
    if (this.showApiKeyModal) {
      return html``
    }

    switch (this.currentView) {
      case 'loading':
        return html`<pie-spinner message="Loading Pie Files..."></pie-spinner>`
      
      case 'home':
        return html`<div>Games list will go here</div>`
      
      case 'game':
        return html`<div>Game detail for ${this.gameSlug}</div>`
      
      case 'mod':
        return html`<div>Mod detail for ${this.modId}</div>`
      
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
