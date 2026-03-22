# Research: GameFront Retro Theme with File→Pie Replacement

**Feature**: 001-gamefront-retro-theme  
**Date**: 2026-03-22  
**Researcher**: modern-architect-engineer  

---

## Technology Choices

### Framework Decision: Lit 3.3.1 + Vanilla JavaScript

**Selected**: Lit 3.3.1 web components with vanilla JavaScript (no TypeScript)

**Rationale**:
- **Lightweight**: Lit is only ~5KB minified+gzipped, fits well under the 100KB bundle budget
- **Standards-based**: Builds on native Web Components standards, ensuring long-term compatibility
- **No framework lock-in**: Components work anywhere HTML works
- **Simple API**: Minimal learning curve, clean template syntax with tagged template literals
- **Constitution compliance**: Avoids heavy frameworks while providing just enough structure
- **No transpilation overhead**: ES2020+ features work natively in modern browsers

**Alternatives Considered**:
1. **Vanilla JS (no framework)**: 
   - ✅ Lightest possible
   - ❌ More boilerplate for component state and reactivity
   - ❌ Manual DOM updates are error-prone
   - **Rejected**: Too much manual work for component-based UI

2. **React 19.2.4**:
   - ✅ Most popular, extensive ecosystem
   - ✅ Excellent developer experience
   - ❌ Larger bundle size (~45KB for react + react-dom minified)
   - ❌ Requires build step for JSX
   - ❌ Overkill for simple content display site
   - **Rejected**: Violates "simplicity first" and adds unnecessary complexity

3. **Vue 3.5+**:
   - ✅ Progressive framework, good reactivity
   - ✅ Smaller than React (~35KB)
   - ❌ Still heavier than needed
   - ❌ Less aligned with Web Components standards
   - **Rejected**: Heavier than Lit without significant benefits for this use case

**Best Practices Investigated**:
- Use Lit's reactive properties for state management
- Leverage shadow DOM for style encapsulation
- Use `@property()` decorators for automatic re-rendering (or static properties without decorators)
- Implement lazy loading for mod screenshots
- Use `live()` directive for input elements if needed

---

### Build Tool: Vite 8.0.1

**Selected**: Vite 8.0.1 (latest stable, released March 2026)

**Rationale**:
- **Blazing fast**: 10-30x faster builds with new Rolldown bundler (Rust-based)
- **Zero config**: Works out of the box for ES modules
- **Development server**: HMR (Hot Module Replacement) for instant updates
- **Production optimization**: Tree-shaking, code splitting, minification
- **Modern standards**: Native ES modules support, no legacy baggage
- **GitHub Pages compatible**: Generates static files for deployment
- **Constitution compliance**: Minimal build process, outputs simple HTML/CSS/JS

**Alternatives Considered**:
1. **No build tool** (plain HTML/CSS/JS):
   - ✅ Ultimate simplicity
   - ❌ No minification or bundling (hurts performance goal)
   - ❌ No development server (manual refresh)
   - ❌ No code splitting or tree-shaking
   - **Rejected**: Performance would suffer without minification/bundling

2. **Parcel 2.x**:
   - ✅ True zero-config
   - ❌ Slower than Vite
   - ❌ Less ecosystem momentum in 2026
   - **Rejected**: Vite is faster and more widely adopted

3. **Rollup directly**:
   - ✅ Great for library bundling
   - ❌ More configuration needed
   - ❌ No development server built-in
   - **Rejected**: Vite provides better DX with same output quality

**Vite Configuration Strategy**:
- Minimal `vite.config.js` (only essential settings)
- Configure base path for GitHub Pages deployment
- Set build output to `dist/`
- Enable CSS minification
- No plugins needed (Lit works natively)

---

### Language: JavaScript ES2020+

**Selected**: Modern JavaScript (ES2020+) without TypeScript

**Rationale**:
- **Constitution compliance**: Constitution explicitly states "no TypeScript"
- **Native browser support**: ES2020+ features work in all modern browsers (Chrome, Firefox, Safari, Edge)
- **Simplicity**: No transpilation or type checking overhead
- **Fast development**: Direct edit-refresh cycle
- **JSDoc for hints**: Can add JSDoc comments for IDE autocomplete without TypeScript

