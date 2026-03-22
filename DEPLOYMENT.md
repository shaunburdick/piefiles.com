# Phase 6: Deployment to GitHub Pages

**Modern GitHub Actions Workflow** (not legacy gh-pages branch)

---

## Setup Complete ✅

The following files have been created for modern GitHub Pages deployment:

1. **`.github/workflows/deploy.yml`** - GitHub Actions workflow
2. **`public/CNAME`** - Custom domain configuration (piefiles.com)
3. **`vite.config.js`** - Already configured with `base: '/'`

---

## Deployment Steps

### 1. Push to GitHub Repository

If you haven't set up the remote yet:

```bash
# Add remote (replace with your actual repo)
git remote add origin https://github.com/shaunburdick/piefiles.com.git

# Push the branch
git push -u origin 001-gamefront-retro-theme
```

### 2. Merge to Main Branch

**Option A: Via Pull Request (Recommended)**

```bash
# On GitHub, create a Pull Request from 001-gamefront-retro-theme to main
# Review, approve, and merge
```

**Option B: Direct Merge (Local)**

```bash
git checkout main
git pull origin main
git merge 001-gamefront-retro-theme
git push origin main
```

### 3. Configure GitHub Repository Settings

Go to your GitHub repository settings:

**Settings → Pages**

1. **Source**: Select "GitHub Actions" (not "Deploy from a branch")
   - This enables the modern deployment workflow
   - The old "gh-pages" branch method is NOT used

2. **Custom Domain** (if using piefiles.com):
   - Enter: `piefiles.com`
   - GitHub will automatically detect the CNAME file
   - Check "Enforce HTTPS" (may take a few minutes)

3. **Build and Deployment**:
   - Should show: "GitHub Actions" as the source
   - Workflow: `deploy.yml`

### 4. Configure DNS (if using custom domain)

At your DNS provider (e.g., Cloudflare, Namecheap):

**For Apex Domain (piefiles.com):**

```
Type: A
Name: @
Value: 185.199.108.153
TTL: 3600

Type: A
Name: @
Value: 185.199.109.153
TTL: 3600

Type: A
Name: @
Value: 185.199.110.153
TTL: 3600

Type: A
Name: @
Value: 185.199.111.153
TTL: 3600
```

**For www subdomain:**

```
Type: CNAME
Name: www
Value: shaunburdick.github.io
TTL: 3600
```

**Note**: DNS propagation can take 24-48 hours

### 5. Trigger Deployment

**Automatic**: Workflow runs automatically on push to `main` branch

**Manual**:

1. Go to GitHub → Actions tab
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow" → "Run workflow"

### 6. Verify Deployment

After the workflow completes (~2-3 minutes):

1. **Check Actions Tab**:
   - ✅ Build job should be green
   - ✅ Deploy job should be green

2. **Visit URLs**:
   - **GitHub Pages URL**: https://shaunburdick.github.io/piefiles.com
   - **Custom Domain**: https://piefiles.com (if DNS configured)

3. **Test Functionality**:
   - [ ] Site loads without errors
   - [ ] API key modal appears on first visit
   - [ ] Games list loads after entering API key
   - [ ] Game detail pages work
   - [ ] Mod detail pages work
   - [ ] Text replacement (file→pie) works
   - [ ] Routing works (deep links, back button)
   - [ ] HTTPS certificate valid

---

## Workflow Details

### What the Workflow Does

**On push to main:**

1. ✅ Checks out code
2. ✅ Sets up Node.js 20 with npm caching
3. ✅ Installs dependencies (`npm ci`)
4. ✅ Runs linting (`npm run lint`)
5. ✅ Builds production bundle (`npm run build`)
6. ✅ Uploads `dist/` as artifact
7. ✅ Deploys to GitHub Pages

**Permissions:**

- `contents: read` - Read repository contents
- `pages: write` - Deploy to Pages
- `id-token: write` - Required for Pages deployment

**Concurrency:**

- Only one deployment at a time
- Newer deployments cancel in-progress ones

### Build Artifact Includes

