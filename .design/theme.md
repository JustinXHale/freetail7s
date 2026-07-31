# Freetail 7s design tokens

Source of truth: `img/freetailLogos/` and `src/styles/tokens.css`.

## Brand

“The bats fly again.” Dark, atmospheric, photography-led tournament experience.

**Default logo (dark UI):** `FT7s Full Logo.png` → `src/assets/logos/ft7s-full.png` (header, hero, PWA icons). Soft yellow glow applied in CSS.

**White logo (optional):** `FT7s Full Logo (white).png` → `src/assets/logos/ft7s-full-white.png`.

**Photo archive:** Historical event photography is on [Facebook Freetail 7s photos](https://www.facebook.com/freetail7s/photos). Curate approved images into Storage with credits and alt text before using them as heroes/galleries.

## Colors

| Token | Value | Use |
|-------|-------|-----|
| Background | `#0a0a0a` | Public chrome, hero (black site) |
| Elevated | `#141414` | Panels on dark |
| Light surface | `#f4f4f2` | Forms, long copy, admin tables |
| Brand primary | `#fff200` | Accents, CTA, focus (logo yellow) |
| Brand secondary | `#0e284b` | Logo navy |
| Live | `#ef4444` | Live match state |
| Success | `#22c55e` | Accepted / success |
| Warning | `#f59e0b` | Delayed / stale |
| Error | `#f87171` | Errors / declined (readable on dark) |

Legacy EcoWear colors appear only in sponsor lockups.

## Typography

- Display: **Barlow Condensed** — headlines, dates, scores, CTAs
- Body / UI: **Manrope** — body, forms, nav, admin
- Tabular numerals for scores, times, standings

## Motion

Short section transitions, score feedback, restrained live pulse. Honor `prefers-reduced-motion`.
