# PieFiles.com - Agent Development Guide

**Last Updated**: 2026-03-22  
**Project Status**: ✅ Live and Deployed  
**Live URL**: https://piefiles.com

---

## Project Overview

PieFiles.com is a humorous parody frontend that displays GameFront.com gaming content with a retro 2005 brown/tan theme while replacing all instances of "file" with "pie" throughout the site. Built as a pure frontend application deployed on GitHub Pages.

**Key Characteristics**:

- Parody/joke project - humor over perfection
- Frontend-only (no backend/server)
- Static site hosted on GitHub Pages
- Calls GameFront GraphQL API directly from browser
- <100KB bundle size requirement
- Modern responsive design with retro aesthetics

---

## Constitution & Core Principles

**Location**: `.specify/memory/constitution.md`

### Critical Rules

1. **Simplicity First**: Keep it simple and maintainable. Entire codebase should be understandable in under an hour.

2. **Frontend-Only Architecture**: No backend, no server-side rendering. Everything runs in the browser.

3. **No TypeScript**: Use JavaScript ES2020+ only (per constitution decision).

4. **No Disabled Linting Rules**: NEVER use `eslint-disable`, `@ts-ignore`, `@ts-nocheck`, or similar. If linter complains, fix the code to comply.

5. **Bundle Size**: Must stay under 100KB total bundle size (currently ~91KB).

6. **Dependencies**: Minimize dependencies. Only essential libraries allowed.

7. **Humor Over Perfection**: Text replacement is meant to be funny and nonsensical. Don't overthink edge cases.

8. **Respect GameFront**: Include disclaimers, respect API rate limits (120 req/min authenticated), link to original site.

---

## Tech Stack

### Production Dependencies

- **lit@3.3.1** - Web Components framework (lightweight, standards-based)
- **dompurify@3.2.2** - HTML sanitization for security

### Development Dependencies

- **vite@8.0.1** - Build tool and dev server
- **eslint@9.0.0** - Code linting
- **prettier@3.0.0** - Code formatting
- **@eslint/js@9.39.4** - ESLint configuration
- **globals@17.4.0** - Global variable definitions for ESLint
- **terser@5.46.1** - JavaScript minification

### Language & Standards

- **JavaScript ES2020+** (NO TypeScript)
- **CSS3** with CSS Custom Properties
- **Lit Web Components** (standards-based, not framework-specific)

---

## Project Structure

```
piefiles.com/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions deployment workflow
├── .specify/
│   ├── features/
│   │   └── 001-gamefront-retro-theme.md  # Feature specification
│   ├── memory/
│   │   └── constitution.md         # Project principles & technical decisions
│   └── templates/                  # Spec-kit templates
├── public/
│   ├── CNAME                       # Custom domain config (piefiles.com)
│   └── placeholder.png             # Fallback image for invalid URLs
├── specs/
│   └── 001-gamefront-retro-theme/
│       ├── plan.md                 # Implementation plan
│       ├── tasks.md                # Task breakdown
│       ├── research.md             # Technology research
│       ├── data-model.md           # Data structures
│       ├── quickstart.md           # Validation scenarios
│       └── contracts/
│           └── gamefront-api.md    # API contract documentation
├── src/
│   ├── api/
│   │   ├── gamefront-client.js    # GraphQL API client with rate limiting
│   │   └── queries.js              # GraphQL query definitions
│   ├── components/
│   │   ├── pie-app.js              # Root component & routing coordinator
│   │   ├── pie-header.js           # Header with logo, search, flavor switcher
│   │   ├── pie-footer.js           # Footer with API settings & disclaimer
│   │   ├── pie-games-list.js       # Games grid with search & pagination
│   │   ├── pie-game-detail.js      # Game details with mods list
│   │   ├── pie-mod-detail.js       # Mod details with download info
│   │   ├── pie-api-key-modal.js    # API key configuration modal
│   │   └── pie-spinner.js          # Loading indicator
│   ├── utils/
│   │   ├── text-replacer.js        # File→Pie text replacement (case-preserving)
│   │   ├── router.js               # History API router
│   │   ├── sanitize.js             # HTML sanitization (XSS protection)
│   │   ├── image-validator.js      # Image URL validation (security)
│   │   └── pie-flavors.js          # Theme color switcher (6 pie flavors)
│   ├── styles/
│   │   ├── retro-theme.css         # CSS custom properties for colors
│   │   ├── main.css                # Base styles (163 lines)
│   │   └── responsive.css          # Mobile-first breakpoints
│   └── main.js                     # App entry point
├── index.html                      # Main HTML file with CSP meta tag
├── vite.config.js                  # Vite configuration (port 5174, CORS proxy)
├── eslint.config.js                # ESLint 9.x flat config
├── .prettierrc                     # Prettier configuration
├── package.json                    # Dependencies & scripts
├── README.md                       # User-facing documentation
├── DEPLOYMENT.md                   # Deployment guide
├── TESTING.md                      # Testing guide
└── AGENTS.md                       # This file (agent development guide)
```

