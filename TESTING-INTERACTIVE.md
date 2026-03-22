# 🧪 Interactive Testing Session - PieFiles.com

**Status**: Testing Phase 5  
**Dev Server**: http://localhost:5174  
**Time Estimate**: 15-20 minutes

---

## Setup Instructions

1. **Open your browser** (Chrome, Firefox, Safari, or Edge)
2. **Navigate to**: http://localhost:5174
3. **Open Developer Tools**: Press `F12` (or `Cmd+Opt+I` on Mac)
4. **Position Console**: Keep the Console tab visible to watch for errors

---

## Test 1: Initial Load & API Key Setup

### Steps:

1. ✅ Page loads
2. ✅ A modal/overlay appears asking for API key
3. ✅ Modal has input field and "Save" or "Test" button

### What to check:

- [ ] **Console**: No red error messages (warnings are okay)
- [ ] **Visual**: Brown/tan retro color scheme visible
- [ ] **Text**: Modal mentions "GameFront" API key

### Action:

Enter your GameFront API key (must have `graphql:read` permission)

### Expected Result:

- [ ] Modal closes after successful validation
- [ ] Games list appears

### ❌ If it fails:

- Check console for error message
- Verify API key has correct permissions
- Verify API key has `http://localhost:5174` in allowed origins

---

## Test 2: Games List Display

### What to check:

- [ ] **Grid Layout**: Games displayed in grid (3 columns on desktop)
- [ ] **Game Cards**: Each shows:
  - Game title
  - Category tags (colored boxes)
  - File count
- [ ] **Text Replacement**: File count says "X **pies** available" (not "files")
- [ ] **Header**: Logo says "**Pie Files**" (with pie emoji 🥧 if present)
- [ ] **Footer**: Disclaimer text visible

### Screenshot locations to verify:

In the browser, verify these elements:

```
Header: [Pie Files Logo] [Search Bar]
Body: [Grid of game cards - 3 columns]
Footer: [Disclaimer] [GameFront link] [Settings]
```

### Console check:

Type in console: `document.body.innerText.includes('pies')`

- [ ] Should return `true` if text replacement is working

---

## Test 3: Search Functionality

### Steps:

1. Click in search bar (top right of header)
2. Type: `half`
3. Press `Enter`

### What to check:

- [ ] **URL updates**: Should show `?search=half`
- [ ] **Games filter**: Only games with "half" in title show (e.g., "Half-Life")
- [ ] **Loading**: Brief loading spinner (pie-spinner component)
- [ ] **Console**: No errors

### Try clearing search:

1. Delete text from search bar
2. Press `Enter` again
3. [ ] All games return

---

## Test 4: Pagination

### Steps:

1. Scroll to bottom of games list
2. Look for pagination controls: `[← Previous] Page X of Y [Next →]`
3. Click **"Next"** button

### What to check:

- [ ] **Page loads**: New set of games appears
- [ ] **Page counter updates**: "Page 2 of X"
- [ ] **Previous button enabled**: Now clickable
- [ ] **Smooth scroll**: Page scrolls to top automatically
- [ ] **Console**: No errors

### Try going back:

1. Click **"Previous"** button
2. [ ] Returns to page 1
3. [ ] Previous button becomes disabled

---

## Test 5: Game Detail Page

### Steps:

1. Click on **any game card** from the games list
2. Wait for page to load

### What to check:

- [ ] **URL changes**: Should be `/games/{game-slug}`
- [ ] **Game header**: Shows game title prominently
- [ ] **Meta info**: Shows "X pies available" (text replacement)
- [ ] **Categories**: Colored category tags displayed
- [ ] **Back button**: "← Back to Games" button visible at top
- [ ] **Mods section**: "Available Mods" heading
- [ ] **Mods grid**: Mods displayed in 2-column grid
- [ ] **Console**: No errors

### Inspect a mod card:

Each mod card should show:

- [ ] **Title**: Bold text
- [ ] **Description**: Plain text (NO `<p>` or `<br>` tags visible)
- [ ] **Meta**: Downloads count and date
- [ ] **Hover effect**: Card background changes on hover

### Test Back Button:

1. Click **"← Back to Games"**
2. [ ] Returns to games list
3. [ ] Previous page state preserved (same page you were on)

---

## Test 6: Mod Detail Page (Critical Test)

### Steps:

1. From a game detail page, click on **any mod card**
2. Wait for page to load

### What to check:

- [ ] **URL format**: Should be `/games/{game-slug}/mods/{mod-slug}`
  - Example: `/games/half-life/mods/scientist-slaughter`
- [ ] **Page loads**: NO "Mod not found" error
- [ ] **Mod title**: Displayed prominently
- [ ] **Game breadcrumb**: "Game: [Game Title]" link at top
- [ ] **Author**: Shows "Author: [Name]"
- [ ] **Downloads**: Shows "Downloads: [Number]"
- [ ] **Dates**: Shows "Uploaded: [Date]" and possibly "Updated: [Date]"
- [ ] **Download button**: "⬇ Download This File" button (should say "Pie" if text replacement works)
- [ ] **Console**: NO errors

### ⭐ Critical Check - Description Rendering:

Look at the **Description** section:

- [ ] **No raw HTML**: Should NOT see `<p>`, `</p>`, `<br>`, `<strong>` tags
- [ ] **Formatted text**: Should see proper paragraphs, bold text, links
- [ ] **Line breaks**: Paragraphs separated properly
- [ ] **Links clickable**: Any links in description should be clickable

**Example of CORRECT rendering**:

