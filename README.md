# 🥧 PieFiles.com

> **The Ultimate Sweet Baked Pastry Download Resource!**

**🌐 Live Site**: [https://piefiles.com](https://piefiles.com)

A humorous parody/tribute to the original 2005 PieFiles.com (an Age of Mythology files site). This modern reimagining displays [GameFront.com](https://www.gamefront.com) gaming content with:

- 🎨 **Retro 2005 aesthetic** - Brown/tan color scheme that tastes like nostalgia
- 🥧 **Every "file" becomes "pie"** - Case-preserving text replacement throughout
- 📱 **Modern responsive design** - Works on mobile, tablet, and desktop
- ⚡ **Blazing fast** - Pure frontend, <100KB bundle, no backend required
- 🎭 **Six pie flavor themes** - Apple, Cherry, Blueberry, Pumpkin, Lemon, Pecan

---

## ⚠️ Disclaimer

This is a parody/joke site. All gaming content is provided by [GameFront.com](https://www.gamefront.com) via their public API. Not affiliated with or endorsed by GameFront. We just really like pies and nostalgia.

---

## ✨ Features

### 🥧 The Pie Experience

- **Browse games** - Thousands of games from GameFront with retro styling
- **Search mods** - Find your favorite game pies... er, files
- **Pie text replacement** - Watch "download files" become "download pies" in real-time
- **Flavor themes** - Switch between 6 pie flavors (colors) to suit your mood
- **Responsive layout** - Looks great on any screen size

### 🛡️ Built Right

- **Security first** - XSS prevention, CSP headers, image validation
- **No tracking** - Your API key stays in your browser, we see nothing
- **Open source** - Fork it, improve it, make it better (and owe me pie)
- **Fast & light** - ~91KB bundle size, loads in seconds

---

## 🚀 Quick Start

### For Users

1. Visit [https://piefiles.com](https://piefiles.com)
2. Get a free API key from [GameFront](https://www.gamefront.com/account/api-keys)
3. Click "Configure API Key" and paste your key
4. Browse games, search mods, enjoy the pie puns! 🥧

### For Developers

```bash
# Clone the repo
git clone https://github.com/shaunburdick/piefiles.com.git
cd piefiles.com

# Install dependencies
npm install

# Start dev server at http://localhost:5174
npm run dev

# Build for production
npm run build
```

**Tech Stack**: Lit 3.3.1, Vite 8.0.1, JavaScript ES2020+, DOMPurify, Plain CSS

---

## 🛠️ Development

### Commands

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build for production (outputs to dist/)
npm run preview      # Preview production build
npm run lint         # Run ESLint (must pass!)
npm run format       # Format code with Prettier
```

### Project Structure

```
src/
├── api/              # GraphQL client & queries
├── components/       # Lit web components (pie-app, pie-header, etc.)
├── utils/            # Text replacer, router, sanitization, validators
└── styles/           # CSS with custom properties for themes
```

### Key Principles

1. **No TypeScript** - Vanilla JavaScript ES2020+ only (per constitution)
2. **No disabled linting** - Fix the code, don't disable the rule
3. **Security first** - Sanitize all HTML, validate all URLs
4. **Bundle size <100KB** - Keep dependencies minimal
5. **Humor over perfection** - It's a pie site, have fun!

---

## 📚 Documentation

- **[AGENTS.md](AGENTS.md)** - Comprehensive guide for AI agents/developers
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment via GitHub Actions
- **[TESTING.md](TESTING.md)** - Testing guide and validation scenarios
- **[Constitution](.specify/memory/constitution.md)** - Core principles & technical decisions
- **[Feature Spec](.specify/features/001-gamefront-retro-theme.md)** - Complete requirements

---

## 🎨 Pie Flavors (Themes)

Choose your favorite pie flavor to customize the color scheme:

- **Apple** 🍎 - Original brown/tan retro theme
- **Cherry** 🍒 - Deep reds and burgundy
- **Blueberry** 🫐 - Rich blues and purples
- **Pumpkin** 🎃 - Warm oranges and autumn tones
- **Lemon** 🍋 - Bright yellows and citrus
- **Pecan** 🌰 - Dark browns and caramel

Switch themes anytime using the dropdown in the header!

---

## 🔑 API Key Setup

GameFront requires authentication. Here's how to get your free API key:

1. **Create account** at [GameFront.com](https://www.gamefront.com)
2. **Generate API key** at [Account Settings](https://www.gamefront.com/account/api-keys)
3. **Set permissions** to `graphql:read`
4. **Add origins**: `http://localhost:5174` and `https://piefiles.com`
5. **Configure in app** using the modal or footer button

Your API key is stored in browser `localStorage` only - we never see it or send it anywhere except directly to GameFront's API.

**Rate Limits**: 120 requests/minute (authenticated)

---

## 🤝 Contributing

Contributions are welcome! Whether it's bug fixes, new features, or just better pie puns, we appreciate your help.

**Important**: By contributing, you agree to owe me a slice of pie. Yes, really. See [LICENSE](LICENSE) for the hilarious details. 🥧

### How to Contribute

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/more-pie-puns`)
3. Make your changes (following [AGENTS.md](AGENTS.md) guidelines)
4. Run tests: `npm run lint && npm run build`
5. Commit with a good message
6. Push and create a PR
7. Mail me a pie (optional but appreciated)

---

## 📄 License

**The Pie License (TPL) v1.0** - MIT License + Pie Clause

This project is free and open source under a comedic MIT-style license with one important addition: **any use or contribution means you owe me a slice of pie**.

See the [LICENSE](LICENSE) file for full details. It's worth reading - we promise it's entertaining.

**tl;dr**: Free to use, modify, and distribute. Just remember you owe me pie. 🥧

**Note**: Gaming content displayed on the site belongs to GameFront and is provided via their public API.

---

## 🙏 Credits

- **Original PieFiles.com (2005)** - Inspiration for this delicious nostalgia trip
- **[GameFront.com](https://www.gamefront.com)** - Gaming content provider since 1998
- **All contributors** - Thanks for the code (and the pie)! 🥧
- **You** - For visiting and appreciating ridiculous projects

---

## 🐛 Known Issues & Future Pies

### Current Limitations

- No automated tests yet (manual testing only)
- Accessibility needs improvement (ARIA attributes, keyboard nav)
- Some code duplication in date/file formatters

### Future Enhancements

- [ ] Add automated test suite (Vitest)
- [ ] Improve accessibility (WCAG 2.1 AA)
- [ ] Add favorites/bookmarks
- [ ] Add "random pie" button
- [ ] Add keyboard shortcuts
- [ ] PWA support with offline mode
- [ ] More pie puns (can never have too many)

---

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/shaunburdick/piefiles.com/issues)
- **Discussions**: [GitHub Discussions](https://github.com/shaunburdick/piefiles.com/discussions)
- **Email**: Create an issue instead (seriously, I get enough email)
- **Pie delivery**: See LICENSE for mailing address (just kidding... unless?)

---

## 🎯 Fun Stats

- **Lines of code**: ~2,500 (keeping it simple!)
- **Bundle size**: 91.20 KB (gzipped: 26.90 KB)
- **Dependencies**: 2 production, 6 dev (minimalism rocks)
- **Pie references**: Too many to count 🥧
- **Hours of entertainment**: Priceless

---

**Made with 🥧, ☕, and a questionable sense of humor**

_Remember: Life is short. Eat pie. Write silly code. Be kind to others._
