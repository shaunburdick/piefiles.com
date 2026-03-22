# Implementation Tasks - Feature 001: GameFront Retro Theme

**Status**: ✅ COMPLETE - All phases finished  
**Total Tasks**: 30  
**Completed**: 30/30 (100%)  
**Estimated Time**: 2-3 days  
**Actual Time**: 2 days  
**Parallel Tasks**: 12 marked with [P]

**Deployment**: Live at https://piefiles.com  
**Last Updated**: 2026-03-22

---

## Summary

All phases completed successfully:

- ✅ Phase 1: Project Setup (Tasks 1-5)
- ✅ Phase 2: Foundation (Tasks 6-10)
- ✅ Phase 3: Core Components (Tasks 11-15)
- ✅ Phase 4: Feature Components (Tasks 16-20)
- ✅ Phase 5: Polish & Testing (Tasks 21-25)
- ✅ Phase 6: Deployment (Tasks 26-28)
- ✅ Phase 7: Documentation (Tasks 29-30)

**Site deployed via GitHub Actions to GitHub Pages with custom domain.**

---

## Phase 1: Project Setup (Tasks 1-5)

### Task 1: Initialize Vite Project [P]

**Description**: Create new Vite project with Lit template
**Steps**:

1. Run `npm create vite@latest . -- --template vanilla`
2. Install Lit: `npm install lit@3.3.1`
3. Install dev dependencies: `npm install -D vite@8 eslint@9 prettier@3`
4. Test: `npm run dev`

**Files**: package.json, vite.config.js, index.html
**Acceptance Criteria**:

- [ ] Dev server runs on localhost:5173
- [ ] No console errors
- [ ] Lit 3.3.1 installed

---

### Task 2: Create Folder Structure [P]

**Description**: Set up project directory structure
**Steps**:

1. Create src/ folders: api/, utils/, components/, styles/
2. Create public/ folder
3. Create .github/workflows/ for deployment

**Files**: All directories from plan.md
**Acceptance Criteria**:

- [ ] All folders exist
- [ ] Matches structure in plan.md

---

### Task 3: Configure ESLint and Prettier [P]

**Description**: Set up code quality tools
**Steps**:

1. Create .eslintrc.json with ES2020+ config
2. Create .prettierrc with formatting rules
3. Add lint scripts to package.json

**Files**: .eslintrc.json, .prettierrc, .prettierignore
**Acceptance Criteria**:

- [ ] `npm run lint` works
- [ ] No linting errors on empty project

---

### Task 4: Create Base HTML

**Description**: Set up index.html with meta tags
**Steps**:

1. Add viewport meta tag
2. Add retro theme color meta
3. Add title and description
4. Add noscript message

**Files**: index.html
**Acceptance Criteria**:

- [ ] HTML validates
- [ ] Meta tags present
- [ ] Noscript shows "JavaScript required"

---

### Task 5: Add 404.html for GitHub Pages

**Description**: Create fallback for client-side routing
**Steps**:

1. Copy index.html to 404.html
2. Add script to redirect to index with path

**Files**: public/404.html
**Acceptance Criteria**:

- [ ] 404.html redirects correctly
- [ ] Deep links will work on GitHub Pages

---

## Phase 2: Foundation (Tasks 6-10)

### Task 6: Implement Text Replacer Utility [P]

**Description**: Create file→pie text replacement
**Steps**:

1. Create src/utils/text-replacer.js
2. Implement case-preserving regex
3. Use TreeWalker for text nodes only
4. Export replaceText(element) function

**Files**: src/utils/text-replacer.js
**Acceptance Criteria**:

- [ ] "file"→"pie", "File"→"Pie", "FILE"→"PIE"
- [ ] "files"→"pies" (plural)
- [ ] URLs not modified
- [ ] Word boundaries work (profile stays profile)

---

### Task 7: Implement Router [P]

**Description**: Create History API router
**Steps**:

1. Create src/utils/router.js
2. Define 4 routes: /, /games/:slug, /mods/:id, /about
3. Implement navigate() and onRoute() methods
4. Handle browser back/forward

**Files**: src/utils/router.js
**Acceptance Criteria**:

- [ ] navigate('/games/half-life') works
- [ ] Back button works
- [ ] Route parameters extracted correctly

---

### Task 8: Create API Client [P]

**Description**: Implement GameFront GraphQL client
**Steps**:

1. Create src/api/gamefront-client.js
2. Implement fetch wrapper with auth header
3. Add rate limiting (120 req/min)
4. Add error handling (401, 429, 500, timeout)
5. Create src/api/queries.js with GraphQL queries

