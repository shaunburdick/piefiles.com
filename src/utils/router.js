/**
 * Simple client-side router using History API
 *
 * @module router
 */

export class Router {
    constructor() {
        this.routes = [];
        this.currentRoute = null;

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.handleRoute(window.location.pathname);
        });

        // Handle initial route from 404.html redirect
        const params = new URLSearchParams(window.location.search);
        const route = params.get('route');
        if (route) {
            this.navigate(route, { replace: true });
        }
    }

    /**
     * Add a route to the router
     *
     * @param {string} path - Route path (e.g., "/game/:slug")
     * @param {Function} handler - Handler function to call when route matches
     */
    addRoute(path, handler) {
        this.routes.push({
            path,
            handler,
        });
    }

    /**
     * Match a path pattern against a URL pathname
     *
     * @param {string} pattern - Route pattern (e.g., "/game/:slug")
     * @param {string} pathname - URL pathname to match
     * @returns {Object|null} Match result with params, or null if no match
     */
    matchPath(pattern, pathname) {
        const patternParts = pattern.split('/');
        const pathnameParts = pathname.split('/');

        // Must have same number of segments
        if (patternParts.length !== pathnameParts.length) {
            return null;
        }

        const params = {};

        for (let i = 0; i < patternParts.length; i++) {
            const patternPart = patternParts[i];
            const pathnamePart = pathnameParts[i];

            // Check if this is a parameter (starts with :)
            if (patternPart.startsWith(':')) {
                const paramName = patternPart.slice(1);
                params[paramName] = pathnamePart;
            } else if (patternPart !== pathnamePart) {
                // Static segment doesn't match
                return null;
            }
        }

        return { params };
    }

    /**
     * Navigate to a new route
     *
     * @param {string} path - Path to navigate to
     * @param {Object} options - Navigation options
     * @param {boolean} options.replace - Replace current history entry instead of pushing
     */
    navigate(path, options = {}) {
        if (options.replace) {
            window.history.replaceState(null, '', path);
        } else {
            window.history.pushState(null, '', path);
        }
        this.handleRoute(path);
    }

    /**
     * Handle route change
     *
     * @param {string} path - Current path
     */
    handleRoute(path) {
    // Extract pathname only (ignore query string and hash)
        const pathname = path.split('?')[0].split('#')[0];

        for (const route of this.routes) {
            const match = this.matchPath(route.path, pathname);
            if (match) {
                this.currentRoute = { path: route.path, params: match.params };
                route.handler(match.params);
                return;
            }
        }

        // No route matched - 404
        this.handle404();
    }

    /**
     * Handle 404 - route not found
     */
    handle404() {
        this.currentRoute = null;
        const handler = this.routes.find((r) => r.path === '/404')?.handler;
        if (handler) {
            handler();
        }
    // If no 404 handler, silently fail (error already visible to user)
    }

    /**
     * Start the router - handle initial route
     */
    start() {
        this.handleRoute(window.location.pathname);
    }
}

// Export singleton instance
export const router = new Router();
