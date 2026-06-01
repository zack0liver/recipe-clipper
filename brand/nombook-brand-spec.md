# NOMBOOK BRAND SPEC
# Version: 2.0
# Updated: 2026-05-31
# Source of truth: brand sheet image (ChatGPT Image May 31, 2026, 09_52_31 PM (1).png)

---

## IDENTITY

```json
{
  "brand": {
    "name": "NOMBOOK",
    "tagline": "Recipes, notes, and kitchen discoveries",
    "tagline-display": "RECIPES, NOTES, AND KITCHEN DISCOVERIES",
    "description": "NOMBOOK is your cozy corner for tried-and-true recipes, personal notes, and little kitchen discoveries that make everyday cooking more joyful.",
    "category": "personal recipe saver app",
    "tone": ["warm", "friendly", "cozy", "approachable", "a little nerdy"],
    "audience": "home cooks who want a personal, low-friction recipe archive",
    "mascot": "a studious dumpling reading a book — round cream dumpling body, round dark-framed glasses, small smile, golden yellow feet, holding and reading a dark green hardcover book with a gold 'N' on the cover",
    "aesthetic": "warm editorial meets cozy kitchen — forest green and warm cream palette, rounded friendly typography"
  }
}
```

---

## COLOR PALETTE

```json
{
  "colors": {
    "forest-green": {
      "hex": "#1F4D3A",
      "label": "Forest Green",
      "use": "primary brand color, logo wordmark, outlines, headings, CTAs, dark backgrounds"
    },
    "sage-green": {
      "hex": "#6E8F6B",
      "label": "Sage Green",
      "use": "secondary accents, hover states, tag chips, secondary buttons"
    },
    "warm-cream": {
      "hex": "#FFF6E7",
      "label": "Warm Cream",
      "use": "page background, mascot body fill, light mode surfaces"
    },
    "golden-yellow": {
      "hex": "#F2C14E",
      "label": "Golden Yellow",
      "use": "accent highlights, mascot feet, book 'N' letterform, badges, Made it! button"
    },
    "warm-gray": {
      "hex": "#E9E6DB",
      "label": "Warm Gray",
      "use": "dividers, card borders, subtle backgrounds, input borders"
    }
  }
}
```

### CSS Tokens

```css
:root {
  --color-forest-green:  #1F4D3A;
  --color-sage-green:    #6E8F6B;
  --color-warm-cream:    #FFF6E7;
  --color-golden-yellow: #F2C14E;
  --color-warm-gray:     #E9E6DB;

  --font-display: 'Nunito', system-ui, sans-serif;
  --font-body:    'Inter', system-ui, sans-serif;

  --radius-sm:   6px;
  --radius-md:   12px;
  --radius-lg:   20px;
  --radius-full: 9999px;

  --shadow-card:     0 2px 12px rgba(31,77,58,0.10);
  --shadow-elevated: 0 6px 24px rgba(31,77,58,0.15);
}
```

---

## TYPOGRAPHY

```json
{
  "fonts": {
    "display": {
      "family": "Nunito",
      "weight": "ExtraBold (800)",
      "character": "Rounded, friendly, approachable",
      "source": "https://fonts.google.com/specimen/Nunito",
      "use": "logo wordmark, headings, section titles, filter pills"
    },
    "body": {
      "family": "Inter",
      "weight": "Regular (400)",
      "character": "Clean, readable, versatile",
      "source": "https://fonts.google.com/specimen/Inter",
      "use": "body copy, UI labels, ingredient lists, instructions, metadata"
    }
  },
  "scale": {
    "xs":   "0.75rem",
    "sm":   "0.875rem",
    "base": "1rem",
    "lg":   "1.125rem",
    "xl":   "1.25rem",
    "2xl":  "1.5rem",
    "3xl":  "2rem",
    "4xl":  "2.75rem"
  }
}
```

---

## LOGO SYSTEM

### 1. Primary Logo (Stacked)
- Mascot centered above wordmark
- Wordmark: "NOMBOOK" in Forest Green (`#1F4D3A`), Nunito ExtraBold
- Tagline below wordmark: "RECIPES, NOTES, AND KITCHEN DISCOVERIES" in spaced small caps, Forest Green
- Canvas: 400 × 500px viewBox
- Background: transparent (designed for Warm Cream backgrounds)

### 2. Horizontal Lockup
- Mascot on left (~120px tall), wordmark + tagline stacked on right
- Wordmark: "NOMBOOK" large, Nunito ExtraBold, Forest Green
- Tagline: "RECIPES, NOTES, AND KITCHEN DISCOVERIES" below wordmark, smaller, spaced caps
- Canvas: 600 × 160px viewBox

### 3. Icon Only
- Mascot only, no wordmark or tagline
- Use for app icon, favicon base, small-size contexts
- Canvas: 200 × 200px viewBox

---

## MASCOT CONSTRUCTION GUIDE

The mascot is a round cream dumpling sitting cross-legged, wearing round glasses, reading a dark green hardcover book.

