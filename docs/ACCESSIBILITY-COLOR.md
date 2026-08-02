# Accessibility — color & contrast

**Audience:** anyone changing UI colors, CSS tokens, or page copy styles.  
**Standard:** WCAG 2.1 Level AA (normal text **4.5:1**, large text / UI chrome **3:1**).

## Surfaces

| Surface | Background tokens | Default text |
|---------|-------------------|--------------|
| Dark (default site + admin) | `--color-bg`, `--color-bg-elevated`, `--color-bg-surface` | `--color-text`, `--color-text-secondary`, `--color-text-muted` |
| Light (`.section--light` only) | `--color-bg-light`, `--color-bg-light-elevated` | `--color-text-on-light`, `--color-text-on-light-secondary` |

Admin is **dark**. Do not treat `.admin-shell` like a light surface.

## Brand colors — where they may be used

| Token | Hex | On dark bg | On light bg |
|-------|-----|------------|-------------|
| `--color-brand-primary` (yellow) | `#fff200` | Links, accents, focus, CTAs | **Do not** use as body/link text (fails) |
| `--color-brand-secondary` (navy) | `#0e284b` | **Never** as text, icons, or links | Links, headings, primary text |

Navy on near-black looks like “blue that disappears.” Yellow on cream fails the same way.

## Link tokens (prefer these)

| Context | Token |
|---------|--------|
| Dark pages / admin | `--color-link` / `--color-link-hover` |
| `.section--light` | `--color-link-on-light` / `--color-link-on-light-hover` |
| Eyebrows / labels on dark | `--color-accent-on-dark` (yellow) |

Defined in `src/styles/tokens.css`. Wired in `src/styles/global.css`.

## Checklist before shipping color changes

1. Pair every text/icon color with its **actual** background (dark vs light section).
2. Never use `--color-brand-secondary` (or raw navy/blue) for text on `--color-bg*`.
3. Never use `--color-brand-primary` (yellow) for text on `--color-bg-light*`.
4. Status colors (`--color-error`, `--color-success`, `--color-warning`, `--color-live`) must remain readable on dark; if you darken them for light surfaces, add a separate on-light token.
5. Focus ring stays `--color-focus` (yellow) with visible offset.
6. Spot-check: Apply forms, Tournament rules panels, Admin tables/selects, footer links, homepage light sections.

## Quick verification

- Browser DevTools → Accessibility → contrast (or axe / Lighthouse).
- Toggle through `/apply`, `/teams/rules`, `/admin`, and a homepage light band.

## Related

- Tokens: `src/styles/tokens.css`
- Global link rules: `src/styles/global.css`
- Brand direction: `docs/Freetail-7s-Visual-Experience-Brief-v1.md` (Color direction)
- Cursor rule: `.cursor/rules/accessibility-color-contrast.mdc`
