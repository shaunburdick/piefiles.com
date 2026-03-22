# Feature 001: GameFront Retro Theme with File→Pie Replacement

**Version**: 1.0  
**Last Updated**: 2026-03-22  
**Status**: ✅ Complete - Deployed to Production  
**Live URL**: https://piefiles.com  
**Priority**: P1 (Critical - Core Feature)  
**Estimated Effort**: Small (2-3 days)  
**Actual Effort**: 2 days  
**Dependencies**: None

---

## Problem Statement

GameFront.com is a modern gaming mod/file hosting site, but the original PieFiles.com (an Age of Mythology files site from 2005) had a charming retro aesthetic with brown/tan colors. This project creates a humorous parody site that:

1. Displays GameFront content through their public API
2. Styles it with the retro PieFiles color scheme
3. Replaces all instances of "file" with "pie" throughout the content

This is a joke/parody project meant to be funny, not a serious competitor to GameFront.

## Solution Overview

Create a static frontend website hosted on GitHub Pages that:

- Calls GameFront's public GraphQL API to fetch games and mods data
- Applies retro PieFiles color scheme (browns, tans) to the modern layout
- Replaces "file"/"File"/"FILE" with "pie"/"Pie"/"PIE" in all text content
- Provides a responsive, accessible browsing experience
- Includes clear disclaimer that this is a parody

## User Stories

### US-001: Browse Games as a Visitor

**As a** site visitor  
**I want to** browse the list of games available on GameFront  
**So that** I can see game titles and file counts in the retro "pie" theme

**Acceptance Criteria**:

- Games list displays with proper pagination (default 20 per page)
- Each game shows: title, file count, categories
- Text shows "pie" instead of "file" (e.g., "1337 pies" instead of "1337 files")
- Clicking a game navigates to that game's page
- Retro brown/tan color scheme is applied
- Works on mobile and desktop

### US-002: Search Games as a Visitor

**As a** site visitor  
**I want to** search for games by name  
**So that** I can quickly find specific games

**Acceptance Criteria**:

- Search box in header accepts text input
- Search calls GameFront API with search parameter
- Results display with "pie" replacements
- Empty search shows all games
- Search works on Enter key or button click

### US-003: View Game Details and Mods as a Visitor

**As a** site visitor  
**I want to** view a specific game's page with its mods  
**So that** I can browse available mods for that game

**Acceptance Criteria**:

- Game detail page shows game title, categories, file count
- Mods list displays with pagination
- Each mod shows: title, description, download count, file size, upload date
- All "file" references replaced with "pie"
- Download links point to GameFront (not modified)
- Mod categories displayed and clickable

### US-004: View Mod Details as a Visitor

**As a** site visitor  
**I want to** view detailed information about a specific mod  
**So that** I can decide if I want to download it

**Acceptance Criteria**:

- Mod detail page shows: title, full description, screenshots (if available), file size, download count, author, upload date
- "Download" button links to GameFront's download URL
- All text has "file" → "pie" replacement
- Screenshots displayed in gallery if available
- Related mods section (if API provides)

### US-005: Understand This Is a Parody as a Visitor

**As a** site visitor  
**I want to** clearly see this is a parody site  
**So that** I don't confuse it with the official GameFront

**Acceptance Criteria**:

- Footer contains disclaimer: "PieFiles.com is a parody/joke site. All content provided by GameFront.com via their public API."
- Link to official GameFront.com in footer
- Humorous tagline referencing original PieFiles
- Clear "About" section explaining the joke

### US-006: Experience Fast Load Times as a Visitor

**As a** site visitor  
**I want to** experience fast page loads  
**So that** I don't wait around for content

**Acceptance Criteria**:

- Initial page load <2 seconds on 3G
- API errors display user-friendly message
- Loading states shown during API calls
- No JavaScript? Show message: "This site requires JavaScript to display content from GameFront"

## Functional Requirements

### FR-001: GameFront API Integration

**Description**: Integrate with GameFront's GraphQL API to fetch games and mods data.

**Specifications**:

- Use GameFront API endpoint: `https://www.gamefront.com/api/v1/graphql`
- Include required headers:
  - `Authorization: Bearer YOUR_TOKEN` (user must provide their own API key)
  - `User-Agent: PieFiles/1.0 (+https://piefiles.com)` (descriptive user agent as required by API ToS)
  - `Accept: application/json`
  - `Content-Type: application/json`