---

## Development Commands

### Essential Commands

```bash
npm install           # Install dependencies
npm run dev           # Start dev server at http://localhost:5174
npm run build         # Build for production (output to dist/)
npm run preview       # Preview production build
npm run lint          # Run ESLint (must pass with zero errors)
npm run format        # Format code with Prettier
npm run format:check  # Check formatting without changing files
```

### Testing Protocol

```bash
# Run before EVERY commit (mandatory)
npm run lint          # Must pass with zero errors
npm run build         # Must complete successfully
# Manual testing in browser also required
```

**No automated test suite yet** - This is a known gap. Manual testing is currently required.

---

## Key Features & How They Work

### 1. Text Replacement (File → Pie)

**Location**: `src/utils/text-replacer.js`

- **Case-preserving**: "File" → "Pie", "FILE" → "PIE", "file" → "pie", "Files" → "Pies"
- **Regex**: `/\b([Ff])(ile)(s?)\b/g`
- **Applied to**: All text nodes in shadow DOM after component render
- **Not applied to**: URLs, code, HTML attributes
- **Called in**: Every component's `updated()` lifecycle method

### 2. API Integration

**Location**: `src/api/gamefront-client.js`, `src/api/queries.js`

- **API**: GameFront GraphQL API at `https://www.gamefront.com/api/v1/graphql`
- **Authentication**: Bearer token (users provide their own API keys)
- **Rate Limiting**: 120 requests/minute (authenticated)
- **Storage**: API key stored in `localStorage` (client-side only)
- **CORS**: Dev uses Vite proxy (`/api/v1/graphql`), production uses direct calls
- **Error Handling**: Comprehensive error messages, retry logic, rate limit detection

**GraphQL Queries**:

- `GET_GAMES` - Fetch paginated list of games with categories, descriptions, box art
- `SEARCH_GAMES` - Search games by query string
- `GET_GAME_DETAILS` - Fetch game details with mods list
- `GET_MOD_DETAILS` - Fetch mod details with download links, screenshots

### 3. Security Features

**XSS Prevention** (`src/utils/sanitize.js`):

- All HTML from API sanitized with DOMPurify before rendering
- Strict whitelist: allows only safe formatting tags (p, br, strong, em, a, etc.)
- Blocks: scripts, styles, iframes, event handlers, dangerous attributes

**Image URL Validation** (`src/utils/image-validator.js`):

- Whitelists only trusted domains: `osiris.gamefront.com`, `www.gamefront.com`, `gamefront.com`
- Requires HTTPS protocol
- Falls back to placeholder for invalid URLs

**Content Security Policy** (`index.html`):

- Restricts scripts to same-origin only
- Allows images/API calls only from whitelisted GameFront domains
- Blocks inline scripts and dangerous content
- Upgrades insecure requests to HTTPS

### 4. Routing

**Location**: `src/utils/router.js`, `src/components/pie-app.js`

- **Type**: Client-side routing with History API
- **Routes**:
  - `/` - Games list (default)
  - `/?search=query` - Search results
  - `/game/:slug` - Game details with mods
  - `/game/:slug/mod/:modId` - Mod details