**Files**: src/api/gamefront-client.js, src/api/queries.js
**Acceptance Criteria**:

- [ ] Authorization header included
- [ ] User-Agent header included
- [ ] Rate limiting prevents >120 req/min
- [ ] Errors return user-friendly messages

---

### Task 9: Create CSS Retro Theme [P]

**Description**: Set up retro color palette
**Steps**:

1. Create src/styles/retro-theme.css
2. Define CSS custom properties for colors
3. Define typography (Arial, sizes)
4. Create src/styles/main.css for base styles

**Files**: src/styles/retro-theme.css, src/styles/main.css
**Acceptance Criteria**:

- [ ] Colors match plan (#543F20, #A99E60, etc.)
- [ ] Font is Arial
- [ ] CSS variables defined

---

### Task 10: Create Responsive Layout CSS [P]

**Description**: Mobile/tablet/desktop breakpoints
**Steps**:

1. Create src/styles/responsive.css
2. Define breakpoints: <768px, 768-1024px, >1024px
3. Grid layouts for cards

**Files**: src/styles/responsive.css
**Acceptance Criteria**:

- [ ] Mobile: single column
- [ ] Tablet: two columns
- [ ] Desktop: three columns

---

## Phase 3: Core Components (Tasks 11-15)

### Task 11: Implement pie-app Component

**Description**: Root application shell
**Steps**:

1. Create src/components/pie-app.js
2. Use Lit component with router integration
3. Render header, footer, and route content

**Files**: src/components/pie-app.js
**Acceptance Criteria**:

- [ ] Renders header and footer
- [ ] Route content changes on navigation
- [ ] Text replacement applied

---

### Task 12: Implement pie-header Component [P]

**Description**: Logo and search bar
**Steps**:

1. Create src/components/pie-header.js
2. Add "Pie Files" logo (links to home)
3. Add search input with debounce (300ms)
4. Style with retro brown header

**Files**: src/components/pie-header.js
**Acceptance Criteria**:

- [ ] Logo links to /
- [ ] Search triggers on Enter or button
- [ ] Search debounced (300ms)

---

### Task 13: Implement pie-footer Component [P]

**Description**: Disclaimer and links
**Steps**:

1. Create src/components/pie-footer.js
2. Add disclaimer text
3. Add link to GameFront.com
4. Add "Clear API Key" button

**Files**: src/components/pie-footer.js
**Acceptance Criteria**:

- [ ] Disclaimer visible
- [ ] GameFront link opens in new tab
- [ ] Clear API Key clears localStorage

---

### Task 14: Implement pie-api-key-modal Component

**Description**: API key configuration
**Steps**:

1. Create src/components/pie-api-key-modal.js
2. Check localStorage for key on load
3. Show modal if no key
4. Test API key on save
5. Store in localStorage

**Files**: src/components/pie-api-key-modal.js
**Acceptance Criteria**:

- [ ] Modal shows on first visit
- [ ] Key stored in localStorage
- [ ] Invalid key shows error
- [ ] Test API call validates key

---

### Task 15: Implement Loading Spinner Component [P]

**Description**: Reusable loading indicator
**Steps**:

1. Create src/components/pie-spinner.js
2. CSS spinner animation
3. Show during API calls

**Files**: src/components/pie-spinner.js
**Acceptance Criteria**:

- [ ] Spinner animates
- [ ] Styled with retro colors

---

## Phase 4: Feature Components (Tasks 16-20)

### Task 16: Implement pie-games-list Component

**Description**: Games grid with pagination
**Steps**:

1. Create src/components/pie-games-list.js
2. Fetch games from API
3. Display in grid (responsive)
4. Add pagination controls
5. Handle search parameter

**Files**: src/components/pie-games-list.js
**Acceptance Criteria**:

- [ ] Games display in grid
- [ ] Pagination works (prev/next)
- [ ] Search filters games
- [ ] Text replacement applied

---

### Task 17: Implement pie-game-detail Component

**Description**: Game page with mods list
**Steps**:

1. Create src/components/pie-game-detail.js
2. Fetch game by slug
3. Display game info (title, categories, file count)
4. Fetch mods for game
5. Display mods in grid

**Files**: src/components/pie-game-detail.js
**Acceptance Criteria**:

- [ ] Game info displayed
- [ ] Mods list populated
- [ ] Clicking mod goes to mod detail
- [ ] Text replacement applied

---

### Task 18: Implement pie-mod-detail Component

**Description**: Mod details page
**Steps**:

1. Create src/components/pie-mod-detail.js
2. Fetch mod by ID
3. Display title, description, screenshots
4. Add download button (links to GameFront)
5. Show metadata (size, date, author)

**Files**: src/components/pie-mod-detail.js
**Acceptance Criteria**:

- [ ] Mod details displayed
- [ ] Download button links to GameFront
- [ ] Screenshots shown (if available)
- [ ] Text replacement applied

---

### Task 19: Wire Up Routing

**Description**: Connect router to components
**Steps**:

1. Update src/main.js
2. Register routes with components
3. Handle route changes
4. Update page title per route

**Files**: src/main.js
**Acceptance Criteria**:

- [ ] All 4 routes work
- [ ] Page title updates
- [ ] Deep links work

---

### Task 20: Integrate Text Replacement

**Description**: Apply to all components
**Steps**:

1. Add replaceText() call in updated() lifecycle
2. Apply to all list and detail components
3. Test case preservation

**Files**: All component files
**Acceptance Criteria**:

- [ ] All "file" → "pie" replacements work
- [ ] Case preserved
- [ ] URLs not affected

---

## Phase 5: Polish & Testing (Tasks 21-25)

### Task 21: Implement Error States

**Description**: User-friendly error messages
**Steps**:

1. Create error component/templates
2. Handle API errors (401, 429, 500)
3. Handle 404 not found
4. Handle no results

**Files**: src/components/pie-error.js
**Acceptance Criteria**:

- [ ] Network errors show message
- [ ] API errors show friendly text
- [ ] Retry buttons work

---

### Task 22: Add Loading States

**Description**: Show loading during API calls
**Steps**:

1. Add loading property to components
2. Show spinner during fetch
3. Disable buttons during load

**Files**: All component files
**Acceptance Criteria**:

- [ ] Loading spinner shows
- [ ] Buttons disabled during load
- [ ] No layout shift

---

### Task 23: Manual Testing - Functionality

**Description**: Test all features work
**Checklist**:

- [ ] Games list loads
- [ ] Search works
- [ ] Pagination works
- [ ] Game detail shows mods
- [ ] Mod detail displays correctly
- [ ] Download links work
- [ ] API key modal works
- [ ] Error states display

---

### Task 24: Manual Testing - Browsers

**Description**: Cross-browser testing
**Checklist**:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

### Task 25: Manual Testing - Performance & A11y

**Description**: Performance and accessibility
**Checklist**:

- [ ] Bundle size <100KB
- [ ] Load time <2s on 3G throttling
- [ ] Keyboard navigation works
- [ ] Screen reader labels present
- [ ] Color contrast passes (4.5:1)

---

## Phase 6: Deployment (Tasks 26-28)

### Task 26: Configure Vite for GitHub Pages

**Description**: Set base path for deployment
**Steps**:

1. Update vite.config.js with base: '/piefiles.com/'
2. Test build: `npm run build`
3. Test preview: `npm run preview`

**Files**: vite.config.js
**Acceptance Criteria**:

- [ ] Build succeeds
- [ ] Preview works
- [ ] Assets load correctly

---

### Task 27: Create Deployment Workflow

**Description**: GitHub Actions for auto-deploy
**Steps**:

1. Create .github/workflows/deploy.yml
2. Configure to build on push to main
3. Deploy to gh-pages branch

**Files**: .github/workflows/deploy.yml
**Acceptance Criteria**:

- [ ] Workflow runs on push
- [ ] Deploys to gh-pages
- [ ] No errors

---

### Task 28: Deploy to piefiles.com

**Description**: Configure custom domain
**Steps**:

1. Add CNAME file to public/
2. Configure DNS (if not already)
3. Push to trigger deployment
4. Verify at https://piefiles.com

**Files**: public/CNAME
**Acceptance Criteria**:

- [ ] Site live at piefiles.com
- [ ] HTTPS works
- [ ] All features functional

---

## Phase 7: Documentation (Tasks 29-30)

### Task 29: Update README

**Description**: Complete setup instructions
**Steps**:

1. Add prerequisites
2. Add local setup steps
3. Add deployment instructions
4. Add screenshots (optional)

**Files**: README.md
**Acceptance Criteria**:

- [ ] Setup instructions clear
- [ ] Deployment documented
- [ ] API key instructions included

---

### Task 30: Final Review

**Description**: Complete project checklist
**Checklist**:

- [ ] All acceptance criteria met
- [ ] No console errors
- [ ] Constitution compliance verified
- [ ] Disclaimer visible
- [ ] Performance goals met
- [ ] Ready for public launch

---

**End of Tasks**