```json
{
  "mascot": {
    "body": {
      "shape": "large circle / rounded blob",
      "fill": "#FFF6E7",
      "stroke": "#1F4D3A",
      "stroke-width": 3,
      "pleat-marks": {
        "count": 3,
        "color": "#C8B89A",
        "position": "top center of head"
      }
    },
    "glasses": {
      "lens-shape": "circle",
      "fill": "rgba(255,255,255,0.1)",
      "stroke": "#1F4D3A",
      "stroke-width": 3,
      "bridge": { "stroke": "#1F4D3A", "stroke-width": 2 },
      "note": "two round lenses, large relative to face"
    },
    "eyes": {
      "fill": "#1F4D3A",
      "highlight": "#FFFFFF",
      "style": "small dots inside glasses"
    },
    "mouth": {
      "shape": "small upward arc",
      "stroke": "#1F4D3A",
      "stroke-width": 2
    },
    "feet": {
      "shape": "small rounded ovals",
      "fill": "#F2C14E",
      "stroke": "#1F4D3A",
      "stroke-width": 2,
      "position": "bottom left and right, pointing outward"
    },
    "book": {
      "cover-fill": "#1F4D3A",
      "spine-fill": "#163D2E",
      "page-fill": "#FFFFFF",
      "letter-N": {
        "fill": "#F2C14E",
        "position": "center of front cover"
      },
      "gold-trim": "#F2C14E",
      "position": "held open, front-facing, arms wrapping around sides"
    },
    "arms": {
      "fill": "#FFF6E7",
      "stroke": "#1F4D3A",
      "stroke-width": 2.5,
      "style": "small stubby arms on each side of book"
    },
    "shadow": {
      "fill": "#C8B89A",
      "opacity": 0.3,
      "shape": "ellipse under seated body"
    }
  }
}
```

---

## SUPPORTING ICONS

Four brand icons in the same rounded stroke style as the mascot outlines:

| Icon | Description |
|------|-------------|
| Dumpling | Outline of a round dumpling with pleat marks on top |
| Recipe Notes | Open book with a bookmark ribbon |
| Chopsticks | Two crossed chopsticks with golden yellow tips |
| Bowl | Wide bowl with two horizontal stripe accents |

**Icon style rules:**
- Stroke: `#1F4D3A`, 2–3px stroke-width
- Fill: `#FFF6E7` (cream) or transparent
- Accent fill: `#F2C14E` (golden yellow) for tips, stripes, bookmarks
- Size: 24×24px or 48×48px viewBox
- No drop shadows, no gradients

---

## LOGO ASSET CHECKLIST

```
/brand/
  nombook-brand-spec.md          ← This file
  nombook-logo-primary.svg       ← Stacked: mascot above wordmark + tagline
  nombook-logo-horizontal.svg    ← Horizontal: mascot left, wordmark + tagline right
  nombook-icon.svg               ← Mascot only (icon / app icon base)
  nombook-wordmark.svg           ← "NOMBOOK" text only, no mascot
  nombook-favicon.svg            ← 32×32 favicon (mascot or "N" lettermark)
  nombook-og-card.svg            ← 1200×630 social preview card
  nombook-tokens.css             ← CSS custom properties
  nombook-tokens.json            ← Design token JSON
```

---

## USAGE RULES

```json
{
  "do": [
    "Use Forest Green (#1F4D3A) as the dominant brand color",
    "Use Golden Yellow (#F2C14E) as the accent — sparingly, for emphasis",
    "Use Warm Cream (#FFF6E7) as the primary background in light contexts",
    "Use Nunito ExtraBold for all wordmark and headline rendering",
    "Maintain minimum 16px clear space around the logo on all sides",
    "Use the mascot with the glasses and book — these are the defining features"
  ],
  "do-not": [
    "Do not give the mascot a chef hat — the final mascot design does not have one",
    "Do not use the old orange/burnt sienna palette (#FF8C42) — that was the previous direction",
    "Do not use Lora or DM Sans — fonts are now Nunito and Inter",
    "Do not stretch or distort the mascot",
    "Do not place the logo on photographic backgrounds without a backing surface",
    "Do not use font weights lighter than Regular for body or lighter than ExtraBold for the wordmark"
  ]
}
```

---

## PROMPT FOR AI IMAGE/SVG GENERATION

```
Create a set of SVG logo assets for a personal recipe app called "NOMBOOK".

Brand identity:
- Mascot: a round, chubby cream-colored dumpling sitting cross-legged. It wears large round dark-framed glasses, has a small smiling mouth, and tiny golden-yellow rounded feet. It holds and reads an open dark green hardcover book with a gold "N" on the cover and gold trim. Small stubby arms wrap around the sides of the book. Three small pleat marks on top of the head.
- Color palette: Forest Green #1F4D3A (primary), Sage Green #6E8F6B (secondary), Warm Cream #FFF6E7 (background/body), Golden Yellow #F2C14E (accent/feet/book letter), Warm Gray #E9E6DB (dividers)
- Wordmark: "NOMBOOK" in Forest Green, Nunito ExtraBold
- Tagline: "RECIPES, NOTES, AND KITCHEN DISCOVERIES" in spaced small caps, Forest Green
- Aesthetic: warm, cozy, friendly — like a well-loved cookbook

Generate:
1. Primary stacked logo SVG (mascot centered above wordmark + tagline) — 400×500px viewBox
2. Horizontal lockup SVG (mascot left, wordmark + tagline right) — 600×160px viewBox
3. Icon-only SVG (mascot only, no text) — 200×200px viewBox
4. Wordmark-only SVG ("NOMBOOK" text, no mascot) — 320×80px viewBox
5. Favicon SVG (mascot or gold "N" on forest green rounded square) — 32×32px viewBox
6. OG card SVG (mascot + wordmark + tagline on warm cream background) — 1200×630px viewBox

All SVGs: transparent or warm cream background, no external font dependencies.
```
