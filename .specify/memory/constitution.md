# PieFiles.com Constitution

## Core Principles

### I. Simplicity First

This is a fun, joke project - keep it simple and maintainable. No unnecessary complexity, no backend infrastructure, no build processes beyond what GitHub Pages requires. The entire site should be understandable in under an hour.

### II. Frontend-Only Architecture

- All functionality runs in the browser (HTML/CSS/JavaScript)
- API calls made directly from client to GameFront's public API
- No backend, no server-side rendering, no build step required
- Deployable as static files to GitHub Pages

### III. Accessibility & Performance

- Site must be usable without JavaScript (show error message)
- Responsive design for mobile and desktop
- Minimize external dependencies (prefer vanilla JS or single small library)
- Fast initial load (<2s on 3G)

### IV. Humor Over Perfection

- The "file" → "pie" replacement is meant to be funny and nonsensical
- Don't overthink edge cases - if something breaks hilariously, that's fine
- Prioritize working quickly over perfect implementation

### V. Respect the Source

- Clearly indicate this is a parody/joke site (footer disclaimer)
- Link back to original GameFront.com
- Respect GameFront's API rate limits (120 req/min authenticated, 30 req/min unauthenticated)
- Include proper User-Agent header as required by GameFront API terms

## Technical Decisions

### Technology Stack

- **Frontend Framework**: Vanilla JavaScript or lightweight library (React/Vue if needed, but prefer vanilla)
- **Styling**: CSS3 with retro color scheme (browns/tans from original PieFiles)
- **API Client**: Fetch API with proper error handling
- **Hosting**: GitHub Pages (static site)
- **Version Control**: Git + GitHub

### Retro Theme Specification

- **Primary Colors**: Brown (#543F20), Tan (#C89D5F, #AD915F), Light tan (#D0AA68, #B4A57E)
- **Background**: Tan/beige (#A99E60)
- **Fonts**: Arial (as per original PieFiles)
- **Layout**: Modern responsive grid, NOT table-based like original 2005 site
- **Logo**: Text-based "Pie Files" header with retro styling

### Text Replacement Rules

- Replace "file" with "pie" (case-preserving: File→Pie, FILE→PIE, file→pie)
- Apply to ALL text nodes (game titles, descriptions, categories, counts)
- Do NOT replace in URLs, code, or HTML attributes
- Use regex: `/\b(f)(ile)(s?)\b/gi` with case preservation logic

## Quality Standards

### Code Quality

- **Linting**: ESLint 9.x with @shaunburdick/style config (4-space indent, single quotes, semicolons)
- **Formatting**: ESLint auto-fix (`npm run lint:fix`) for consistent style
- **Browser Support**: Modern browsers (Chrome/Firefox/Safari/Edge - last 2 versions)
- **No IE Support**: Internet Explorer is not supported

### Testing

- **Manual Testing**: Test on Chrome, Firefox, Safari before release
- **API Testing**: Verify GameFront API calls work correctly
- **Text Replacement Testing**: Verify case-preserving replacement works
- **No Automated Tests Required**: This is a joke project, manual testing is sufficient

### Documentation

- **README**: Clear setup instructions, API key info, deployment steps
- **Code Comments**: Document non-obvious text replacement logic
- **Disclaimer**: Clear indication this is a parody site

## Anti-Patterns to Avoid

❌ **Don't** create a backend or build process  
❌ **Don't** store/cache API data (always fetch fresh from GameFront)  
❌ **Don't** try to replicate every GameFront feature (keep it simple)  
❌ **Don't** over-engineer the text replacement (simple regex is fine)  
❌ **Don't** use heavy frameworks (no webpack, no TypeScript, no complex tooling)  
❌ **Don't** violate GameFront's API rate limits or terms of service

## Success Metrics

### Product Success

- Site loads and displays GameFront content with retro theme
- Text replacement works and is funny/nonsensical
- Mobile and desktop layouts work well
- Clear it's a parody site

### Technical Success

- Deploys to GitHub Pages without issues
- API calls work reliably
- No console errors in browser
- Page loads in <2 seconds

### Operational Success

- Site stays within GameFront API rate limits
- Easy to maintain (simple codebase)
- Clear documentation for future updates

## Governance

This constitution defines the core principles and constraints for PieFiles.com. Any changes to these principles must be documented with clear rationale.

**Version**: 1.0.0 | **Ratified**: 2026-03-22 | **Last Amended**: 2026-03-22