- **Navigation**: Custom events (`game-selected`, `mod-selected`, `navigate`)
- **Back button**: Native browser back/forward work correctly

### 5. Pie Flavor Themes

**Location**: `src/utils/pie-flavors.js`, `src/components/pie-header.js`

- **Flavors**: Apple (original), Cherry, Blueberry, Pumpkin, Lemon, Pecan
- **Implementation**: Dynamically updates CSS custom properties
- **Persistence**: Saves selection to `localStorage`
- **Colors**: Each flavor has 5 color variants (primary-text, background, accent, content-bg, border)

### 6. Responsive Design

**Location**: `src/styles/responsive.css`

- **Mobile-first**: Base styles for mobile, progressively enhance for larger screens
- **Breakpoints**: 768px (tablet), 1024px (desktop)
- **Grid**: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
- **Touch-friendly**: 44x44px minimum touch targets

---

## API Key Configuration

**Required for all API calls**: GameFront API requires authentication.

### User Flow

1. User visits site without API key → modal appears
2. User clicks "Configure API Key" button in modal or footer
3. Modal shows instructions and input field
4. User enters API key and clicks "Test Connection"
5. App validates key with test GraphQL query
6. On success, key stored in `localStorage` and modal closes
7. On failure, error message shown with troubleshooting tips

### Developer Setup

1. Go to https://www.gamefront.com/account/api-keys
2. Create API key with `graphql:read` permission
3. Set allowed origins: `http://localhost:5174`, `https://piefiles.com`
4. Copy key and paste into app modal OR set in `.env` file

**Note**: `.env` file is in `.gitignore` and should NEVER be committed. It's for local dev convenience only.

---

## Development Workflow

### Starting a New Feature

1. **Check Constitution** (`.specify/memory/constitution.md`)
   - Ensure feature aligns with core principles
   - Verify technical constraints (no backend, <100KB bundle, etc.)

2. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Follow Spec-Kit Workflow** (if significant feature)
   - Create specification in `.specify/features/`
   - Create planning docs in `specs/`
   - Break down into tasks
   - Implement incrementally

4. **Development Rules**
   - ❌ NEVER disable linting rules
   - ❌ NEVER use TypeScript
   - ✅ Write JSDoc comments for all functions
   - ✅ Keep bundle size under 100KB
   - ✅ Test manually in Chrome, Firefox, Safari
   - ✅ Run `npm run lint && npm run build` before committing

5. **Security Checklist**
   - [ ] Sanitize all HTML from external sources with `sanitizeHTML()`
   - [ ] Validate all image URLs with `getSafeImageURL()`
   - [ ] Never store sensitive data (API keys stay in localStorage only)
   - [ ] Test CSP doesn't block legitimate functionality