```
Description:
This is a great mod that adds new features.

It includes:
• New weapons
• New maps
• Bug fixes
```

**Example of INCORRECT rendering** (this is a bug):

```
Description:
<p>This is a great mod that adds new features.</p><br><p>It includes:</p>
```

### Test Download Button:

1. Click **"⬇ Download This File"** button
2. [ ] Opens GameFront in new tab
3. [ ] Original tab stays on mod detail page

### Test Game Link:

1. Click **"Game: [Game Title]"** link at top
2. [ ] Navigates back to game detail page
3. [ ] Shows the same game with its mods

### Test Back Button:

1. Click **"← Back"** button
2. [ ] Returns to game detail page

---

## Test 7: Text Replacement Verification

### Manual inspection:

Open browser DevTools and run this in Console:

```javascript
// Check if "file" was replaced with "pie"
const bodyText = document.body.innerText.toLowerCase()
const hasPies = bodyText.includes('pies')
const hasFiles = bodyText.includes('files') || bodyText.includes('file ')
console.log('Has "pies":', hasPies)
console.log('Has "files" (should be false):', hasFiles)
```

### Visual check:

Look for these specific texts:

- [ ] Games page: "X **pies** available" (not "files")
- [ ] Game detail: "X **pies** available"
- [ ] Download button: "Download This **Pie**" (not "File")
- [ ] Header: "**Pie** Files" logo

### What should NOT change:

- [ ] URLs still say `/games/` (not `/games/`)
- [ ] "Profile" (if it appears) stays "profile" (not "propie")
- [ ] "Downloads" stays "downloads"

---

## Test 8: Browser Navigation

### Test browser back/forward:

1. Navigate: Home → Game Detail → Mod Detail
2. Click **browser back button** (not site back button)
3. [ ] Returns to game detail
4. Click **browser back button** again
5. [ ] Returns to games list
6. Click **browser forward button**
7. [ ] Goes to game detail
8. Click **browser forward button** again
9. [ ] Goes to mod detail

### Test deep linking:

1. Copy the URL from a mod detail page (e.g., `/games/half-life/mods/scientist-slaughter`)
2. Open a **new browser tab**
3. Paste the URL and press Enter
4. [ ] Mod detail page loads correctly (no redirect to home)

### Test refresh:

1. On any page (game detail or mod detail), press **F5** or **Cmd+R**
2. [ ] Page reloads and shows same content
3. [ ] No redirect to home page
4. [ ] Console shows no errors

---

## Test 9: Responsive Design (Quick Check)

### Open DevTools Responsive Mode:

- **Chrome/Edge**: Press `Ctrl+Shift+M` (or `Cmd+Opt+M` on Mac)
- **Firefox**: Press `Ctrl+Shift+M`

### Test Mobile (375px - iPhone SE):

1. Select "iPhone SE" or set width to 375px
2. [ ] Games grid: 1 column
3. [ ] Mods grid: 1 column
4. [ ] Search bar fits (may stack below logo)
5. [ ] Text readable (not too small)
6. [ ] Buttons tappable (not too small)
7. [ ] No horizontal scrolling

### Test Tablet (768px - iPad):

1. Select "iPad" or set width to 768px
2. [ ] Games grid: 2 columns
3. [ ] Mods grid: 2 columns
4. [ ] Layout looks balanced

### Test Desktop (1920px):

1. Set width to 1920px
2. [ ] Games grid: 3 columns
3. [ ] Content centered (not stretched edge-to-edge)
4. [ ] Max width appears to be ~1200px

---

## Test 10: Performance Check

### Check bundle size:

In terminal, run:

```bash
npm run build
```

Look for output like:

```
dist/assets/index-XXXXX.js   60.XX kB │ gzip: 15.XX kB
```

- [ ] **JS bundle**: Should be ~60KB gzipped (under 100KB target ✅)

### Check load time:

1. Open DevTools → **Network** tab
2. Hard refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R`)
3. Look at bottom status bar for total load time
4. [ ] **Load time**: Should be under 2 seconds on normal connection

### Check console:

- [ ] **No errors**: Red messages indicate bugs
- [ ] **Warnings okay**: Yellow warnings are acceptable

---

## Test Summary Checklist

Once you complete all tests, verify:

### Core Functionality:

- [ ] Games list loads
- [ ] Search works
- [ ] Pagination works
- [ ] Game detail loads
- [ ] Mods list displays
- [ ] Mod detail loads correctly (URL: `/games/X/mods/Y`)

### Data Display:

- [ ] HTML descriptions render cleanly (no raw tags)
- [ ] Author names display
- [ ] Download counts display
- [ ] Dates display
- [ ] Download buttons work

### Text Replacement:

- [ ] "Files" → "Pies" throughout site
- [ ] URLs unchanged

### Navigation:

- [ ] Back buttons work
- [ ] Browser back/forward works
- [ ] Deep links work
- [ ] Refresh works

### Quality:

- [ ] No console errors
- [ ] Responsive on mobile/tablet/desktop
- [ ] Bundle under 100KB

---

## 📊 Report Results

After testing, let me know:

1. **✅ All tests passed** → We can move to deployment
2. **⚠️ Some tests failed** → Tell me which tests failed and what errors you saw
3. **❌ Critical failures** → Share console errors and I'll fix immediately

**Reply with**: Test results for each section, or just "All passed" if everything works!

---

**Estimated Time**: 15-20 minutes  
**Current Branch**: `001-gamefront-retro-theme`  
**Next Phase**: Deployment to GitHub Pages