From `dist/` directory:

- `index.html` - Entry point
- `404.html` - Client-side routing fallback
- `CNAME` - Custom domain configuration
- `assets/` - JS and CSS bundles (60KB gzipped)

---

## Troubleshooting

### Deployment Fails - "Pages not enabled"

**Solution**: Enable GitHub Pages in repository settings:

1. Settings → Pages
2. Source: Select "GitHub Actions"
3. Save

### Custom Domain Not Working

**Checklist**:

- [ ] CNAME file exists in `public/` and `dist/`
- [ ] DNS records configured correctly (4 A records for apex)
- [ ] GitHub Pages shows custom domain in settings
- [ ] "Enforce HTTPS" checked (may take time)
- [ ] DNS propagation complete (check with `dig piefiles.com`)

### Build Fails - Lint Errors

**Solution**: Fix lint errors locally first:

```bash
npm run lint
# Fix any errors
git commit -am "fix: resolve lint errors"
git push
```

### Site Loads But Blank Page

**Check**:

1. Browser console for errors (F12)
2. Vite base path is `/` (not `/piefiles.com/`)
3. API key modal should appear - check localStorage
4. Network tab shows assets loading correctly

### Routes Don't Work (404 on refresh)

**Verify**:

- [ ] `404.html` exists in `dist/`
- [ ] `404.html` redirects to `index.html` with path
- [ ] Client-side routing configured in app

---

## Environment Differences

### Development (localhost:5174)

- ✅ Vite dev server with HMR
- ✅ CORS proxy for GameFront API (`/api` → GameFront)
- ✅ Source maps enabled
- ✅ Non-minified code

### Production (piefiles.com)

- ✅ Static files served via GitHub Pages CDN
- ✅ Direct API calls to GameFront (CORS must be configured on API key)
- ✅ No source maps
- ✅ Minified with Terser
- ✅ Assets cached with content hashing

**Important**: Ensure your GameFront API key has these origins allowed:

- `https://piefiles.com`
- `https://www.piefiles.com`
- `https://shaunburdick.github.io` (if using default URL)

---

## Rollback Procedure

If deployment has issues:

**Option 1: Revert via Git**

```bash
git revert HEAD
git push origin main
# Workflow will deploy previous version
```

**Option 2: Re-run Previous Workflow**

1. Go to Actions tab
2. Find previous successful workflow run
3. Click "Re-run all jobs"

**Option 3: Emergency Fix**

```bash
# Make fix on main branch
git checkout main
git commit -am "fix: emergency hotfix"
git push origin main
# Workflow deploys immediately
```

---

## Performance Validation

After deployment, verify performance:

**Lighthouse Audit** (Chrome DevTools):

```
Expected Scores:
- Performance: 90+ (static site, small bundle)
- Accessibility: 90+ (semantic HTML, ARIA labels)
- Best Practices: 100 (HTTPS, no console errors)
- SEO: 90+ (meta tags, titles)
```

**Bundle Analysis**:

```bash
npm run build
# Check output:
# dist/assets/index-XXXXX.js should be ~60KB gzipped
```

**Load Time**:

- First contentful paint: <1.5s
- Time to interactive: <2.5s
- Total bundle size: <100KB (currently 60KB ✅)

---

## Next Steps After Deployment

1. **Test thoroughly** on production URL
2. **Monitor** GitHub Actions for any failures
3. **Update README** with live site link
4. **Share** the site! 🥧
5. **Phase 7**: Final documentation and project wrap-up

---

## Status

- [x] Workflow created (`.github/workflows/deploy.yml`)
- [x] CNAME file created (`public/CNAME`)
- [x] Vite config verified (`base: '/'`)
- [x] Production build tested (60KB gzipped ✅)
- [ ] Repository remote configured
- [ ] Code pushed to GitHub
- [ ] GitHub Pages enabled in settings
- [ ] DNS configured (if using custom domain)
- [ ] Workflow executed successfully
- [ ] Site live and verified

---

**Ready to deploy!** Follow the steps above to publish to GitHub Pages.
