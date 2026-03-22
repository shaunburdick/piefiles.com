# Quickstart Guide: PieFiles.com Development

**Feature**: 001-gamefront-retro-theme  
**Date**: 2026-03-22  
**Purpose**: Get PieFiles.com running locally and deployed to GitHub Pages

---

## Prerequisites

### Required Software

- **Node.js**: Version 20.19+ or 22.12+ ([Download](https://nodejs.org/))
- **npm**: Included with Node.js (or use yarn/pnpm)
- **Git**: For version control ([Download](https://git-scm.com/))
- **Modern Browser**: Chrome, Firefox, Safari, or Edge (latest version)
- **Code Editor**: VS Code recommended ([Download](https://code.visualstudio.com/))

### Optional Tools

- **VS Code Extensions**:
  - ESLint
  - Lit Plugin (syntax highlighting for Lit templates)
- **Browser Extensions**:
  - React DevTools (works with Lit too)
  - Lighthouse (performance testing)

---

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/shaunburdick/piefiles.com.git
cd piefiles.com
```

### 2. Install Dependencies

```bash
npm install
```

**Expected Output**:

```
added 3 packages, and audited 4 packages in 2s

found 0 vulnerabilities
```

**Dependencies Installed**:

- `lit@3.3.1` (production)
- `vite@8.0.1` (dev)
- `eslint@9.x` with `eslint-config-shaunburdick@6.0.3` (dev)

### 3. Verify Installation

```bash
npm run dev
```

**Expected Output**:

```
  VITE v8.0.1  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

Open http://localhost:5173/ in your browser.

---

## Get a GameFront API Key

PieFiles.com requires a GameFront API key to fetch data.

### Steps:

1. **Visit GameFront**: https://www.gamefront.com/
2. **Sign Up / Log In**: Create a free account (or log in)
3. **Navigate to API Keys**: https://www.gamefront.com/account/api-keys
4. **Create New Key**: Click "Generate API Key"
5. **Copy Key**: Save it somewhere safe (e.g., password manager)

**Example Key Format**: `gf_1234567890abcdef1234567890abcdef`

⚠️ **Security Warning**:

- API keys are stored in your browser's localStorage only
- Never commit API keys to git
- Never share your API key publicly
- Keys are rate-limited to 120 requests/minute

---

## Running Locally

### Development Server

```bash
npm run dev
```

**What This Does**:

- Starts Vite development server on http://localhost:5173/
- Enables Hot Module Replacement (HMR) - changes appear instantly
- Serves files from `src/` and `index.html`
- Proxies requests to GameFront API (CORS-friendly)

**Test the Site**:

1. Open http://localhost:5173/ in your browser
2. You'll see an API key modal (first visit)
3. Paste your GameFront API key
4. Click "Save"
5. Games list should load

### Build for Production

```bash
npm run build
```

**What This Does**:

- Bundles all source files into `dist/`
- Minifies JavaScript and CSS
- Tree-shakes unused code
- Optimizes for production

**Expected Output**:

```
vite v8.0.1 building for production...
✓ 23 modules transformed.
dist/index.html                   1.2 kB │ gzip:  0.5 kB
dist/assets/index-abc123.js      38.4 kB │ gzip: 12.1 kB
dist/assets/index-def456.css      6.2 kB │ gzip:  1.8 kB
✓ built in 412ms
```

### Preview Production Build

```bash
npm run preview
```

**What This Does**:

- Serves the `dist/` folder on http://localhost:4173/
- Simulates GitHub Pages environment
- Test before deploying

---

## Key User Flows to Test Manually

### Flow 1: Browse Games

**Steps**:

1. Open http://localhost:5173/
2. API key modal appears (if first visit)
3. Enter API key, click "Save"
4. Games grid loads with 20 games per page
5. Verify text shows "pies" instead of "files" (e.g., "1337 pies")
6. Scroll down, verify responsive layout

**Expected Outcome**:

- ✅ Games display in grid (1 column mobile, 2 tablet, 3 desktop)
- ✅ Each game card shows: title, file count, categories
- ✅ "File" → "Pie" replacement works (case-preserving)
- ✅ No console errors

**Edge Cases**:

- Empty search results: "No pies found"
- Network error: Error banner with retry button
- Invalid API key: Modal reopens with error message

---

### Flow 2: Search Games

**Steps**:

1. Click search box in header
2. Type "mythology" (wait 300ms for debounce)
3. Games list updates with matching results
4. Clear search (click X or delete all text)
5. Games list resets to all games

**Expected Outcome**:

- ✅ Search is debounced (no API call per keystroke)
- ✅ Results update smoothly (loading spinner)
- ✅ "File" → "Pie" replacement works in search results
- ✅ Clear search button works

**Edge Cases**:

- Search with no results: "No pies found matching your search"
- Very long search query: Handled gracefully (100 char limit)

---

### Flow 3: View Game Detail and Mods

**Steps**:

1. Click on a game card (e.g., "Age of Mythology")
2. URL changes to `/games/age-of-mythology`
3. Game detail page loads with:
   - Game title and description
   - File count (showing "pies")
   - List of mods (20 per page)
4. Scroll through mods
5. Click "Next Page" to load more mods

**Expected Outcome**:

- ✅ Game title and description show "pie" instead of "file"
- ✅ Mods list displays with: title, description, download count, size
- ✅ Pagination works (loads next 20 mods)
- ✅ Browser back button returns to games list

**Edge Cases**:

- Game with 0 mods: "No pies available for this game yet."
- Invalid game slug: "Game not found" + link to home
- Very long mod descriptions: CSS overflow ellipsis

---

### Flow 4: View Mod Detail and Download

**Steps**:

1. Click on a mod from game detail page
2. URL changes to `/mods/67890`
3. Mod detail page loads with:
   - Mod title and full description
   - File size, download count, author
   - Screenshots (if available)
   - Download button
4. Click "Download" button
5. Browser downloads file from GameFront.com

**Expected Outcome**:

- ✅ Mod description shows "pie" instead of "file"
- ✅ Screenshots display in gallery (lazy loaded)
- ✅ Download button links to GameFront (opens new tab)
- ✅ Author link goes to GameFront profile
- ✅ Browser back button returns to game page

**Edge Cases**:

- Mod with no screenshots: No gallery section
- Invalid mod ID: "Mod not found" + link to home
- HTML in description: Rendered correctly (not escaped)

---

### Flow 5: API Key Management

**Steps**:

1. Open site with no API key (clear localStorage)
2. Modal appears: "This site requires a GameFront API key"
3. Click "Get API Key" link → opens GameFront in new tab
4. Enter invalid API key, click "Save"
5. Error message: "API key invalid. Please try again."
6. Enter valid API key, click "Save"
7. Modal closes, games load
8. Click "Clear API Key" in footer
9. Modal reopens

**Expected Outcome**:

- ✅ API key modal blocks content until key is entered
- ✅ Invalid keys are rejected (test API call)
- ✅ Valid keys are saved to localStorage
- ✅ Clear API Key button works (removes from localStorage)

**Edge Cases**:

- Press Escape key: Modal does NOT close (required field)
- Refresh page: API key persists (from localStorage)
- Open in incognito: API key modal appears again

---

### Flow 6: Responsive Design

**Desktop (>1024px)**:

```bash
# Test in Chrome DevTools
# Cmd+Opt+I (Mac) or F12 (Windows/Linux)
# Click "Toggle device toolbar" (Cmd+Shift+M or Ctrl+Shift+M)
# Select "Responsive" and set width to 1200px
```

**Expected**:

- ✅ Games grid: 3 columns
- ✅ Header: Logo left, search center, nav right
- ✅ Max content width: 1200px (centered)

**Tablet (768px-1024px)**:

```bash
# Set width to 768px in DevTools
```

**Expected**:

- ✅ Games grid: 2 columns
- ✅ Header: Logo left, search center, nav below
- ✅ Readable font sizes

**Mobile (<768px)**:

```bash
# Set width to 375px (iPhone SE)
```

**Expected**:

- ✅ Games grid: 1 column (full width)
- ✅ Header: Logo top, search below, hamburger menu (if nav)
- ✅ Touch-friendly buttons (min 44px tap target)
- ✅ No horizontal scrolling

---

### Flow 7: Client-Side Routing

**Steps**:

1. Start at home: http://localhost:5173/
2. Click a game → URL changes to `/games/age-of-mythology` (no page reload)
3. Click a mod → URL changes to `/mods/67890` (no page reload)
4. Press browser back button → returns to game page (no page reload)
5. Press back again → returns to home (no page reload)
6. Copy mod URL: http://localhost:5173/mods/67890
7. Open in new tab → mod loads directly (deep linking works)

**Expected Outcome**:

- ✅ No full page reloads (smooth SPA navigation)
- ✅ URL updates correctly (History API)
- ✅ Back/forward buttons work
- ✅ Deep linking works (refresh on any URL loads correct page)
- ✅ Page title updates per route

**Edge Cases**:

- Invalid URL (e.g., `/games/nonexistent-game`): 404 error page
- Refresh on deep link: Page loads correctly (404.html fallback)

---

## Testing Checklist

Before deploying, run through this checklist:

### Functionality

- [ ] Games list loads
- [ ] Search works (debounced, clears)
- [ ] Pagination works (games and mods)
- [ ] Game detail page loads
- [ ] Mod detail page loads
- [ ] "File" → "Pie" replacement works everywhere
- [ ] Case preservation (File→Pie, FILES→PIES)
- [ ] Download links work (open GameFront)
- [ ] API key modal works (save, validate, clear)
- [ ] Error messages display correctly
- [ ] Loading states show (spinner)
- [ ] Empty states show (no results)

### Navigation

- [ ] Client-side routing works (no page reloads)
- [ ] Browser back/forward buttons work
- [ ] Deep linking works (refresh on any URL)
- [ ] 404 page shows for invalid URLs

### Responsive Design

- [ ] Mobile layout works (<768px)
- [ ] Tablet layout works (768px-1024px)
- [ ] Desktop layout works (>1024px)
- [ ] No horizontal scrolling on mobile
- [ ] Touch targets are 44px+ on mobile

### Performance

- [ ] Page loads in <2 seconds on 3G
- [ ] Bundle size <100KB (check with `npm run build`)
- [ ] No console errors
- [ ] No console warnings
- [ ] Images lazy load
- [ ] Search is debounced (not 100 API calls)

### Accessibility

- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus indicators visible
- [ ] ARIA labels on icon buttons
- [ ] Semantic HTML (headings, nav, main, article)
- [ ] Color contrast passes (brown on tan = 4.8:1)

### Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## Deployment to GitHub Pages

### Option 1: Manual Deployment

```bash
# Build production files
npm run build

# Commit dist folder (GitHub Pages will serve it)
git add dist/
git commit -m "build: production build for deployment"
git push origin main

# Configure GitHub Pages
# 1. Go to https://github.com/shaunburdick/piefiles.com/settings/pages
# 2. Source: Deploy from a branch
# 3. Branch: main
# 4. Folder: /dist
# 5. Save
```

**Wait 1-2 minutes**, then visit: https://shaunburdick.github.io/piefiles.com/

### Option 2: GitHub Actions (Automated)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**Commit and push**:

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Actions deployment"
git push origin main
```

**GitHub Actions will**:

1. Run on every push to main
2. Install dependencies
3. Build production files
4. Deploy to GitHub Pages automatically

### Custom Domain (piefiles.com)

If you own `piefiles.com`:

1. Add `CNAME` file to `public/` folder:

   ```
   piefiles.com
   ```

2. Configure DNS:
   - **A Record**: `@` → `185.199.108.153` (GitHub Pages IP)
   - **CNAME**: `www` → `shaunburdick.github.io`

3. Enable HTTPS in GitHub Pages settings (automatic)

4. Wait for DNS propagation (~24 hours)

5. Visit https://piefiles.com/

---

## Troubleshooting

### Issue: "API key invalid or missing"

**Cause**: No API key in localStorage, or key is invalid.

**Solution**:

1. Open browser console (F12)
2. Type: `localStorage.getItem('piefiles_api_key')`
3. If null: Enter API key via modal
4. If present but invalid: Clear it: `localStorage.removeItem('piefiles_api_key')`
5. Refresh page, enter valid key

---

### Issue: "Rate limit exceeded"

**Cause**: Made >120 requests in 1 minute.

**Solution**:

1. Wait 60 seconds
2. Refresh page
3. If still happening: Check for infinite loop in code (F12 → Network tab)

---

### Issue: Games not loading (blank page)

**Cause**: CORS error, network error, or API down.

**Solution**:

1. Open browser console (F12)
2. Check for CORS errors (red text)
3. If CORS: GameFront API may not allow localhost (use production URL)
4. If network error: Check internet connection
5. If API down: Try https://www.gamefront.com/ (is it up?)

---

### Issue: "File" → "Pie" replacement not working

**Cause**: Text replacement function not called, or TreeWalker bug.

**Solution**:

1. Open browser console
2. Type: `document.body.innerText` - check if "file" appears
3. If yes: `replacePieInText` function not called after render
4. Check `updated()` lifecycle in Lit components
5. Verify TreeWalker filter logic

---

### Issue: 404 on deep link refresh

**Cause**: GitHub Pages doesn't have `404.html` fallback.

**Solution**:

1. Ensure `public/404.html` exists
2. Rebuild: `npm run build`
3. Verify `dist/404.html` exists
4. Redeploy to GitHub Pages

---

### Issue: Bundle size >100KB

**Cause**: Unnecessary dependencies or large assets.

**Solution**:

1. Check bundle size: `npm run build` (look at output)
2. Analyze bundle: `npm run build -- --analyze`
3. Remove unused dependencies: `npm prune`
4. Optimize images (if any)
5. Use dynamic imports for routes

---

### Issue: Slow page load on mobile

**Cause**: Large JavaScript bundle, unoptimized images, or no lazy loading.

**Solution**:

1. Test with Lighthouse (Chrome DevTools)
2. Enable lazy loading for images: `<img loading="lazy" />`
3. Minify CSS and JS (Vite does this automatically)
4. Check Network tab: Are all requests necessary?
5. Reduce font sizes for mobile (already in CSS)

---

## Development Tips

### Hot Module Replacement (HMR)

Vite's HMR updates your changes instantly (no page reload).

**When It Works**:

- ✅ CSS changes (instant)
- ✅ JavaScript changes (instant)
- ✅ Lit component changes (instant)

**When It Doesn't**:

- ❌ `index.html` changes (need manual refresh)
- ❌ `vite.config.js` changes (restart dev server)
- ❌ `package.json` changes (run `npm install` again)

### ESLint

**Lint Code**:

```bash
npm run lint
```

**Fix Linting Issues** (auto-format with shaunburdick style):

```bash
npm run lint:fix
```

**Auto-format on Save** (VS Code):

1. Install ESLint extension
2. Settings → Editor: Format On Save → ✅
3. Settings → ESLint: Auto Fix On Save → ✅

### Debugging

**Console Logging**:

```javascript
console.log("Games loaded:", this.games);
console.error("API error:", error);
```

**Breakpoints** (Chrome DevTools):

1. Open Sources tab (F12)
2. Find your file (e.g., `gamefront-client.js`)
3. Click line number to set breakpoint
4. Trigger action → debugger pauses
5. Inspect variables in Scope panel

**Lit DevTools** (React DevTools works):

1. Install React DevTools extension
2. Open Components tab (F12)
3. Select `<pie-games-list>` component
4. Inspect props and state

---

## Next Steps

After verifying everything works:

1. ✅ Complete manual testing checklist
2. ✅ Test on multiple browsers
3. ✅ Test on mobile devices (real devices, not just DevTools)
4. ✅ Deploy to GitHub Pages
5. ✅ Test production deployment
6. ✅ Update README.md with setup instructions
7. ✅ Add screenshot to README
8. ✅ Share with friends for feedback!

---

**Questions?**

- Check the [spec](./spec.md) for requirements
- Check the [plan](./plan.md) for architecture
- Check the [data model](./data-model.md) for API schemas
- Check the [contracts](./contracts/gamefront-api.md) for API details

Happy coding! 🥧