- Respect rate limits: 120 req/min with auth, 30 req/min without
- Handle API errors gracefully (404, 500, timeout, rate limit)

**API Operations Needed**:

1. **List Games**: `games` query with pagination, search, sorting
2. **Get Single Game**: `game` query by slug/ID
3. **Get Mods for Game**: `mods` query filtered by game
4. **Get Single Mod**: `mod` query by ID/slug

**Example Games Query**:

```graphql
query Games(
  $search: String
  $orderBy: GamesOrderColumn
  $orderDirection: SortDirection
  $first: Int!
  $page: Int!
) {
  games(
    search: $search
    order_by: $orderBy
    order_direction: $orderDirection
    first: $first
    page: $page
  ) {
    data {
      id
      title
      slug
      url
      file_count
      categories {
        id
        name
        slug
      }
    }
    paginatorInfo {
      currentPage
      lastPage
      hasMorePages
    }
  }
}
```

**Error Handling**:

- Network errors: "Unable to reach GameFront. Please try again later."
- 401 Unauthorized: "API key invalid or missing. Please configure your API key."
- 429 Rate Limit: "Too many requests. Please wait a moment and try again."
- 500 Server Error: "GameFront is experiencing issues. Please try again later."
- Timeout (>10 seconds): "Request timed out. Please check your connection."

### FR-002: Text Replacement - File to Pie

**Description**: Replace all instances of "file" with "pie" in displayed text content, preserving case.

**Specifications**:

- Apply to ALL text nodes in the DOM (game titles, descriptions, categories, counts, etc.)
- Preserve case:
  - "file" → "pie"
  - "File" → "Pie"
  - "FILE" → "PIE"
  - "files" → "pies"
  - "Files" → "Pies"
  - "FILES" → "PIES"
- Do NOT replace in:
  - URLs (href, src attributes)
  - Code snippets (if any)
  - HTML tag names or attributes
  - JavaScript variable names
