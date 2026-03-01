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
