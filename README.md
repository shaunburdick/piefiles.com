# PieFiles.com - A GameFront Retro Parody

> **The Ultimate Sweet Baked Pastry Download Resource!** 🥧

**🌐 Live Site**: [https://piefiles.com](https://piefiles.com)

A humorous parody/joke frontend that displays [GameFront.com](https://www.gamefront.com) content with:

- Retro 2005 PieFiles.com color scheme (brown/tan aesthetic)
- All instances of "file" replaced with "pie" throughout the site
- Modern responsive design
- Powered by GameFront's public GraphQL API

## ⚠️ Disclaimer

This is a parody/joke site. All gaming content is provided by GameFront.com via their public API. This is not affiliated with or endorsed by GameFront.

Original PieFiles.com was an Age of Mythology files site from 2005. This project pays homage to that retro aesthetic while having fun with word replacement.

## 🎯 Project Status

**Current Phase**: ✅ Deployed and Live!

- ✅ Constitution created (.specify/memory/constitution.md)
- ✅ Feature specification complete (.specify/features/001-gamefront-retro-theme.md)
- ✅ Implementation planning complete (specs/001-gamefront-retro-theme/)
- ✅ All components implemented (Phase 1-4)
- ✅ Testing complete (Phase 5)
- ✅ **Deployed to GitHub Pages** (Phase 6)
- 🌐 **Live at**: [https://piefiles.com](https://piefiles.com)

## 📋 Specification Overview

See [.specify/features/001-gamefront-retro-theme.md](.specify/features/001-gamefront-retro-theme.md) for complete details.

**Key Features**:

- Browse games and mods from GameFront with retro styling
- Search functionality (powered by GameFront API)
- Responsive design (mobile, tablet, desktop)
- "File" → "Pie" text replacement (case-preserving)
- Client-side API key configuration
- No backend required (pure frontend)

**Tech Constraints**:

- Frontend-only (no backend/server)
- Hosted on GitHub Pages
- Calls GameFront API directly from browser
- Vanilla JavaScript or lightweight framework
- <100KB total bundle size

## 🎨 Retro Theme Colors

From the original 2005 PieFiles.com:

- Primary Text: `#543F20` (dark brown)
- Background: `#A99E60` (tan/beige)
- Accent: `#C89D5F`, `#AD915F` (medium browns)
- Content Areas: `#D0AA68`, `#B4A57E` (light tans)

## 🚀 Development Approach

This project follows **Specification-Driven Development (SDD)**:

1. ✅ **Constitution** - Core principles and technical decisions
2. ✅ **Specification** - Complete feature requirements
3. ⏳ **Planning** - Technical architecture and implementation plan
4. ⏳ **Tasks** - Breakdown into actionable development steps
5. ⏳ **Implementation** - Build with TDD approach
6. ⏳ **Deployment** - Deploy to GitHub Pages

## 📚 Documentation

- [Constitution](.specify/memory/constitution.md) - Project principles and standards
- [Feature Spec](.specify/features/001-gamefront-retro-theme.md) - Complete requirements
- [GameFront API Docs](https://www.gamefront.com/api) - Source API documentation

## 🔑 API Key Required

**GameFront API requires authentication** - Users need a free API key:

1. Create account at [GameFront.com](https://www.gamefront.com)
2. Get API key from [Account API Keys](https://www.gamefront.com/account/api-keys)
3. Click "Configure API Key" button when prompted in the app
4. Enter and test your key (stored securely in browser localStorage only)

**Rate Limits**: 120 requests/minute (authenticated)

**Note**: The original plan mentioned 30 req/min without authentication, but testing shows the API requires a valid Bearer token for all requests.

## 🛠️ Local Development

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# Install dependencies
npm install

# Start development server (with CORS proxy)
npm run dev

# The app will open at http://localhost:5173
```

### Development Commands

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

### Tech Stack

- **Framework**: Lit 3.3.1 (Web Components)
- **Build Tool**: Vite 8.0.1
- **Language**: JavaScript ES2020+
- **Styling**: Plain CSS with CSS Custom Properties
- **Bundle Size**: ~60KB (well under 100KB target)

### Project Structure

```
src/
├── api/
│   ├── gamefront-client.js    # GraphQL API client
│   └── queries.js              # GraphQL queries
├── components/
│   ├── pie-app.js              # Root component & router
│   ├── pie-header.js           # Header with search
│   ├── pie-footer.js           # Footer with settings
│   ├── pie-games-list.js       # Games grid
│   ├── pie-game-detail.js      # Game details
│   ├── pie-mod-detail.js       # Mod details
│   ├── pie-api-key-modal.js    # API key configuration
│   └── pie-spinner.js          # Loading indicator
├── utils/
│   ├── text-replacer.js        # File→Pie replacement
│   └── router.js               # History API router
├── styles/
│   ├── retro-theme.css         # Color palette
│   ├── main.css                # Base styles
│   └── responsive.css          # Media queries
└── main.js                     # App entry point
```

### CORS Handling

Development uses a Vite proxy to avoid CORS issues:

- **Dev**: `/api/v1/graphql` (proxied through Vite)
- **Production**: `https://www.gamefront.com/api/v1/graphql` (direct)

## 📦 Deployment

_(Will be added in planning phase)_

Target: GitHub Pages at https://piefiles.com

## 🤝 Contributing

This is primarily a fun personal project, but suggestions and issues are welcome!

## 📄 License

_(To be determined - likely MIT for the code, content belongs to GameFront)_

## 🙏 Credits

- Original PieFiles.com (2005) - Inspiration
- [GameFront.com](https://www.gamefront.com) - Content provider via public API
- Original FileFront/GameFront team - For maintaining gaming mod archives since 1998

---

**Made with 🥧 and humor**