6. **Commit & Push**

   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push -u origin feature/your-feature-name
   ```

7. **Create Pull Request**
   - Use descriptive title
   - Include summary of changes
   - Note any breaking changes
   - Verify CI passes (GitHub Actions runs lint + build)

### Making Quick Fixes

For small bug fixes or typo corrections:

```bash
git checkout -b fix/brief-description
# Make changes
npm run lint && npm run build  # Verify
git add .
git commit -m "fix: brief description of fix"
git push -u origin fix/brief-description
# Create PR
```

---

## Common Development Tasks

### Adding a New Component

1. Create file in `src/components/` (e.g., `pie-new-component.js`)
2. Import Lit: `import { LitElement, html, css } from 'lit'`
3. Create class extending `LitElement`
4. Define styles with `static styles = css`
5. Implement `render()` method
6. Add `updated()` method with text replacement:
   ```javascript
   updated() {
     replaceTextInElement(this.shadowRoot)
   }
   ```
7. Define custom element: `customElements.define('pie-new-component', PieNewComponent)`
8. Import in parent component
9. Add JSDoc comments for all methods
10. Test in browser

### Adding a New GraphQL Query

1. Open `src/api/queries.js`
2. Export new query as template string
3. Use in `src/api/gamefront-client.js`:
   ```javascript
   async function fetchData(variables) {
     return await apiClient.query(YOUR_QUERY, variables)
   }
   ```
4. Handle loading states and errors
5. Test with valid API key

### Adding a New Utility Function

1. Create file in `src/utils/` or add to existing file
2. Write JSDoc comment with description, params, returns, example
3. Export function
4. Import where needed
5. Add unit tests (when test suite is implemented)

### Updating Styles

1. **Global colors**: Edit `src/styles/retro-theme.css` (CSS custom properties)
2. **Base styles**: Edit `src/styles/main.css`
3. **Responsive**: Edit `src/styles/responsive.css`
4. **Component-specific**: Edit `static styles` in component file
5. Test on mobile, tablet, desktop viewports

---

## Debugging Tips

### Dev Server Issues

```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
npm run dev
```

### API Issues

1. Check browser console for error messages
2. Verify API key is set (check localStorage in DevTools)
3. Test API key directly in GraphQL playground: https://www.gamefront.com/api/v1/graphql
4. Check rate limits (120 req/min)
5. Verify CORS proxy is working (dev only)

### Text Replacement Not Working

1. Check `updated()` lifecycle method calls `replaceTextInElement(this.shadowRoot)`
2. Verify text is in text nodes (not attributes or URLs)
3. Check regex pattern in `text-replacer.js`
4. Look for errors in browser console

### Styling Issues

1. Inspect element in browser DevTools
2. Check CSS custom properties are defined in `:host` or `:root`
3. Verify Shadow DOM encapsulation (styles in component don't leak)
4. Test in different browsers (Chrome, Firefox, Safari)
5. Check responsive breakpoints at 768px and 1024px

### Build Issues

```bash
# Check bundle size
npm run build
# Look for "dist/assets/index-*.js" size in output

# If over 100KB, analyze bundle:
# 1. Check for large dependencies
# 2. Consider code splitting
# 3. Remove unused imports
```

---

## Deployment

**Automatic via GitHub Actions** - Every push to `main` branch triggers deployment.

### Deployment Workflow

1. **Merge PR to main** → GitHub Actions starts
2. **CI runs** → `npm install`, `npm run lint`, `npm run build`
3. **If successful** → `dist/` folder deployed to GitHub Pages
4. **Live in ~2 minutes** → https://piefiles.com updates

### Manual Deployment (Emergency)

```bash
# Build production bundle
npm run build

# Preview locally
npm run preview

# Deploy manually (if GitHub Actions is down)
# 1. Go to GitHub repository settings
# 2. Pages → Source → GitHub Actions
# 3. Manually trigger workflow
```

### Deployment Checklist

- [ ] All PRs merged to main
- [ ] CI passed (green checkmark in GitHub)
- [ ] No console errors in production site
- [ ] API key modal works for new users
- [ ] Search functionality works
- [ ] Game/mod navigation works
- [ ] Images load correctly
- [ ] Mobile layout looks good

---

## Security Guidelines

### XSS Prevention

**Always sanitize HTML from external sources**:

```javascript
import { sanitizeHTML } from '../utils/sanitize.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'

// In render method:
${unsafeHTML(sanitizeHTML(externalHTML))}
```

**Never use `unsafeHTML()` directly on API responses**.

### Image URL Validation

**Always validate image URLs from external sources**:

```javascript
import { getSafeImageURL } from '../utils/image-validator.js'

// In render method:
;<img src="${getSafeImageURL(game.box_art)}" alt="${game.title}" />
```

### API Key Storage

- **Do**: Store in `localStorage` (client-side only)
- **Don't**: Store in cookies, send to any server, log to console
- **Don't**: Commit API keys to git (`.env` is in `.gitignore`)

### Content Security Policy

**Current CSP** (in `index.html`):

- `default-src 'self'` - Only load resources from same origin
- `script-src 'self'` - Only execute scripts from same origin
- `style-src 'self' 'unsafe-inline'` - Allow inline styles (required for Lit)
- `img-src 'self' https://osiris.gamefront.com ...` - Whitelisted image domains
- `connect-src 'self' https://www.gamefront.com` - Whitelisted API domains

