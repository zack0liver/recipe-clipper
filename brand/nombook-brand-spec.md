# NOMBOOK BRAND ASSET GENERATION SPEC
# Version: 1.0
# Format: Machine-readable instructions for AI-assisted brand asset creation
# Target outputs: SVG logos, CSS variables, PNG exports, font config, favicon

---

## IDENTITY

```json
{
  "brand": {
    "name": "nombook",
    "tagline": "Your recipes. Your way.",
    "category": "personal recipe saver app",
    "tone": ["warm", "playful", "organized", "homey", "a little nerdy"],
    "audience": "home cooks who want a personal, low-friction recipe archive",
    "mascot": "a studious dumpling chef — round dumpling body, tall chef hat, small glasses, holding a recipe notebook and wooden spoon",
    "aesthetic": "cozy kitchen meets editorial cookbook — warm cream and burnt orange palette, slightly rounded typography, clean but not sterile"
  }
}
```

---

## COLOR SYSTEM

Generate a CSS variables file (`nombook-tokens.css`) and a JSON token file (`nombook-tokens.json`) using the following palette:

```json
{
  "colors": {
    "primary": {
      "label": "Dumpling Orange",
      "hex": "#FF8C42",
      "use": "CTAs, logo accent, highlights, links"
    },
    "primary-dark": {
      "label": "Char Siu",
      "hex": "#E07030",
      "use": "hover states, pressed states, borders on primary"
    },
    "secondary": {
      "label": "Soy Ink",
      "hex": "#3D2B1A",
      "use": "headlines, body text, logo wordmark"
    },
    "background": {
      "label": "Rice Paper",
      "hex": "#FFF8F0",
      "use": "page background"
    },
    "surface": {
      "label": "Steam",
      "hex": "#F5EDE0",
      "use": "cards, recipe tiles, sidebar"
    },
    "muted": {
      "label": "Bamboo",
      "hex": "#C8A882",
      "use": "placeholder text, dividers, subtle borders"
    },
    "success": {
      "label": "Scallion",
      "hex": "#5BAD72",
      "use": "saved state, confirmation"
    },
    "error": {
      "label": "Chili",
      "hex": "#D94F3D",
      "use": "delete, error state"
    },
    "text-primary": "#3D2B1A",
    "text-secondary": "#7A5C3A",
    "text-inverse": "#FFF8F0"
  }
}
```

### CSS Output Template

Write this file as `nombook-tokens.css`:

```css
:root {
  --color-primary: #FF8C42;
  --color-primary-dark: #E07030;
  --color-secondary: #3D2B1A;
  --color-background: #FFF8F0;
  --color-surface: #F5EDE0;
  --color-muted: #C8A882;
  --color-success: #5BAD72;
  --color-error: #D94F3D;
  --color-text-primary: #3D2B1A;
  --color-text-secondary: #7A5C3A;
  --color-text-inverse: #FFF8F0;

  --font-display: 'Lora', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-full: 9999px;

  --shadow-card: 0 2px 12px rgba(61,43,26,0.10);
  --shadow-elevated: 0 6px 24px rgba(61,43,26,0.15);
}
```

---

## TYPOGRAPHY

```json
{
  "fonts": {
    "display": {
      "family": "Lora",
      "source": "https://fonts.google.com/specimen/Lora",
      "weights": [400, 600, 700],
      "use": "headings, logo wordmark, recipe titles"
    },
    "body": {
      "family": "DM Sans",
      "source": "https://fonts.google.com/specimen/DM+Sans",
      "weights": [400, 500],
      "use": "body copy, UI labels, ingredient lists"
    },
    "mono": {
      "family": "JetBrains Mono",
      "source": "https://fonts.google.com/specimen/JetBrains+Mono",
      "weights": [400],
      "use": "measurements, quantities, cook times"
    }
  },
  "scale": {
    "xs": "0.75rem",
    "sm": "0.875rem",
    "base": "1rem",
    "lg": "1.125rem",
    "xl": "1.25rem",
    "2xl": "1.5rem",
    "3xl": "2rem",
    "4xl": "2.75rem"
  }
}
```

---

## LOGO ASSETS

Generate each of the following as separate SVG files. All SVGs must use the brand color tokens defined above. SVGs should be self-contained (no external font dependencies — embed or use fallback stacks).

### 1. `nombook-logo-full.svg`
- Mascot (dumpling chef) on the left, wordmark "nombook" on the right
- Mascot: ~80px tall dumpling body shape (ellipse), tall chef hat, round glasses (two small rectangles with a bridge), small smile, blush circles on cheeks, small feet, holding a tiny orange notebook in one hand
- Wordmark: "nom" in `#FF8C42`, "book" in `#3D2B1A`, font: Lora Bold or serif fallback, size ~36px
- Canvas: 320 × 100px viewBox
- Background: transparent

### 2. `nombook-logo-stacked.svg`
- Mascot centered on top, wordmark centered below
- Canvas: 180 × 200px viewBox
- Background: transparent

### 3. `nombook-icon.svg`
- Mascot only (no wordmark)
- Simplified: dumpling body + hat + glasses + minimal face, no arms
- Canvas: 64 × 64px viewBox
- Suitable for use as app icon base
- Background: transparent

### 4. `nombook-wordmark.svg`
- Text only: "nom" in `#FF8C42` + "book" in `#3D2B1A`, Lora Bold, serif fallback
- Canvas: 240 × 60px viewBox
- Background: transparent

### 5. `nombook-favicon.svg`
- Single-letter "n" in `#FF8C42` on a `#3D2B1A` rounded square background, or a tiny dumpling silhouette
- Canvas: 32 × 32px viewBox
- Output also as: `favicon.svg` (browsers support SVG favicons)

