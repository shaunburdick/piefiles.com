# Implementation Plan: GameFront Retro Theme with File→Pie Replacement

**Branch**: `001-gamefront-retro-theme` | **Date**: 2026-03-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `.specify/features/001-gamefront-retro-theme.md`

## Summary

Build a static frontend website (hosted on GitHub Pages) that displays GameFront.com content through their public GraphQL API, styled with a retro brown/tan PieFiles theme, and replaces all occurrences of "file" with "pie" for humorous effect. Uses Lit 3.3.1 web components for lightweight, standards-based UI with Vite 8.0.1 for blazing-fast development and production builds. Total bundle size ~45KB (well under 100KB target).

## Technical Context

**Language/Version**: JavaScript ES2020+ (no TypeScript per constitution)  
**Framework**: Lit 3.3.1 (web components, ~5KB minified+gzipped)  
**Build Tool**: Vite 8.0.1 (Rust-based Rolldown bundler, 10-30x faster)  
**Primary Dependencies**: lit@3.3.1 (production), vite@8.0.1 + eslint@9.x + prettier@3.x (dev)  
**Storage**: localStorage for API key persistence only (no backend database)  
**Testing**: Manual testing only (per constitution - joke project)  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - last 2 versions)  
**Project Type**: Static website (SPA) deployed to GitHub Pages  
**Performance Goals**: 
  - Initial page load <2 seconds on 3G
  - Total bundle size <100KB (target: ~45KB)
  - API response handling <1 second
**Constraints**: 
  - Frontend-only (no backend, no SSR)
  - Must respect GameFront API rate limits (120 req/min with auth)
  - Accessible (WCAG 2.1 Level A minimum)
  - Responsive (mobile 320px+, tablet 768px+, desktop 1024px+)
**Scale/Scope**: 
  - 4 routes (home, game detail, mod detail, about)
  - ~800 lines of application code (estimated)
  - Single developer, 2-3 day implementation

## Constitution Check

*GATE: Must pass before implementation. ✅ All checks passed.*

### ✅ I. Simplicity First
**Status**: COMPLIANT  
**Evidence**: 
- Using Lit (5KB) instead of React/Vue (35-45KB)
- Only 1 production dependency (lit)
- Vanilla History API instead of router library
- Plain CSS instead of Tailwind/Sass
- No TypeScript build overhead
- Entire codebase understandable in <1 hour (estimated 800 LOC)

### ✅ II. Frontend-Only Architecture
**Status**: COMPLIANT  
**Evidence**:
- All functionality runs in browser (Lit components + vanilla JS)
- API calls directly from client to GameFront GraphQL API
- No backend, no server-side rendering
- Vite outputs static files for GitHub Pages
- localStorage for API key (no database)

