/**
 * GameFront GraphQL API Client
 *
 * @module gamefront-client
 */

import { GAMES_QUERY, GAME_QUERY, MODS_QUERY, MOD_QUERY } from './queries.js';

// Use proxy in development to avoid CORS issues
const API_ENDPOINT = import.meta.env.DEV
    ? '/api/v1/graphql' // Proxied through Vite dev server
    : 'https://www.gamefront.com/api/v1/graphql'; // Direct in production

const USER_AGENT = 'PieFiles/1.0 (+https://piefiles.com)';
const RATE_LIMIT_PER_MINUTE = 120;
const REQUEST_INTERVAL = 60000 / RATE_LIMIT_PER_MINUTE; // ~500ms between requests

class GameFrontClient {
    constructor() {
        this.apiKey = null;
        this.requestQueue = [];
        this.lastRequestTime = 0;
    }

    /**
     * Set API key from localStorage
     *
     * @param {string} key - GameFront API key
     */
    setApiKey(key) {
        this.apiKey = key;
        if (key) {
            localStorage.setItem('piefiles_api_key', key);
        }
    }

    /**
     * Get API key from localStorage
     *
     * @returns {string|null} API key or null
     */
    getApiKey() {
        if (!this.apiKey) {
            this.apiKey = localStorage.getItem('piefiles_api_key');
        }
        return this.apiKey;
    }

    /**
     * Clear API key
     */
    clearApiKey() {
        this.apiKey = null;
        localStorage.removeItem('piefiles_api_key');
    }

    /**
     * Rate-limited GraphQL request
     *
     * @private
     * @param {string} query - GraphQL query string
     * @param {Object} variables - Query variables
     * @returns {Promise<Object>} Response data
     */
    async request(query, variables = {}) {
    // Ensure we don't exceed rate limit
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < REQUEST_INTERVAL) {
            await new Promise((resolve) =>
                setTimeout(resolve, REQUEST_INTERVAL - timeSinceLastRequest),);
        }

        const apiKey = this.getApiKey();

        const headers = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'User-Agent': USER_AGENT,
        };

        // Add Authorization header only if API key is provided
        if (apiKey) {
            headers['Authorization'] = `Bearer ${apiKey}`;
        }

        try {
            this.lastRequestTime = Date.now();

            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers,
                body: JSON.stringify({ query, variables }),
                signal: AbortSignal.timeout(10000), // 10 second timeout
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('UNAUTHORIZED');
                } else if (response.status === 429) {
                    throw new Error('RATE_LIMITED');
                } else if (response.status >= 500) {
                    throw new Error('SERVER_ERROR');
                } else {
                    throw new Error('REQUEST_FAILED');
                }
            }

            const data = await response.json();

            if (data.errors && data.errors.length > 0) {
                throw new Error('GRAPHQL_ERROR');
            }

            return data.data;
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'TimeoutError') {
                throw new Error('TIMEOUT');
            }
            throw error;
        }
    }

    /**
     * Get user-friendly error message
     *
     * @param {Error} error - Error object
     * @returns {string} User-friendly message
     */
    getErrorMessage(error) {
        const hasApiKey = !!this.getApiKey();
        const messages = {
            API_KEY_REQUIRED:
        'API key is required. Please configure your GameFront API key in settings.',
            UNAUTHORIZED: hasApiKey
                ? 'API key is invalid. Please check your GameFront API key in settings.'
                : 'GameFront API requires authentication. Please configure your API key in settings (footer).',
            RATE_LIMITED: 'Too many requests. Please wait a moment and try again.',
            SERVER_ERROR: 'GameFront is experiencing issues. Please try again later.',
            TIMEOUT: 'Request timed out. Please check your connection and try again.',
            GRAPHQL_ERROR: 'An error occurred while fetching data. Please try again.',
            REQUEST_FAILED: 'Failed to fetch data from GameFront. Please try again.',
        };
        return (
            messages[error.message] ||
      'An unexpected error occurred. Please try again.'
        );
    }

    /**
     * Fetch games list
     *
     * @param {Object} options - Query options
     * @param {string} options.search - Search query
     * @param {string} options.orderBy - Order by column (FILE_COUNT, TITLE)
     * @param {string} options.orderDirection - Order direction (ASC, DESC)
     * @param {number} options.page - Page number
     * @param {number} options.perPage - Items per page
     * @returns {Promise<Object>} Games data with pagination info
     */
    async getGames({
        search = '',
        orderBy = 'FILE_COUNT',
        orderDirection = 'DESC',
        page = 1,
        perPage = 20,
    } = {}) {
        const data = await this.request(GAMES_QUERY, {
            search,
            orderBy,
            orderDirection,
            first: perPage,
            page,
        });
        return data.games;
    }

    /**
     * Fetch single game by slug
     *
     * @param {string} slug - Game slug
     * @returns {Promise<Object>} Game data
     */
    async getGame(slug) {
        const data = await this.request(GAME_QUERY, { slug });
        if (!data.game) {
            throw new Error('NOT_FOUND');
        }
        return data.game;
    }

    /**
     * Fetch mods for a game
     *
     * @param {string} gameSlug - Game slug
     * @param {Object} options - Query options
     * @param {number} options.page - Page number
     * @param {number} options.perPage - Items per page
     * @returns {Promise<Object>} Mods data with pagination info
     */
    async getMods(gameSlug, { page = 1, perPage = 20 } = {}) {
        const data = await this.request(MODS_QUERY, {
            slug: gameSlug,
            first: perPage,
            page,
        });
        return data.modsForGame;
    }

    /**
     * Fetch single mod by slug and game slug
     *
     * @param {string} slug - Mod slug
     * @param {string} gameSlug - Game slug
     * @returns {Promise<Object>} Mod data
     */
    async getMod(slug, gameSlug) {
        const data = await this.request(MOD_QUERY, { slug, gameSlug });
        if (!data.mod) {
            throw new Error('NOT_FOUND');
        }
        return data.mod;
    }

    /**
     * Test API key validity
     *
     * @returns {Promise<boolean>} True if key is valid
     */
    async testApiKey() {
        try {
            await this.getGames({ perPage: 1 });
            return true;
        } catch {
            return false;
        }
    }
}

// Export singleton instance
export const apiClient = new GameFrontClient();