### 6. `nombook-logo-light.svg`
- Same as `nombook-logo-full.svg` but inverted for dark backgrounds
- Mascot outline in `#FFF8F0`, wordmark: "nom" in `#FF8C42`, "book" in `#FFF8F0`
- Canvas: 320 × 100px

### 7. `nombook-og-card.svg`
- Open Graph / social preview card
- Canvas: 1200 × 630px
- Background fill: `#FFF8F0`
- Large mascot centered-left (~250px tall)
- Wordmark large (~80px) centered-right
- Tagline below wordmark: "Your recipes. Your way." in `#7A5C3A`, font-size ~28px
- Subtle texture: a very light repeating dot grid in `#F0E4D0`

---

## MASCOT CONSTRUCTION GUIDE

Reference for consistent mascot rendering across all logo files:

```json
{
  "mascot": {
    "body": {
      "shape": "ellipse",
      "fill": "#FFF8F0",
      "stroke": "#DBC8B0",
      "stroke-width": 2,
      "rx": 52,
      "ry": 46
    },
    "hat": {
      "band": { "fill": "#E8DDD0", "height": 10 },
      "crown": { "fill": "#FFFFFF", "stroke": "#E0D5C8", "height": 44, "width": 58 },
      "top": { "shape": "ellipse", "fill": "#FFFFFF" }
    },
    "glasses": {
      "lens-shape": "rounded-rect",
      "fill": "rgba(184,212,240,0.18)",
      "stroke": "#5C4A32",
      "stroke-width": 2.5,
      "bridge": { "stroke": "#5C4A32", "stroke-width": 2.5 }
    },
    "eyes": {
      "iris": "#3D2B1A",
      "highlight": "#FFFFFF"
    },
    "blush": {
      "fill": "#F4A07A",
      "opacity": 0.45
    },
    "mouth": {
      "shape": "arc (upward curve)",
      "stroke": "#C07A5A"
    },
    "notebook": {
      "fill": "#FF8C42",
      "spine": "#E07030",
      "lines": "#FFFFFF"
    },
    "chef-hat-accent": {
      "pleat-lines": "#E0D5C8",
      "opacity": 0.6
    }
  }
}
```

---

## ICON SET (OPTIONAL EXTENSION)

If generating a UI icon set, use these conventions:

```json
{
  "icon-style": "rounded stroke, 2px stroke-width, no fill except on accent icons",
  "size": "24x24px viewBox",
  "stroke-color": "#3D2B1A",
  "accent-color": "#FF8C42",
  "icons-needed": [
    "recipe-book",
    "add-recipe",
    "tag",
    "search",
    "timer",
    "servings",
    "star-favorite",
    "share",
    "edit",
    "delete",
    "chef-hat",
    "ingredient",
    "print"
  ]
}
```

---

## EXPORT CHECKLIST

An AI or build tool should produce the following files:

```
/brand/
  nombook-tokens.css          ← CSS custom properties
  nombook-tokens.json         ← Design token JSON
  nombook-logo-full.svg       ← Horizontal logo (mascot + wordmark)
  nombook-logo-stacked.svg    ← Vertical logo (mascot above wordmark)
  nombook-logo-light.svg      ← Light version for dark backgrounds
  nombook-icon.svg            ← Mascot-only icon
  nombook-wordmark.svg        ← Text-only wordmark
  nombook-favicon.svg         ← 32x32 favicon
  nombook-og-card.svg         ← 1200x630 social preview
  nombook-brand-spec.md       ← This file
```

---

## USAGE RULES

```json
{
  "do": [
    "Use #FF8C42 for 'nom' and #3D2B1A for 'book' — always split this way",
    "Keep mascot proportions consistent — dumpling body should be widest element",
    "Use Lora for all display/heading text",
    "Maintain minimum clear space of 16px around logo on all sides",
    "Use the light logo variant on backgrounds darker than #7A5C3A"
  ],
  "do-not": [
    "Do not stretch or distort the mascot",
    "Do not recolor the wordmark split — both parts must stay their assigned colors",
    "Do not use the mascot without the chef hat",
    "Do not place the logo on busy photographic backgrounds without a backing pill/card",
    "Do not use font weights lighter than 400 for the wordmark"
  ]
}
```

---

## PROMPT FOR AI IMAGE/SVG GENERATION

If passing to a model that generates SVG code directly, use this condensed prompt:

```
Create a set of SVG logo assets for a personal recipe app called "nombook".

Brand identity:
- Mascot: a studious, chubby dumpling character with a tall chef hat, round glasses, blush cheeks, small smile, and tiny feet. Left hand holds a small orange notebook; right hand holds a wooden spoon.
- Color palette: background #FFF8F0 (cream), primary #FF8C42 (burnt orange), text #3D2B1A (dark brown), surface #F5EDE0, muted #C8A882
- Wordmark: "nom" in #FF8C42, "book" in #3D2B1A, Lora Bold serif font
- Aesthetic: warm, cozy, slightly editorial — like a personal cookbook

Generate:
1. Full horizontal logo SVG (mascot left, wordmark right) — 320x100px viewBox
2. Stacked logo SVG (mascot top, wordmark bottom) — 180x200px viewBox
3. Icon-only SVG (simplified mascot, no arms) — 64x64px viewBox
4. Wordmark-only SVG — 240x60px viewBox
5. Favicon SVG (letter "n" in orange on dark brown rounded square) — 32x32px viewBox
6. Light variant of full logo for dark backgrounds — 320x100px viewBox
7. OG card SVG (mascot + wordmark + tagline "Your recipes. Your way.") — 1200x630px viewBox

All SVGs: transparent background, no external dependencies, self-contained.
```
