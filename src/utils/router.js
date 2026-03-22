/**
 * Simple client-side router using History API
 * @module router
 */

export class Router {
  constructor() {
    this.routes = []
    this.currentRoute = null
    
    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      this.handleRoute(window.location.pathname)
    })
    
    // Handle initial route from 404.html redirect
    const params = new URLSearchParams(window.location.search)
    const route = params.get('route')
    if (route) {
      this.navigate(route, { replace: true })
    }
  }
  
  /**
   * Register a route
   * @param {string} path - Route path (e.g., "/games/:slug")
   * @param {Function} handler - Function to call when route matches
   */
  addRoute(path, handler) {
    const paramNames = []
    const regexPath = path.replace(/:(\w+)/g, (_, paramName) => {
      paramNames.push(paramName)
      return '([^/]+)'
    })
    
    this.routes.push({
      path,
      regex: new RegExp(`^${regexPath}$`),
      paramNames,
      handler
    })
  }
  
  /**
   * Navigate to a new route
   * @param {string} path - Path to navigate to
   * @param {Object} options - Navigation options
   * @param {boolean} options.replace - Replace current history entry instead of pushing
   */
  navigate(path, options = {}) {
    if (options.replace) {
      window.history.replaceState(null, '', path)
    } else {
      window.history.pushState(null, '', path)
    }
    this.handleRoute(path)
  }
  
  /**
   * Handle route change
   * @param {string} path - Current path
   */
  handleRoute(path) {
    for (const route of this.routes) {
      const match = path.match(route.regex)
      if (match) {
        const params = {}
        route.paramNames.forEach((name, index) => {
          params[name] = match[index + 1]
        })
        
        this.currentRoute = { path: route.path, params }
        route.handler(params)
        return
      }
    }
    
    // No route matched - 404
    this.handle404()
  }
  
  /**
   * Handle 404 - route not found
   */
  handle404() {
    this.currentRoute = null
    const handler = this.routes.find(r => r.path === '/404')?.handler
    if (handler) {
      handler()
    } else {
      console.error('No 404 handler registered')
    }
  }
  
  /**
   * Start the router - handle initial route
   */
  start() {
    this.handleRoute(window.location.pathname)
  }
}

// Export singleton instance
export const router = new Router()
