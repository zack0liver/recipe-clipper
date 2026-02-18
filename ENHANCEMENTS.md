# Bitebase — Enhancements

## Existing
1. Offline mode — cache recipes in localStorage for viewing without internet
2. Image support — display recipe images from extracted data
3. Meal prep planner — select recipes for the week, generate combined grocery list
4. Recipe categories/folders
5. Import/export recipes (JSON backup)
6. Share recipe via URL or clipboard
7. Print-friendly view for kitchen use
8. Cooking mode — step-by-step view with large text and wake lock
9. Scale recipe servings (auto-adjust ingredient quantities)
10. Sort recipes by date added, alphabetical, cook time

## New (Session 1)

11. **Faster extraction** — Current flow hits corsproxy.io, waits for failure, then retries allorigins.win sequentially (~8s on slow sites). Options to explore: run both proxies in parallel and take whichever responds first; or add a server-side extraction endpoint (e.g. Cloudflare Worker) to bypass proxy blocking entirely. Worth investigating what's causing the delay first.

12. **Family / shared recipe books** — Each user has their own account but can opt in to view a spouse's or family member's recipes. Possible approach: shared collection ID stored on each user's profile in Firestore; toggle in settings to show "My Recipes" vs "Family Recipes" vs both. Needs auth design thought.

13. **Quick delete from list view** — Swipe or long-press on a recipe card to reveal a Delete button, with a confirm dialog to prevent accidental deletes. Avoids navigating into the detail view just to delete.

14. **Rename / re-title a recipe** — Quick inline edit of the recipe title from the detail view without entering full edit mode.

15. **AI-powered meal prep planner** — Use the recipe database (leveraging tags like "high protein", "healthy", "quick", "meal-prep") to suggest a weekly meal plan. Could use an LLM API call to generate a plan based on dietary goals, available cook time, or what ingredients you have on hand.

16. **LLM-style search** — Natural language search across the recipe database (e.g. "something high protein under 30 minutes" or "chicken without dairy"). Could call an LLM API with the recipe list as context, or use local keyword scoring across title, tags, ingredients, and notes as a lighter-weight first pass.