- Use word boundary detection (don't replace "filed" → "pied")

**Implementation Approach**:

```javascript
// Regex pattern for replacement
const pattern = /\b(f|F)(ile|ILE)(s|S)?\b/g

function replacer(match, f, ile, s) {
  const pieCase = ile === 'ile' ? 'pie' : 'PIE'
  const sCase = s ? (s === 's' ? 's' : 'S') : ''
  const fCase = f === 'f' ? 'p' : 'P'
  return fCase + pieCase.slice(1) + sCase
}

// Apply to text nodes only
function replaceTextNodes(element) {
  // Walk DOM tree and replace text nodes
}
```

**Edge Cases**:

- "Filebase" should become "Piebase" (not a word boundary issue)
- "profile" should stay "profile" (word boundary works correctly)
- Numbers: "100 files" → "100 pies" ✓

### FR-003: Retro PieFiles Theme

**Description**: Apply the original PieFiles.com color scheme and aesthetic to the modern layout.

**Color Palette** (from 2005 PieFiles):

- **Primary Text**: #543F20 (dark brown)
- **Primary Background**: #A99E60 (tan/beige)
- **Accent Brown**: #C89D5F, #AD915F (medium brown)
- **Content Background**: #D0AA68, #B4A57E (light tan)
- **Headers**: #C89D5F (brown header bars)
- **Links**: #543F20 (dark brown), hover: #FFFFFF (white)
- **Borders**: #000000 (black, 1px solid)

**Typography**:

- **Font Family**: Arial, sans-serif (as per original)
- **Base Font Size**: 12px for body text
- **Headings**:
  - H1: 24px bold
  - H2: 18px bold
  - H3: 14px bold

**Layout Approach**:

- Modern flexbox/grid layout (NOT tables like 2005 site)
- Responsive breakpoints:
  - Mobile: <768px (single column)
  - Tablet: 768px-1024px (two columns)
  - Desktop: >1024px (three columns for game grid)
- Max content width: 1200px, centered
- Card-based design for games and mods

**Visual Elements**:

- Logo: "Pie Files" text with retro styling
- Tagline: "The Ultimate Sweet Baked Pastry Download Resource!" (parody of original)
- Footer: Brown bar with disclaimer and links

### FR-004: Responsive Design

**Description**: Ensure the site works well on all screen sizes.

**Mobile (<768px)**:

- Single column layout
- Hamburger menu for navigation (if needed)
- Touch-friendly buttons (min 44px tap target)
- Search bar full width

**Tablet (768px-1024px)**:

- Two column grid for games/mods
- Side-by-side navigation elements
- Readable font sizes

**Desktop (>1024px)**:

- Three column grid for games/mods
- Full navigation visible
- Optimal reading width for descriptions

### FR-005: API Key Configuration

**Description**: Allow users to provide their own GameFront API key.

**Specifications**:

- On first visit, show modal: "This site requires a GameFront API key. Get yours at https://www.gamefront.com/account/api-keys"
- Input field for API key
- Store in localStorage: `piefiles_api_key`
- "Clear API Key" button in footer
- Test API key on save (make test request)
- Show error if key is invalid

**Security Note**:

- Clearly warn users: "API keys are stored in your browser only. Never share your API key."
- Keys stored in localStorage (client-side only, no backend)

### FR-006: Routing and Navigation

**Description**: Client-side routing for different pages without full page reloads.

**Routes**:

- `/` - Home page (games list)
- `/games/:slug` - Game detail page with mods
- `/mods/:id` - Mod detail page
- `/about` - About/FAQ page explaining the parody

**Implementation**:

- Use browser History API for client-side routing
- Update page title for each route
- Handle browser back/forward buttons
- Deep linking works (refresh on any URL loads correct content)

**Navigation Elements**:

- Header: Logo (links to home), Search bar
- Footer: About, Original GameFront link, Disclaimer, Clear API Key

### FR-007: Loading and Error States

**Description**: Provide clear feedback during API calls and errors.

**Loading States**:

- Show spinner/skeleton while fetching data
- Disable buttons during operations
- Progress indicator for pagination

**Error States**:

- Network error: Friendly message with retry button
- 404 Not Found: "Game/Mod not found" with link to home
- API errors: Display user-friendly message (not raw error)
- No results: "No pies found matching your search" (with humor)

**Empty States**:

- No games: "No games available. This is unusual!"
- No mods for game: "No pies available for this game yet."

## Non-Functional Requirements

### NFR-001: Performance

- **Page Load**: Initial load <2 seconds on 3G connection
- **API Response**: Display results within 1 second of API response
- **Bundle Size**: Total JavaScript <100KB (minimize dependencies)
- **Images**: Lazy load mod screenshots

### NFR-002: Browser Compatibility

- **Supported**: Chrome, Firefox, Safari, Edge (last 2 versions)
- **Not Supported**: Internet Explorer (show warning message)
- **Progressive Enhancement**: Basic content visible without JavaScript

### NFR-003: Accessibility

- **WCAG 2.1 Level A**: Minimum compliance
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Readers**: Semantic HTML, proper ARIA labels
- **Color Contrast**: 4.5:1 ratio for text (brown text may need adjustment)
- **Alt Text**: All images have descriptive alt attributes

### NFR-004: SEO and Meta Tags

- **Title Tags**: Descriptive page titles with "Pie Files" branding
- **Meta Description**: Each page has unique description
- **Open Graph**: Social sharing tags with humor
- **Robots.txt**: Allow crawling (it's a public parody site)

### NFR-005: API Rate Limiting

- **Respect Limits**: Never exceed 120 req/min (with auth) or 30 req/min (without)
- **Client-Side Throttling**: Implement request queuing if needed
- **Cache Control**: Respect GameFront's cache headers (if any)
- **User-Agent**: Always include descriptive User-Agent header

## Technical Constraints

### TC-001: No Backend

- All functionality must run in the browser
- No server-side rendering
- No API proxy or backend services

### TC-002: GitHub Pages Hosting

- Deploy as static HTML/CSS/JS files
- Use GitHub Actions for deployment (optional)
- Custom domain: piefiles.com (already owned)

### TC-003: GameFront API Terms Compliance

- Respect rate limits
- Include proper User-Agent
- Link back to GameFront
- Don't scrape or cache data
- Clear this is not an official GameFront site

## Acceptance Criteria Summary

**The feature is complete when**:

1. ✅ Games list displays with pagination and search
2. ✅ Game detail pages show mods for that game
3. ✅ Mod detail pages show full information
4. ✅ All "file" references replaced with "pie" (case-preserving)
5. ✅ Retro brown/tan color scheme applied throughout
6. ✅ Responsive design works on mobile, tablet, desktop
7. ✅ API key configuration works (localStorage)
8. ✅ Error handling displays user-friendly messages
9. ✅ Footer disclaimer clearly indicates parody
10. ✅ Site deploys to GitHub Pages at piefiles.com
11. ✅ No console errors in browser
12. ✅ Page loads in <2 seconds

## Out of Scope

**Explicitly NOT included in this feature**:

- ❌ User authentication or accounts
- ❌ Commenting system
- ❌ Favoriting or bookmarking mods
- ❌ Uploading mods (use GameFront for that)
- ❌ Backend server or API proxy
- ❌ Advanced search filters (use GameFront API's search)
- ❌ Mod ratings or reviews
- ❌ Email notifications
- ❌ Analytics tracking (privacy-friendly)

## Risk Assessment

| Risk                           | Likelihood | Impact | Mitigation                                       |
| ------------------------------ | ---------- | ------ | ------------------------------------------------ |
| GameFront API changes          | Medium     | High   | Document API version used, monitor for changes   |
| Rate limit exceeded            | Low        | Medium | Implement client-side throttling, warn users     |
| API key exposure               | Medium     | Medium | Clear warnings, localStorage only, no sharing    |
| Text replacement breaks layout | Low        | Low    | Test with long mod titles, CSS overflow handling |
| Mobile performance issues      | Low        | Medium | Lazy load images, minimize JS bundle             |

## Testing Strategy

### Manual Testing Checklist

- [ ] Games list loads and displays correctly
- [ ] Search functionality works
- [ ] Game detail page shows mods
- [ ] Mod detail page displays all information
- [ ] "File" → "Pie" replacement works in all contexts
- [ ] Case preservation works (File→Pie, FILES→PIES)
- [ ] Links to GameFront downloads work
- [ ] Mobile layout is usable
- [ ] Tablet layout is usable
- [ ] Desktop layout is usable
- [ ] API key configuration works
- [ ] Error messages display correctly
- [ ] Loading states show properly
- [ ] Browser back button works
- [ ] Deep linking works (refresh on game page)
- [ ] No console errors

### Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Edge Cases to Test

- Empty search results
- Game with 0 mods
- Mod with no screenshots
- Very long game/mod titles
- API timeout simulation
- Invalid API key
- Network offline

## Future Enhancements (Not in v1.0)

- **Mod Categories Filter**: Filter mods by category on game page
- **Sort Options**: Sort games/mods by different criteria (name, date, downloads)
- **Favorites**: Client-side favoriting with localStorage
- **Dark Mode**: Toggle for dark retro theme
- **Easter Eggs**: Hidden "pie recipes" or jokes throughout the site
- **Stats Page**: Funny "pie statistics" dashboard

---

## Clarifications Applied

**Version History**:

- v1.0 (2026-03-22): Initial specification based on user clarifications

**Clarifications Documented**:

1. **Q1 - No Backend**: Confirmed frontend-only with client-side API calls (FR-001)
2. **Q2 - Replace All Text**: Replace "file" everywhere for humor, even if nonsensical (FR-002)
3. **Q3 - Case Preservation**: Yes, preserve case in replacements (FR-002)
4. **Q4 - Modern Layout**: Use retro colors/fonts but modern responsive layout (FR-003, FR-004)
5. **Q5 - Frontend Only**: No backend, static site calling GameFront API (TC-001)
6. **Q6 - Use GameFront APIs**: Rely entirely on GameFront's API for search/data (FR-001)
7. **Q7 - Read-Only**: No user accounts, comments, or uploads (Out of Scope)
8. **Q8 - All Content**: Show whatever GameFront API provides, no filtering (FR-001)

---

**Next Steps**:

1. Review and approve this specification
2. Hand off to `modern-architect-engineer` agent for planning phase (create implementation plan, choose tech stack specifics, design file structure)
3. Architect will create feature branch `001-gamefront-retro-theme` and develop implementation plan
