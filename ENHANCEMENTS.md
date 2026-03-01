# NomBook — Enhancements

## Existing
1. Offline mode — cache recipes in localStorage for viewing without internet
2. Image support — display recipe images from extracted data
3. Meal prep planner — select recipes for the week, generate combined grocery list
4. Recipe categories/folders
5. Import/export recipes (JSON backup)
6. Print-friendly view for kitchen use
7. Cooking mode — step-by-step view with large text and wake lock
8. Scale recipe servings (auto-adjust ingredient quantities)
9. Sort recipes by date added, alphabetical, cook time
10. ~~Faster extraction~~ — **Done.** Both proxies now run in parallel; whichever responds first wins, eliminating the sequential ~8s wait.

## New (Session 1)

11. **Family / shared recipe books** — Each user has their own account but can opt in to view a spouse's or family member's recipes. Possible approach: shared collection ID stored on each user's profile in Firestore; toggle in settings to show "My Recipes" vs "Family Recipes" vs both. Needs auth design thought.

12. **Quick delete from list view** — Swipe or long-press on a recipe card to reveal a Delete button, with a confirm dialog to prevent accidental deletes. Avoids navigating into the detail view just to delete.

13. **Rename / re-title a recipe** — Quick inline edit of the recipe title from the detail view without entering full edit mode.

14. **AI-powered meal prep planner** — Use the recipe database (leveraging tags like "high protein", "healthy", "quick", "meal-prep") to suggest a weekly meal plan. Could use an LLM API call to generate a plan based on dietary goals, available cook time, or what ingredients you have on hand.

15. **LLM-style search** — Natural language search across the recipe database (e.g. "something high protein under 30 minutes" or "chicken without dairy"). Could call an LLM API with the recipe list as context, or use local keyword scoring across title, tags, ingredients, and notes as a lighter-weight first pass.

16. ~~**Ingredient search**~~ — **Done.** Search now matches against ingredients in addition to title and tags. Debounce keeps it responsive on large libraries.

18. ~~**Debounced search input**~~ — **Done.** 300ms debounce added before filtering triggers.

17. ~~**Lazy thumbnail loading**~~ — **Done.** Uses IntersectionObserver (with 200px rootMargin) on modern browsers; falls back to loading all thumbnails on iOS 9 where the API is unavailable.

19. **"Made it" log** — Log dates each time you cook a recipe. Show "last made" and "times made" on the detail view. Stored as an array of timestamps in Firestore on the recipe document.

20. **Cook from pantry** — Enter the ingredients you have on hand, and NomBook searches the web for recipes that match those ingredients. Results are shown in a list and any recipe can be clipped and saved to your library in one tap. Possible approach: pass the ingredient list to a recipe search API (e.g. Spoonacular) or an LLM to suggest recipe URLs, then run them through the existing extraction pipeline.

21. **Weekly meal planner** — A calendar-style weekly view where you drag or assign recipes to each day (breakfast/lunch/dinner slots). Saves the plan to Firestore. Could tie into the AI meal prep planner idea (#14) to auto-suggest a week based on tags, cook time, or dietary goals.

22. **Shopping list** — Automatically aggregate ingredients from all recipes in the current weekly meal plan into a single grocery list. Tap items to check them off while shopping. Ingredients from the same recipe are grouped, and duplicate ingredients across recipes are combined. Shareable as plain text for sending to a family member.

23. ~~**Clip recipes from social media videos**~~ — **Done.** Paste an Instagram, Facebook, or YouTube Shorts URL and NomBook fetches the post caption via existing CORS proxies, parses ingredients and steps using text heuristics, and pre-fills the edit form. Falls back to dumping the full caption in Notes if no structured recipe is detected. LLM-powered version remains a future enhancement.
