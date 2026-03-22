# Testing Guide - PieFiles.com

## Current Status

✅ **Build**: Passing (60KB gzipped, under 100KB target)  
✅ **Lint**: Passing (no errors)  
✅ **Dev Server**: Running at http://localhost:5174  
🔧 **Recent Fix**: Aligned component field names with GraphQL API schema

## Prerequisites

1. **GameFront API Key Required**
   - Go to https://www.gamefront.com and create an API key
   - The key must have `graphql:read` permission
   - Configure allowed origins: `http://localhost:5174`, `https://piefiles.com`, `https://www.piefiles.com`

2. **Dev Server Running**
   ```bash
   npm run dev
   # Should show: Local: http://localhost:5174
   ```

## Manual Testing Checklist

### Phase 1: Core Functionality

#### ✅ Test 1: Games List Page

**URL**: http://localhost:5174

**Expected Behavior**:

- [ ] Page loads without errors (check browser console: F12)
- [ ] API key modal appears on first visit
- [ ] After entering valid API key, games grid displays
- [ ] Games show title, category tags, and file count
- [ ] File count displays as "X pies available" (text replacement working)
- [ ] Games are clickable

**Test Search**:

1. Type "half" in search bar
2. Press Enter or click search
3. [ ] Games list filters to matching titles
4. [ ] URL updates to `/?search=half`

**Test Pagination**:

1. Scroll to bottom of games list
2. Click "Next" button
3. [ ] Next page of games loads
4. [ ] Page counter updates (e.g., "Page 2 of 10")
5. [ ] "Previous" button becomes enabled
6. [ ] Click "Previous" - returns to page 1

---

#### ✅ Test 2: Game Detail Page

**How to Access**: Click any game from the games list

**Expected Behavior**:

- [ ] Page loads game details
- [ ] Game title displayed prominently
- [ ] Shows "X pies available" (text replacement)
- [ ] Category tags displayed (if available)
- [ ] "Back to Games" button works
- [ ] Mods/files list displayed below game info

**Test Mods List**:

- [ ] Mods display in grid (2 columns on desktop, 1 on mobile)
- [ ] Each mod shows: title, description snippet, download count, date
- [ ] Download count shows as "X downloads" (should text-replace to "X downloads" - no change expected for this word)
- [ ] HTML descriptions render cleanly (no `<p>` or `<br>` tags visible)
- [ ] Clicking a mod navigates to mod detail page

**Test Mods Pagination** (if game has >20 mods):

- [ ] Pagination controls display
- [ ] "Next" button works
- [ ] "Previous" button works

---

#### ✅ Test 3: Mod Detail Page

**How to Access**: Click any mod from game detail page

**Expected URL Format**: `/games/[gameSlug]/mods/[modSlug]`  
**Example**: `/games/half-life/mods/my-cool-mod`

**Expected Behavior**:

- [ ] Page loads mod details
- [ ] Mod title displayed
- [ ] Author name shown (if available)
- [ ] Downloads count displayed
- [ ] Upload date shown
- [ ] Updated date shown (if different from upload date)
- [ ] "Download This File" button present (opens GameFront in new tab)
- [ ] "Back" button works

**Test Description Rendering**:

- [ ] Description section displays
- [ ] HTML formatting renders correctly (bold, links, paragraphs)
- [ ] No raw HTML tags visible (like `<p>`, `</p>`, `<strong>`)
- [ ] Line breaks and formatting preserved

**Test Game Link**:

- [ ] "Game: [Game Title]" link displayed at top
- [ ] Clicking game link navigates back to game detail page

**Test Images** (if mod has screenshots):

- [ ] "Screenshots" section displays
- [ ] Images load correctly
- [ ] Images are in grid layout
- [ ] Hovering image slightly zooms it (CSS transform)

---

### Phase 2: Text Replacement ("file" → "pie")

**Test Cases**:

1. **Games List**: Look for "X pies available" (should show "pies" not "files")
2. **Game Detail**: Look for "X pies available"
3. **Mod Detail**: Check if any text contains "file" that should be "pie"
4. **Headers/Footer**: Check "Pie Files" logo (should say "Pie" not "File")
5. **Download Button**: "Download This Pie" (should say "Pie" not "File")

**What Should NOT Change**:

- [ ] URLs remain unchanged (e.g., `/games/half-life` not `/games/half-pipe`)
- [ ] The word "profile" stays "profile" (not "propie")
- [ ] Downloads count stays "downloads" (not a file-related word)

**Check Browser Console**:

- [ ] No JavaScript errors related to text replacement

---

### Phase 3: Navigation & User Experience

#### Browser Navigation

