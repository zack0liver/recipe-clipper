# Recipe Clipper — Implementation Plan

## Context

Zack has an old iPad 2 (iOS 9.3.5) and wants a personal recipe clipper that extracts recipes from URLs, lets him review/edit, and saves them centrally. Recipes should be viewable on the iPad 2 in the kitchen and on his modern phone. This also becomes a central recipe collection for meal prep planning later.

## Key Constraints

- **iPad 2 compatible from day one** — iOS 9.3.5 Safari
  - No `const`/`let` → use `var`
  - No arrow functions → use `function()`
  - No template literals → use string concatenation
  - No `fetch()` → use `XMLHttpRequest`
  - No native Promises → use callbacks
  - No CSS variables → hardcoded colors
  - No flexbox (buggy on iOS 9) → use simple block/inline-block layout
  - No Firebase JS SDK (requires ES6+)
- **New Firebase project** (separate from kettlebell-genie)
- **Centralized storage** — same recipes on phone + iPad

## Architecture

Static HTML/CSS/JS app. No build step, no npm. Deployable to GitHub Pages.

**Firebase without the SDK:** Use the Firestore REST API + Firebase Auth REST API directly via `XMLHttpRequest`. This works on any browser, including iPad 2. No SDK dependency at all.

```
recipe-clipper/
  index.html          — All markup (list view, add/edit view, detail view)
  style.css            — Simple dark theme, block layout, no CSS vars
  app.js               — All logic: auth, CRUD, extraction, UI
  ENHANCEMENTS.md
  BUGS.md
```

Keeping it to fewer files since there's no SDK to configure separately.

## Firebase Setup (New Project)

- Create new Firebase project (e.g., `recipe-clipper-app`)
- Enable Firestore Database
- Enable Authentication with Email/Password provider (simpler than Google Sign-In for REST API usage)
- Firestore path: `users/{uid}/recipes/{docId}`
- Security rules: authenticated users can read/write their own data

**Why Email/Password instead of Google Sign-In?**
Google Sign-In via REST requires OAuth redirect flows that are complex without the SDK. Email/Password auth via REST is a single `XMLHttpRequest` call — much simpler and works on iPad 2.

## Auth Flow (Firebase Auth REST API)

- Sign up: `POST https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={API_KEY}`
- Sign in: `POST https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={API_KEY}`
- Returns an `idToken` (valid ~1 hour) and `refreshToken`
- Store token in `localStorage`, refresh when expired
- Simple sign-in form: email + password fields

## Recipe Extraction

- User pastes a URL, taps "Extract"
- `XMLHttpRequest` to `https://corsproxy.io/?url=` + encoded URL
- Parse response HTML with `DOMParser` (supported on iOS 9)
- Find `<script type="application/ld+json">` blocks
- Extract `schema.org/Recipe` data (title, ingredients, instructions, etc.)
- Populate editable form for review before saving
- If extraction fails, user can fill in the form manually

## Data Model

```
Firestore: users/{uid}/recipes/{recipeId}
{
  title: "Classic Beef Chili",
  ingredients: ["1 lb ground beef", "1 can kidney beans"],
  instructions: ["Brown the beef...", "Add beans..."],
  servings: "6",
  prepTime: "15 min",
  cookTime: "45 min",
  sourceUrl: "https://allrecipes.com/...",
  tags: ["dinner", "meal-prep"],
  image: "",
  notes: "",
  createdAt: 1708000000000,
  updatedAt: 1708000000000
}
```

## UI — Three Views (single page, swap visibility)

### 1. Recipe List (home)
- Header with app name + sign in/out
- Search input to filter by title
- Simple card list: recipe title, tags, cook time
- "+" button to add new recipe
- Tap card → detail view

### 2. Add/Edit Recipe
- URL input + "Extract" button at top
- Form fields: Title, Servings, Prep Time, Cook Time, Ingredients (textarea), Instructions (textarea), Tags, Notes, Source URL
- Save / Cancel buttons

### 3. Recipe Detail
- Clean readable layout — large fonts, high contrast
- Title, times, servings
- Ingredients list
- Numbered instructions
- Source link, notes, tags
- Edit / Delete buttons

## Styling

- Dark theme with hardcoded colors (no CSS variables)
- Background: `#0f0f13`, cards: `#1a1a24`, text: `#e8e8f0`, accent: `#ff6b35`
- Block layout (no flexbox) — `display: block`, `width: 100%`, centered with `margin: 0 auto`
- Large tap targets (min 44px), large fonts (16px+ body)
- System font stack
- `max-width: 600px` content area — works on phone and iPad

## Implementation Steps

### Step 1: Firebase project setup
- Zack creates a new Firebase project in the console
- Enables Firestore + Email/Password auth
- Gets API key and project ID
- Sets Firestore security rules

### Step 2: Scaffold HTML + CSS
- index.html with three view sections
- style.css with dark theme
- Basic view switching in app.js (ES5)

### Step 3: Auth module
- Sign up / sign in forms
- Firebase Auth REST API calls via XMLHttpRequest
- Token storage + refresh logic
- Show/hide auth-gated content

### Step 4: Recipe CRUD
- Save recipe to Firestore via REST API
- Load all recipes from Firestore
- Edit and delete recipes
- Local cache in memory for fast UI

### Step 5: Recipe extraction
- URL input + Extract button
- corsproxy.io + DOMParser + JSON-LD parsing
- Populate form with extracted data
- Error handling / fallback messaging

### Step 6: Search + polish
- Filter recipes by title/tags
- Toast notifications
- Loading states
- Empty states

## Verification

1. `python3 -m http.server 8080` from recipe-clipper dir
2. Create account, sign in
3. Extract a recipe from AllRecipes URL
4. Review, edit, save
5. Reload page — verify recipe persists
6. Test on iPhone Safari
7. Test on iPad 2 Safari (the ultimate test)