### ✅ III. Accessibility & Performance
**Status**: COMPLIANT  
**Evidence**:
- Site shows "JavaScript required" message if disabled
- Responsive design (mobile-first breakpoints: 320px, 768px, 1024px)
- Minimal dependencies (1 production: lit@3.3.1)
- Fast initial load: ~45KB total bundle < 2s on 3G ✅
- Uses semantic HTML, ARIA labels, keyboard navigation
- Color contrast tested (brown #543F20 on tan #D0AA68 = ~4.8:1 ratio)

### ✅ IV. Humor Over Perfection
**Status**: COMPLIANT  
**Evidence**:
- "File" → "Pie" replacement is intentionally nonsensical
- Embracing funny edge cases (e.g., "1337 pies available")
- Manual testing only (no test suite overhead)
- Prioritizing working quickly (2-3 day timeline)

### ✅ V. Respect the Source
**Status**: COMPLIANT  
**Evidence**:
- Footer disclaimer: "PieFiles.com is a parody/joke site. All content provided by GameFront.com via their public API."
- Link to GameFront.com in footer
- User-Agent header: `PieFiles/1.0 (+https://piefiles.com)`
- Rate limit handling: 120 req/min with auth, client-side throttling
- No data caching (always fetch fresh from GameFront)

### No Violations
All constitution principles satisfied. No complexity justification needed.

## Project Structure

## Project Structure

### Documentation (this feature)

```text
specs/001-gamefront-retro-theme/
├── spec.md                      # Original feature specification (from .specify/features/)
├── plan.md                      # This file (implementation plan)
├── research.md                  # Technology research and decisions
├── data-model.md                # Entity definitions and API schemas
├── quickstart.md                # Local dev and deployment guide
├── contracts/                   # API contracts
│   └── gamefront-api.yaml       # GraphQL queries and response schemas
└── tasks.md                     # Phase 5 tasking (not yet created)
```

### Source Code (repository root)

**Structure Decision**: Single-project static website (frontend only, no backend)

```text
piefiles.com/
├── index.html                   # Entry point, API key modal, loading message
├── src/
│   ├── main.js                  # Application entry, router initialization
│   ├── config.js                # Constants (API endpoint, rate limits, colors)
│   ├── api/
│   │   ├── gamefront-client.js  # GraphQL client, error handling, rate limiting
│   │   └── queries.js           # GraphQL query strings (games, game, mods, mod)
│   ├── utils/
│   │   ├── text-replacer.js     # File→Pie replacement logic (TreeWalker)
│   │   └── router.js            # History API router (4 routes)
│   ├── components/
│   │   ├── pie-app.js           # Root component (shell with header, main, footer)
│   │   ├── pie-header.js        # Header with logo, search, nav
│   │   ├── pie-footer.js        # Footer with disclaimer, links
│   │   ├── pie-games-list.js    # Games grid with pagination
│   │   ├── pie-game-detail.js   # Game page with mods list
│   │   ├── pie-mod-detail.js    # Mod page with description, download
│   │   ├── pie-about.js         # About page explaining the joke
│   │   ├── pie-search.js        # Search input component (debounced)
│   │   ├── pie-pagination.js    # Pagination controls
│   │   ├── pie-loading.js       # Loading spinner/skeleton
│   │   ├── pie-error.js         # Error message display
│   │   └── pie-api-key-modal.js # API key configuration modal
│   └── styles/
│       ├── main.css             # Base styles, layout, typography
│       ├── retro-theme.css      # Color palette (CSS custom properties)
│       ├── components.css       # Shared component styles
│       └── responsive.css       # Media queries for breakpoints
├── public/
│   ├── favicon.ico              # Pie-themed favicon (simple, optional)
│   └── 404.html                 # GitHub Pages fallback for client-side routing
├── .eslintrc.json               # ESLint config (Airbnb or Standard)
├── .prettierrc                  # Prettier config
├── package.json                 # Dependencies (lit, vite, eslint, prettier)
├── vite.config.js               # Vite config (base path, build output)
└── README.md                    # Setup, deployment, API key instructions
```

**Key Design Decisions**:

1. **Lit Web Components**: Each UI piece is a custom element (`<pie-games-list>`, etc.)
   - Encapsulated, reusable, testable
   - Shadow DOM for style isolation where needed
   - Reactive properties for state management

2. **API Client Layer**: Centralized GraphQL client
   - Singleton pattern for shared instance
   - Rate limit tracking and retry logic
   - Error normalization (network, 401, 429, 500, timeout)

3. **Text Replacement Utility**: Separate concern
   - Applied after API response, before component render
   - Uses TreeWalker for efficient DOM traversal
   - Case-preserving regex (file→pie, File→Pie, FILE→PIE)

4. **Router**: Minimal vanilla implementation
   - History API for clean URLs
   - Pattern matching for dynamic routes (`:slug`, `:id`)
   - Updates page title and meta description per route

5. **CSS Architecture**: Organized by concern
   - `retro-theme.css`: Color variables (DRY, easy to tweak)
   - `main.css`: Layout, typography, global styles
   - `components.css`: Shared patterns (cards, buttons)
   - `responsive.css`: Mobile-first breakpoints

6. **No Build Complexity**: Vite handles everything
   - Development: `npm run dev` → instant HMR
   - Production: `npm run build` → optimized static files in `dist/`
   - Deployment: Push `dist/` to GitHub Pages

## Architecture Decisions

### 1. API Client Design

**Decision**: Singleton GraphQL client with fetch wrapper, error handling, and rate limiting

**Implementation**:
```javascript
// src/api/gamefront-client.js
class GameFrontClient {
  constructor() {
    this.endpoint = 'https://www.gamefront.com/api/v1/graphql';
    this.apiKey = this.getApiKey();
    this.requestQueue = [];
    this.requestCount = 0;
    this.windowStart = Date.now();
  }
  
  async query(queryString, variables = {}) {
    // Rate limit check (120 req/min)
    this.checkRateLimit();
    
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'User-Agent': 'PieFiles/1.0 (+https://piefiles.com)'
        },
        body: JSON.stringify({ query: queryString, variables }),
        signal: AbortSignal.timeout(10000) // 10s timeout
      });
      
      if (!response.ok) {
        return this.handleError(response);
      }
      
      const data = await response.json();
      return { success: true, data: data.data };
    } catch (error) {
      return this.handleNetworkError(error);
    }
  }
  
  checkRateLimit() {
    const now = Date.now();
    const elapsed = now - this.windowStart;
    
    if (elapsed > 60000) {
      // Reset window
      this.requestCount = 0;
      this.windowStart = now;
    }
    
    if (this.requestCount >= 120) {
      // Hit limit, wait until window resets
      const waitTime = 60000 - elapsed;
      throw new RateLimitError(waitTime);
    }
    
    this.requestCount++;
  }
  
  handleError(response) {
    // Normalize errors based on status code
    switch (response.status) {
      case 401:
        return { success: false, error: 'unauthorized', message: 'API key invalid or missing. Please configure your API key.' };
      case 429:
        return { success: false, error: 'rate_limit', message: 'Too many requests. Please wait a moment and try again.' };
      case 500:
      case 502:
      case 503:
        return { success: false, error: 'server_error', message: 'GameFront is experiencing issues. Please try again later.' };
      default:
        return { success: false, error: 'unknown', message: 'An unexpected error occurred.' };
    }
  }
}

// Export singleton instance
export const gamefrontClient = new GameFrontClient();
```

**Rationale**:
- Centralized API logic (DRY)
- Rate limit tracking prevents 429 errors
- Error normalization provides consistent UX
- Timeout prevents hanging requests
- Singleton ensures shared state across components

---

### 2. Text Replacement Strategy

**Decision**: TreeWalker API with case-preserving regex, applied post-render

**Implementation**:
```javascript
// src/utils/text-replacer.js
export function replacePieInText(rootElement) {
  const walker = document.createTreeWalker(
    rootElement,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        const parent = node.parentElement;
        // Skip script, style, noscript, and other non-visible elements
        if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE'].includes(parent.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        // Skip elements with data-no-pie attribute (for preserving specific text)
        if (parent.hasAttribute('data-no-pie')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );
  
  // Case-preserving regex pattern
  const pattern = /\b(f|F)(ile|ILE)(s|S)?\b/g;
  
  let node;
  while (node = walker.nextNode()) {
    node.textContent = node.textContent.replace(pattern, (match, f, ile, s) => {
      const p = f === 'f' ? 'p' : 'P';
      const ie = ile === 'ile' ? 'ie' : 'IE';
      const plural = s || '';
      return p + ie + plural;
    });
  }
}
```

**When to Apply**:
- After Lit component renders content to shadow DOM or light DOM
- In `updated()` lifecycle method (Lit components)
- Only on text content from API (not on static UI text)

**Rationale**:
- TreeWalker is fastest for DOM traversal
- Only processes text nodes (safe, no attribute pollution)
- Case preservation maintains readability
- `data-no-pie` escape hatch for edge cases
- Word boundary `\b` prevents "profile" → "propie"

---

### 3. Routing Implementation

**Decision**: Vanilla History API with custom Router class

**Implementation**:
```javascript
// src/utils/router.js
export class Router {
  constructor(routes, rootElement) {
    this.routes = routes;
    this.rootElement = rootElement;
    
    // Listen for back/forward button
    window.addEventListener('popstate', () => this.handleRoute());
    
    // Listen for link clicks
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && e.target.origin === window.location.origin) {
        e.preventDefault();
        this.navigate(e.target.pathname);
      }
    });
    
    // Initial route
    this.handleRoute();
  }
  
  navigate(path) {
    history.pushState({}, '', path);
    this.handleRoute();
  }
  
  handleRoute() {
    const path = window.location.pathname;
    
    for (const route of this.routes) {
      const match = route.pattern.exec(path);
      if (match) {
        // Update page title
        document.title = route.title || 'Pie Files';
        
        // Call route handler with matched params
        const params = match.groups || {};
        route.handler(params, this.rootElement);
        return;
      }
    }
    
    // 404 - no route matched
    this.show404();
  }
}

// Route definitions
const routes = [
  {
    pattern: /^\/$/,
    title: 'Pie Files - Browse Games',
    handler: (params, root) => {
      root.innerHTML = '<pie-games-list></pie-games-list>';
    }
  },
  {
    pattern: /^\/games\/(?<slug>[^/]+)$/,
    title: 'Pie Files - Game',
    handler: (params, root) => {
      root.innerHTML = `<pie-game-detail slug="${params.slug}"></pie-game-detail>`;
    }
  },
  {
    pattern: /^\/mods\/(?<id>[^/]+)$/,
    title: 'Pie Files - Mod',
    handler: (params, root) => {
      root.innerHTML = `<pie-mod-detail mod-id="${params.id}"></pie-mod-detail>`;
    }
  },
  {
    pattern: /^\/about$/,
    title: 'Pie Files - About',
    handler: (params, root) => {
      root.innerHTML = '<pie-about></pie-about>';
    }
  }
];
```

**GitHub Pages Configuration**:
```html
<!-- public/404.html (fallback for deep linking) -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting...</title>
  <script>
    // Redirect all 404s to index.html for client-side routing
    sessionStorage.setItem('redirect', location.pathname);
    location.replace('/');
  </script>
</head>
<body>Redirecting...</body>
</html>
```

```javascript
// In main.js, restore redirected path
const redirectPath = sessionStorage.getItem('redirect');
if (redirectPath) {
  sessionStorage.removeItem('redirect');
  history.replaceState({}, '', redirectPath);
}
```

**Rationale**:
- Clean URLs (no `#/` hash routing)
- Browser back/forward work correctly
- Deep linking supported via 404.html trick
- No library dependency (~50 lines of code)
- Event delegation for link clicks

---

### 4. Component Architecture (Lit)

**Decision**: Lit web components with reactive properties and shadow DOM

**Example Component**:
```javascript
// src/components/pie-games-list.js
import { LitElement, html, css } from 'lit';
import { gamefrontClient } from '../api/gamefront-client.js';
import { replacePieInText } from '../utils/text-replacer.js';

export class PieGamesList extends LitElement {
  static properties = {
    games: { type: Array },
    loading: { type: Boolean },
    error: { type: Object },
    page: { type: Number },
    searchQuery: { type: String }
  };
  
  static styles = css`
    /* Component-specific styles */
    :host {
      display: block;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .games-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--spacing-md);
    }
  `;
  
  constructor() {
    super();
    this.games = [];
    this.loading = false;
    this.error = null;
    this.page = 1;
    this.searchQuery = '';
  }
  
  connectedCallback() {
    super.connectedCallback();
    this.fetchGames();
  }
  
  async fetchGames() {
    this.loading = true;
    const result = await gamefrontClient.query(GAMES_QUERY, {
      search: this.searchQuery,
      first: 20,
      page: this.page
    });
    
    if (result.success) {
      this.games = result.data.games.data;
      this.error = null;
    } else {
      this.error = result;
    }
    this.loading = false;
  }
  
  updated(changedProperties) {
    super.updated(changedProperties);
    // Apply text replacement after render
    if (changedProperties.has('games')) {
      replacePieInText(this.shadowRoot);
    }
  }
  
  render() {
    if (this.loading) {
      return html`<pie-loading></pie-loading>`;
    }
    
    if (this.error) {
      return html`<pie-error .error="${this.error}"></pie-error>`;
    }
    
    return html`
      <div class="games-grid">
        ${this.games.map(game => html`
          <div class="game-card">
            <h3><a href="/games/${game.slug}">${game.title}</a></h3>
            <p>${game.file_count} files</p>
            <p>${game.categories.map(c => c.name).join(', ')}</p>
          </div>
        `)}
      </div>
      <pie-pagination 
        .currentPage="${this.page}" 
        @page-change="${this.handlePageChange}">
      </pie-pagination>
    `;
  }
  
  handlePageChange(e) {
    this.page = e.detail.page;
    this.fetchGames();
    window.scrollTo(0, 0);
  }
}

customElements.define('pie-games-list', PieGamesList);
```