- [ ] **Back Button**: Browser back button works correctly (doesn't break routing)
- [ ] **Forward Button**: Browser forward button works correctly
- [ ] **Refresh**: Refreshing any page loads the correct content (deep links work)
- [ ] **Direct URL**: Pasting `/games/half-life` directly into address bar works

#### Header Navigation

- [ ] Clicking "Pie Files" logo navigates to home page
- [ ] Search bar works from any page (searches return to home with results)
- [ ] Search bar debouncing (typing quickly doesn't trigger multiple searches)

#### Footer

- [ ] Footer displays disclaimer text
- [ ] "GameFront.com" link opens in new tab
- [ ] "API Settings" or "Clear API Key" button works (reopens API key modal)

---

### Phase 4: Error Handling

#### Test Invalid API Key

1. Clear localStorage: `localStorage.clear()` in browser console
2. Refresh page
3. Enter invalid API key (e.g., "invalid123")
4. [ ] Error message displays
5. [ ] Modal stays open (doesn't close)
6. [ ] Can retry with correct key

#### Test Missing API Key

1. Clear API key from modal
2. Try to navigate to games list
3. [ ] Friendly error message: "Configure your API key"
4. [ ] Button to open API key modal

#### Test Network Errors (Optional)

1. Disconnect internet
2. Try to load games list
3. [ ] Error message displays
4. [ ] "Retry" button appears

---

### Phase 5: Responsive Design

#### Desktop (>1024px)

- [ ] Games grid: 3 columns
- [ ] Mods grid: 2 columns
- [ ] Header: Logo left, search right
- [ ] No horizontal scrolling

#### Tablet (768px - 1024px)

- [ ] Games grid: 2 columns
- [ ] Mods grid: 2 columns
- [ ] Layout adjusts smoothly

#### Mobile (<768px)

- [ ] Games grid: 1 column
- [ ] Mods grid: 1 column
- [ ] Search bar stacks below logo (or adjusts)
- [ ] Text remains readable (no tiny font sizes)
- [ ] Buttons are large enough to tap (min 44x44px)
- [ ] No horizontal scrolling

**Test Devices** (use browser DevTools):

- [ ] iPhone SE (375px width)
- [ ] iPad (768px width)
- [ ] Desktop (1920px width)

---

### Phase 6: Performance

#### Bundle Size

- [ ] Run `npm run build`
- [ ] Check output: Should be ~60KB gzipped (well under 100KB target)

#### Load Time

1. Open DevTools → Network tab
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. [ ] Initial page load <2s on "Fast 3G" throttling
4. [ ] No render-blocking resources

#### Runtime Performance

- [ ] Smooth scrolling (no jank)
- [ ] Fast page transitions
- [ ] No memory leaks (leave app open for 5 minutes, check memory usage)

---

### Phase 7: Accessibility

#### Keyboard Navigation

- [ ] Tab key navigates through interactive elements
- [ ] Enter key activates buttons/links
- [ ] Focus indicators visible (outline on focused elements)
- [ ] Can operate entire app without mouse

#### Screen Reader (Optional)

- [ ] Images have alt text
- [ ] Buttons have descriptive labels
- [ ] Headings used correctly (h1, h2, etc.)

#### Color Contrast

- [ ] Primary text on background: 4.5:1 or higher
- [ ] Button text on button background: 4.5:1 or higher
- [ ] Check with browser DevTools → Lighthouse → Accessibility

---

## Common Issues & Solutions

### Issue: "API key is required"

**Solution**: Configure API key in footer settings. Key must have `graphql:read` permission.

### Issue: "CORS error" in console

**Solution**:

1. Check Vite dev server is running on port 5174
2. Verify `vite.config.js` has CORS proxy configured
3. Ensure API key has `http://localhost:5174` in allowed origins

### Issue: Mod detail page shows "Mod not found"

**Solution**: This was fixed in latest commit. Ensure you're on latest code:

```bash
git pull origin 001-gamefront-retro-theme
```

### Issue: HTML tags showing in descriptions (e.g., `<p>`, `<br>`)

**Solution**: This was fixed in latest commit. Descriptions now use `unsafeHTML` directive.

### Issue: Text replacement not working

**Solution**:

1. Check browser console for JavaScript errors
2. Verify `text-replacer.js` is imported in components
3. Check that `replaceTextInElement()` is called in `updated()` lifecycle

---

## Reporting Issues

If you find a bug during testing:

1. **Check browser console** (F12) for errors
2. **Note the URL** where the issue occurred
3. **Describe expected vs. actual behavior**
4. **Include screenshots** if helpful
5. **Check if issue is fixed** by clearing cache (Ctrl+Shift+R)

---

## Next Steps After Testing

Once all tests pass:

1. ✅ Mark Phase 5 complete in `specs/001-gamefront-retro-theme/tasks.md`
2. ➡️ Move to Phase 6: Deployment (GitHub Pages setup)
3. ➡️ Move to Phase 7: Documentation (update README with final instructions)

---

**Last Updated**: 2026-03-22  
**Dev Server**: http://localhost:5174  
**Branch**: `001-gamefront-retro-theme`