**Never weaken CSP** without security review and justification.

---

## Known Issues & Future Improvements

### Current Gaps

1. **No Automated Tests** (HIGH PRIORITY)
   - Need to add Vitest test suite
   - Test critical utilities: `text-replacer.js`, `router.js`, `sanitize.js`
   - Test API client error handling

2. **Accessibility Issues** (HIGH PRIORITY)
   - Missing ARIA attributes on modal, spinner, pagination
   - No keyboard navigation on game/mod cards
   - No focus management in modal
   - Need skip link for keyboard users

3. **Code Duplication** (MEDIUM PRIORITY)
   - `formatDate()` duplicated in `pie-game-detail.js` and `pie-mod-detail.js`
   - `formatFileSize()` duplicated in same components
   - Extract to shared utility file

4. **Search Race Condition** (MEDIUM PRIORITY)
   - Rapid typing in search can return out-of-order results
   - Need to cancel previous requests or use request IDs

5. **Error Boundary** (LOW PRIORITY)
   - Need error boundary component to catch render errors
   - Prevent full app crash from single component failure

### Enhancement Ideas

- [ ] Add favorites/bookmarks (localStorage)
- [ ] Add download history tracking
- [ ] Add "random pie" button (random game)
- [ ] Add keyboard shortcuts (? to show help)
- [ ] Add dark mode toggle (in addition to flavor themes)
- [ ] Add social sharing buttons
- [ ] Add PWA support (service worker, manifest)
- [ ] Add pagination on mod lists (currently loads all mods)

---

## Troubleshooting

### "API Key Required" modal keeps appearing

- Check `localStorage` in browser DevTools (Application tab)
- Look for `gamefront_api_key` entry
- If missing, key wasn't saved (test connection may have failed)
- Try clearing localStorage and re-entering key

### Search returns no results

- Verify API key is valid and has `graphql:read` permission
- Check browser console for error messages
- Verify search query is not empty
- Test same query in GameFront.com to see if results exist

### Images not loading

- Check image URLs are from whitelisted domains (console warnings)
- Verify CSP is not blocking images (console errors)
- Check `getSafeImageURL()` is being used in all components
- Fallback to placeholder should work for invalid URLs

### Text replacement is too aggressive

- Check regex pattern in `text-replacer.js`
- Verify word boundaries (`\b`) are working correctly
- If breaking URLs, ensure replacement is only on text nodes
- Consider excluding specific elements (add logic to `replaceTextInElement()`)

### Bundle size over 100KB

- Run `npm run build` and check output size
- Look for large dependencies in `package.json`
- Consider lazy loading components
- Remove unused imports
- Check for duplicate code

---

## Resources

### Project Documentation

- [Constitution](.specify/memory/constitution.md) - Core principles & technical decisions
- [Feature Spec](.specify/features/001-gamefront-retro-theme.md) - Requirements
- [Implementation Plan](specs/001-gamefront-retro-theme/plan.md) - Technical architecture
- [README.md](README.md) - User-facing documentation
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [TESTING.md](TESTING.md) - Testing guide

### External Documentation

- [GameFront API Docs](https://www.gamefront.com/api) - API reference
- [Lit Documentation](https://lit.dev) - Web components framework
- [Vite Documentation](https://vitejs.dev) - Build tool
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify) - HTML sanitization

### Live Site

- **Production**: https://piefiles.com
- **Dev Server**: http://localhost:5174

---

## Contact & Support

This is a personal humor project by Shaun Burdick.

- **Issues**: Use GitHub Issues for bugs or feature requests
- **Contributing**: PRs welcome for bug fixes and enhancements
- **Questions**: Open a GitHub Discussion

---

**Remember**: This is a fun joke project. Keep it simple, keep it funny, keep it maintainable. When in doubt, refer to the constitution and prioritize humor over perfection! 🥧