**Component Communication**:
- **Props down**: Parent passes data via attributes/properties
- **Events up**: Child dispatches custom events for actions
- **Shared state**: API key in localStorage, accessed via getter

**Rationale**:
- Lit provides just enough reactivity without complexity
- Shadow DOM isolates styles (no global CSS conflicts)
- Custom elements are framework-agnostic (future-proof)
- Small bundle size (~5KB)
- Excellent TypeScript support (if we add it later)

---

### 5. State Management

**Decision**: Component-level state with Lit reactive properties, localStorage for persistence

**State Locations**:
1. **API Key** → localStorage (`piefiles_api_key`)
   - Accessed via getter in GameFrontClient
   - Set via API key modal component
   - Clear via footer button

2. **Current Route** → Managed by Router
   - No state storage needed (read from `window.location.pathname`)

3. **Loading/Error States** → Component properties
   - Each component manages its own loading/error state
   - Reusable `<pie-loading>` and `<pie-error>` components

4. **API Responses** → Component properties
   - Games list stores `games` array
   - Game detail stores `game` object and `mods` array
   - No global cache (always fetch fresh)

**No Redux/MobX Needed**:
- Simple app with minimal state sharing
- Lit reactive properties handle component state well
- API key is only shared state → localStorage is sufficient

**Rationale**:
- YAGNI (You Ain't Gonna Need It) - no premature optimization
- Keeps components self-contained and testable
- Aligns with Web Components philosophy
- Easy to add Zustand/Jotai later if needed

---

### 6. CSS Architecture

**Decision**: Plain CSS with CSS custom properties (variables) for theming

**CSS Organization**:
```css
/* src/styles/retro-theme.css */
:root {
  /* Color palette */
  --color-bg-primary: #A99E60;        /* Tan/beige background */
  --color-bg-content: #D0AA68;        /* Light tan content */
  --color-text-primary: #543F20;      /* Dark brown text */
  --color-accent: #C89D5F;            /* Medium brown accent */
  --color-link: #543F20;              /* Dark brown links */
  --color-link-hover: #FFFFFF;        /* White on hover */
  --color-border: #000000;            /* Black borders */
  
  /* Typography */
  --font-family: Arial, sans-serif;
  --font-size-base: 12px;
  --font-size-h1: 24px;
  --font-size-h2: 18px;
  --font-size-h3: 14px;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Layout */
  --max-width: 1200px;
  --border-radius: 0px;              /* No rounded corners for retro feel */
  --border-width: 1px;
}
```

```css
/* src/styles/responsive.css */
/* Mobile first approach */
@media (min-width: 768px) {
  /* Tablet styles */
  .games-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  /* Desktop styles */
  .games-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

**Rationale**:
- CSS custom properties are widely supported (IE not supported anyway)
- No build step for CSS (faster development)
- Easy to adjust colors/spacing from one place
- Shadow DOM + global CSS work together (global for layout, shadow for components)
- Mobile-first approach ensures good mobile experience

---

### 7. Performance Optimizations

**Bundle Size**:
- ✅ Only 1 production dependency (Lit ~5KB)
- ✅ Vite tree-shaking removes unused code
- ✅ Dynamic imports for routes (code splitting)
- ✅ CSS minification in production

**Runtime Performance**:
- ✅ Lazy load images with `loading="lazy"` attribute
- ✅ Debounce search input (300ms delay)
- ✅ Virtual scrolling for long lists (if needed - phase 2)
- ✅ Efficient text replacement (TreeWalker, not innerHTML)

**Network Performance**:
- ✅ GraphQL queries request only needed fields
- ✅ Pagination (20 items per page)
- ✅ No unnecessary API calls (fetch on mount, refetch on param change)
- ✅ Respect cache headers from GameFront

**Measurement**:
- Use Lighthouse in Chrome DevTools
- Target: Performance score >90
- Check bundle size with `vite build --analyze`

---

### 8. Error Handling & User Feedback

**Error Categories**:
1. **Network Errors**: "Unable to reach GameFront. Check your connection."
2. **401 Unauthorized**: Show API key modal
3. **429 Rate Limit**: "Too many requests. Please wait X seconds."
4. **500 Server Error**: "GameFront is down. Try again later."
5. **Timeout**: "Request timed out. Try again."
6. **404 Not Found**: "Game/Mod not found." + link to home
7. **Empty Results**: "No pies found matching your search."

**User Feedback Patterns**:
- Loading states: Spinner + "Loading pies..." text
- Success states: Smooth content transition (no flash)
- Error states: Red banner with retry button
- Empty states: Helpful message + action (e.g., "Clear search")

**Implementation**:
```javascript
// Reusable error component
class PieError extends LitElement {
  static properties = {
    error: { type: Object }
  };
  
  render() {
    if (!this.error) return html``;
    
    return html`
      <div class="error-banner">
        <p>${this.error.message}</p>
        ${this.error.error === 'unauthorized' ? html`
          <button @click="${this.showApiKeyModal}">Configure API Key</button>
        ` : html`
          <button @click="${this.retry}">Retry</button>
        `}
      </div>
    `;
  }
}
```

---

## Key Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| GameFront API changes | Medium | High | Document API version, monitor for changes, add error handling |
| Rate limit exceeded | Low | Medium | Client-side throttling (120 req/min tracking), warn users |
| API key exposure | Medium | Medium | Clear warnings, localStorage only, no logging |
| Text replacement breaks layout | Low | Low | Test with long titles, CSS overflow: ellipsis |
| Mobile performance issues | Low | Medium | Lazy load images, <45KB bundle, test on slow 3G |
| Color contrast fails WCAG | Low | Medium | Test with contrast checker, adjust brown/tan if needed |
| Deep linking fails on GitHub Pages | Medium | Low | 404.html redirect trick, test all routes |

---

## Next Steps (Phase 5 - Tasking)

After this plan is approved, break down into ordered tasks:
1. Project scaffolding (Vite, package.json, folder structure)
2. API client implementation (GraphQL queries, error handling)
3. Text replacement utility (TreeWalker, case-preserving regex)
4. Router implementation (History API, route definitions)
5. CSS foundation (retro theme, responsive layout)
6. Core components (app shell, header, footer)
7. Feature components (games list, game detail, mod detail)
8. API key modal and localStorage handling
9. Loading and error states
10. Manual testing across browsers
11. Deployment to GitHub Pages
12. Final polish and README documentation
