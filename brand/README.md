# BA monogram: usage guide

**Idea:** one solid B whose counters are replaced by a single A cut through it.
Two initials, one shape. Built only from straight lines and circular arcs on a
256-unit grid.

## Files

| File | Use |
| --- | --- |
| `ba-mark.svg` | Master mark, black. Anything rendered **taller than 32 px**. |
| `ba-mark-small.svg` | Small-size cut (narrower A, heavier crossbar). **32 px and below**: favicons, nav, avatars. |
| `ba-wordmark.svg` | `BLEVIS ALLUSHI`, custom monoline capitals, no font needed. |
| `ba-lockup-horizontal.svg` | Mark + wordmark side by side. Default lockup. |
| `ba-lockup-stacked.svg` | Mark above wordmark. Square-ish spaces (cards, slides). |
| `ba-favicon-tile.svg` | Off-white small cut on an obsidian tile; source of `src/app/favicon.ico`. |
| `export/` | Black, white, off-white and cyan versions of everything, plus PNGs and the web-icon set. Git-ignored: regenerate with the logo-design skill's `export_variants.py` from the masters here. |
| `build_logo.py` | Regenerates the masters: `python brand/build_logo.py`. |

On the site: `src/components/Logo.tsx` (`<BAMark />`, uses `currentColor`),
`src/app/icon.svg` (switches black/off-white with the system theme),
`src/app/favicon.ico`, `src/app/apple-icon.png`.

## Colour

| Name | HEX | RGB | Role |
| --- | --- | --- | --- |
| Obsidian | `#09090B` | 9 9 11 | Primary on light backgrounds; tile colour |
| Off-white | `#FAFAFA` | 250 250 250 | Primary on dark backgrounds |
| Cyan | `#06B6D4` | 6 182 212 | Accent only: hover states, one highlight per layout |

The mark is always **one flat colour**. Never two colours inside the mark, never
gradients, shadows, outlines or 3D.

## Clear space and minimum size

- **Clear space:** keep empty space around the mark equal to the stem width at
  the bottom (the black strip left of the A, about 1/5 of the mark's width) on
  every side. Double it for the lockups.
- **Minimum size:** mark 12 px tall on screen (small cut), 6 mm in print.
  Horizontal lockup 120 px wide. Below that, use the mark alone.

## Lockups

- Horizontal: wordmark cap height = 31% of the mark's height, centred on it;
  gap = 1.5 x the stem width.
- Stacked: wordmark centred under the mark; wordmark width sets the lockup width.
- Don't re-set the wordmark in another font or change its letter spacing.

## Don't

- Stretch, skew or rotate the mark.
- Fill the A counter with a colour (it is a hole; the background shows through).
- Put the black mark on dark or busy backgrounds; switch to off-white instead.
- Use the master at favicon sizes; use the small cut.
- Place it inside a circle or other badge, except the app-icon tile.

## Notes

- Trademark clearance hasn't been checked; run a search before registering it.
- The wordmark is drawn from strokes; if a printer needs outlined shapes, open
  the SVG in a vector editor and use "Outline stroke".
