# Session Log

## Session 1 — Feb 18, 2026

### What Was Built
- Full app scaffolded from scratch: `index.html`, `style.css`, `app.js`
- ES5-only throughout for iPad 2 / iOS 9.3.5 compatibility (no const/let, no arrow functions, no fetch, no template literals, no CSS variables, no flexbox)
- Firebase Auth via REST API (email/password sign-up/sign-in, token refresh)
- Firestore via REST API — full CRUD for recipes (no Firebase SDK)
- Three views: list, add/edit, detail
- Recipe extraction: corsproxy.io with allorigins.win fallback; JSON-LD parser with HowToSection support
- Dark/light mode toggle with localStorage persistence
- Herb green accent color (#5db07a)
- Favorites: toggle on detail, star on list cards, filter pill button, syncs to Firestore
- Text size A+/A- on detail view (~1.4x scale), persists in localStorage
- Renamed app to Bitebase

### Bugs Fixed
- HowToSection instructions not parsing (step.name checked before step.itemListElement)
- Light mode leaving bottom of page dark (html element background not updated)
- Text size button overlapping Back button (moved to dedicated row)
- Large text too big (scaled from 2x to ~1.4x)

### Commits Pushed
- `7d921e2` — Initial commit
- `be2bc45` — Favorites, text size, theme, proxy fallback, bug fixes
- `5adbf41` — Rename to Bitebase

### GitHub / Deployment
- Repo: https://github.com/zack0liver/recipe-clipper
- Live: https://zack0liver.github.io/recipe-clipper/
- Firebase project: recipe-clipper-app (separate from kettlebell-genie)
- Auth: Email/Password enabled
- Firestore: active, data path = users/{uid}/recipes/{docId}
- API key: unrestricted (works on any domain)

### Where to Pick Up Next
- Test thoroughly on iPad 2 Safari (GitHub Pages URL)
- Consider adding a meal plan / weekly planner feature (see ENHANCEMENTS.md)
- Consider tagging improvements (clickable tag chips to filter)