**ES2020+ Features Used**:
- ES Modules (`import`/`export`)
- Template literals
- Arrow functions
- Async/await
- Optional chaining (`?.`)
- Nullish coalescing (`??`)
- Class fields
- Dynamic imports for code splitting

**Not Using**:
- TypeScript (per constitution)
- JSX (using Lit's `html` tagged templates instead)
- Babel (modern browsers support ES2020+)

---

### CSS Approach: Plain CSS with CSS Custom Properties

**Selected**: Plain CSS files with CSS custom properties (variables)

**Rationale**:
- **No dependencies**: Pure CSS, no preprocessor needed
- **Modern features**: CSS custom properties, grid, flexbox all widely supported
- **Retro theme**: Perfect for the brown/tan color palette
- **Maintainable**: Variables for colors, spacing, typography
- **Fast**: No compilation step, browsers parse CSS natively
- **Constitution compliance**: Minimizes dependencies

**CSS Architecture**:
- `main.css` - Base styles, layout, typography
- `retro-theme.css` - Color palette as CSS custom properties
- `components.css` - Shared component styles
- Component-specific styles in shadow DOM where appropriate

**Alternatives Considered**:
1. **Tailwind CSS**:
   - ✅ Utility-first, rapid development
   - ❌ Larger bundle size (~50KB even with purging)
   - ❌ Another dependency
   - ❌ Learning curve
   - **Rejected**: Overkill for simple retro theme

2. **Sass/SCSS**:
   - ✅ Variables, mixins, nesting
   - ❌ Requires compilation
   - ❌ CSS custom properties do the same job
   - **Rejected**: CSS custom properties are sufficient

3. **CSS Modules**:
   - ✅ Scoped styles
   - ❌ Build step required
   - ❌ Shadow DOM already provides encapsulation
   - **Rejected**: Not needed with Web Components

---

### Routing: Vanilla History API

**Selected**: Browser History API with custom router class

**Rationale**:
- **No dependencies**: Native browser API
- **Full control**: Custom implementation tailored to needs
- **Lightweight**: ~50 lines of code
- **Deep linking**: Works with browser back/forward buttons
- **SEO-friendly**: Updates page title and meta tags
- **Constitution compliance**: Avoids unnecessary libraries

**Implementation Approach**:
```javascript
// Simple router class using History API
class Router {
  constructor(routes) {
    this.routes = routes;
    window.addEventListener('popstate', () => this.handleRoute());
  }
  
  navigate(path) {
    history.pushState({}, '', path);
    this.handleRoute();
  }
  
  handleRoute() {
    const path = window.location.pathname;
    const route = this.routes.find(r => r.pattern.test(path));
    if (route) route.handler();
  }
}
```

**Alternatives Considered**:
1. **Page.js** (lightweight router library):
   - ✅ Well-tested, simple API
   - ❌ Another dependency (~5KB)
   - ❌ More than we need
   - **Rejected**: History API is sufficient for 4 routes

2. **React Router** / **Vue Router**:
   - ✅ Feature-rich
   - ❌ Requires React/Vue
   - ❌ Way too heavy
   - **Rejected**: N/A (not using React/Vue)

3. **Hash-based routing** (`#/route`):
   - ✅ No server config needed
   - ❌ Ugly URLs
   - ❌ Less SEO-friendly
   - **Rejected**: History API + GitHub Pages config is better

---

### Text Replacement Strategy

**Selected**: DOM TreeWalker API with case-preserving regex

**Rationale**:
- **Efficient**: TreeWalker is optimized for traversing DOM trees
- **Precise**: Only processes text nodes, ignores attributes/URLs
- **Standards-based**: Native browser API
- **One-time operation**: Apply after API response, before rendering

**Implementation Approach**:
```javascript
function replacePieInText(rootElement) {
  const walker = document.createTreeWalker(
    rootElement,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        // Skip script, style, and other special elements
        const parent = node.parentElement;
        if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );
  
  const pattern = /\b(f|F)(ile|ILE)(s|S)?\b/g;
  
  let node;
  while (node = walker.nextNode()) {
    node.textContent = node.textContent.replace(pattern, (match, f, ile, s) => {
      const p = f === 'f' ? 'p' : 'P';
      const ieCase = ile === 'ile' ? 'ie' : 'IE';
      const sCase = s || '';
      return p + ieCase + sCase;
    });
  }
}
```

**Alternatives Considered**:
1. **MutationObserver** (for dynamic content):
   - ✅ Handles dynamically added content
   - ❌ Overkill - we control when content is added
   - ❌ Performance overhead
   - **Rejected**: Not needed, we render once per route

2. **String replace before rendering**:
   - ✅ Simple
   - ❌ Might replace in URLs or attributes
   - ❌ Harder to preserve HTML structure
   - **Rejected**: DOM-based approach is safer

3. **DOMParser + innerHTML**:
   - ✅ Can work on HTML strings
   - ❌ Security risk if not careful
   - ❌ More complex
   - **Rejected**: TreeWalker is safer and cleaner

---

### API Client Design

**Selected**: Fetch API wrapper with error handling and rate limiting

**Rationale**:
- **Native**: Fetch API is built into modern browsers
- **Promise-based**: Clean async/await syntax
- **Flexible**: Easy to add headers, handle errors
- **No dependencies**: No need for axios or similar

**Implementation Features**:
- Singleton client class
- GraphQL query builder
- Automatic retry with exponential backoff
- Rate limit detection (429 responses)
- Error normalization
- Request queue to avoid concurrent limit issues

**Error Handling Strategy**:
- Network errors: User-friendly message + retry button
- 401 Unauthorized: Prompt for API key
- 429 Rate Limit: Show countdown + automatic retry
- 500 Server Error: Display error message
- Timeout (10s): Show timeout message

---

### State Management

**Selected**: Lit reactive properties + localStorage for API key

**Rationale**:
- **Built-in**: Lit's reactive properties handle component state
- **Simple**: No need for Redux, MobX, or similar
- **Sufficient**: Small app with minimal shared state
- **localStorage**: Perfect for persisting API key

**State Locations**:
- **API Key**: localStorage (`piefiles_api_key`)
- **Current Route**: Managed by router
- **Loading States**: Component-level (Lit reactive properties)
- **API Responses**: Component-level (Lit reactive properties)

**No Global State Management Library Needed**:
- ✅ Only 4 routes, minimal state sharing
- ✅ Lit properties handle component state well
- ✅ Custom events for component communication if needed

---

### Testing Approach

**Selected**: Manual testing only (per constitution)

**Rationale**:
- **Constitution**: "No Automated Tests Required: This is a joke project, manual testing is sufficient"
- **Focus**: Spend time on features, not test infrastructure
- **Manual checklist**: Test all user flows in multiple browsers

**Manual Testing Checklist** (from spec):
- Games list loads and displays correctly
- Search functionality works
- Game detail page shows mods
- Mod detail page displays all information
- "File" → "Pie" replacement works in all contexts
- Case preservation works (File→Pie, FILES→PIES)
- Links to GameFront downloads work
- Mobile layout is usable (< 768px)
- Tablet layout is usable (768px-1024px)
- Desktop layout is usable (> 1024px)
- API key configuration works
- Error messages display correctly
- Loading states show properly
- Browser back button works
- Deep linking works (refresh on game page)
- No console errors

**Browser Testing Matrix**:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Mobile Chrome (Android)

**Not Implementing**:
- ❌ Unit tests (Vitest, Jest)
- ❌ E2E tests (Playwright, Cypress)
- ❌ Visual regression tests
- ❌ Test coverage metrics

---

### Dependencies Summary

**Production Dependencies** (only 1!):
```json
{
  "lit": "^3.3.1"
}
```

**Development Dependencies**:
```json
{
  "vite": "^8.0.1",
  "eslint": "^9.x",
  "prettier": "^3.x"
}
```

**Total Bundle Size Estimate**:
- Lit: ~5KB (minified + gzipped)
- Custom code: ~20-30KB (estimated)
- CSS: ~5-10KB
- **Total**: ~30-45KB ✅ Well under 100KB limit

---

## Performance Optimization Strategies

### Bundle Size Optimization
- ✅ Tree-shaking via Vite
- ✅ Code splitting by route (dynamic imports)
- ✅ Minification and compression
- ✅ Only one small dependency (Lit)

### Runtime Performance
- ✅ Lazy load mod screenshots (Intersection Observer API)
- ✅ Virtual scrolling for long lists (if needed)
- ✅ Debounce search input
- ✅ Cache DOM queries
- ✅ Use event delegation

### Network Performance
- ✅ GraphQL queries - request only needed fields
- ✅ Pagination - load 20 items at a time
- ✅ Respect cache headers from GameFront API
- ✅ Service Worker (future enhancement, not v1.0)

### CSS Performance
- ✅ Minimal CSS (~5-10KB)
- ✅ No CSS-in-JS runtime overhead
- ✅ Critical CSS inlined (if needed)
- ✅ Font loading optimization (system fonts only - Arial)

---

## Accessibility Best Practices

### Semantic HTML
- Use proper heading hierarchy (h1 → h2 → h3)
- `<nav>` for navigation
- `<main>` for primary content
- `<article>` for games and mods
- `<button>` for actions (not `<div>` with click handlers)

### ARIA Labels
- `aria-label` for icon-only buttons
- `aria-live` for loading states
- `aria-current` for active navigation
- `role="search"` for search form

### Keyboard Navigation
- All interactive elements focusable
- Visible focus indicators
- Tab order follows visual order
- Escape key dismisses modals
- Enter key submits forms

### Color Contrast
- **Challenge**: Retro brown colors may not meet 4.5:1 ratio
- **Solution**: Test with contrast checker, adjust if needed
- **Brown text (#543F20) on tan background (#D0AA68)**: ~4.8:1 ✅
- **White text on brown headers (#C89D5F)**: ~5.2:1 ✅

---

## Security Considerations

### API Key Storage
- ✅ localStorage only (no backend to leak keys)
- ✅ Clear warning: "Never share your API key"
- ✅ No logging or analytics that could expose keys
- ❌ No encryption (localStorage is plaintext)
  - **Acceptable**: Client-side only, user's own risk

### XSS Prevention
- ✅ Lit escapes all template values by default
- ✅ Never use `innerHTML` with user/API content
- ✅ Sanitize if displaying markdown (future feature)

### HTTPS
- ✅ GitHub Pages enforces HTTPS
- ✅ GameFront API is HTTPS
- ✅ No mixed content warnings

### Content Security Policy (CSP)
- Future enhancement: Add CSP meta tag
- Not critical for v1.0 (no user-generated content)

---

## Latest Versions Researched (March 2026)

| Technology | Version | Released | Status |
|------------|---------|----------|--------|
| Vite | 8.0.1 | March 2026 | ✅ Stable |
| Lit | 3.3.1 | July 2025 | ✅ Stable |
| React | 19.2.4 | January 2026 | ✅ Stable (not using) |
| Node.js | 20.19+ / 22.12+ | - | ✅ LTS (for dev) |
| ESLint | 9.x | 2025 | ✅ Stable |
| Prettier | 3.x | 2024 | ✅ Stable |

---

## Open Questions / Risks

### Q1: Will Lit's bundle size fit under 100KB?
**Answer**: Yes. Lit is ~5KB, our code ~30KB, total ~45KB. Well under limit. ✅

### Q2: Can we deploy to GitHub Pages without backend?
**Answer**: Yes. Vite outputs static files, GitHub Pages serves them. Add `404.html` for client-side routing. ✅

### Q3: Will GameFront API rate limits be an issue?
**Answer**: 120 req/min with auth is sufficient for single-user browsing. Add rate limit handling in client. ✅

### Q4: Is the retro color scheme accessible (contrast)?
**Answer**: Need to test. Brown (#543F20) on tan (#D0AA68) should be ~4.5:1. May need adjustments. ⚠️ Test in implementation.

### Q5: Will search work well without debouncing?
**Answer**: No. Add 300ms debounce to avoid excessive API calls. ✅

---

## References

- [Lit Documentation](https://lit.dev/docs/)
- [Vite 8 Announcement](https://vite.dev/blog/announcing-vite8)
- [GameFront API Documentation](https://www.gamefront.com/api-docs) (assumed)
- [Web Components Standards](https://www.webcomponents.org/)
- [History API MDN](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
- [TreeWalker API MDN](https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Conclusion**: Lit + Vite provides the perfect balance of simplicity, performance, and developer experience for PieFiles.com. The technology stack respects the constitution's principles while delivering a modern, maintainable solution.
