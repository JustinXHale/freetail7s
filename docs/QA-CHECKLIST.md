# QA review checklist

Run after feature work. Fix findings, then re-run until clean.

## Consistency

- [ ] Brand yellow `#fff200`, navy `#0e284b`, black backgrounds
- [ ] Barlow Condensed for display; Manrope for UI
- [ ] Nav labels match PRD IA
- [ ] Empty states on teams, schedule, MVP, applications
- [ ] Admin uses light surfaces; public uses dark immersive chrome

## Bugs

- [ ] Apply form submits and appears in `/admin/applications`
- [ ] Contact + email signup honeypot fields ignored when filled
- [ ] Score save increments version and updates public schedule
- [ ] Fan MVP rejects double vote for same voter key
- [ ] Emergency banner toggles from admin settings
- [ ] Firestore rules deny public read of applications (when not in demo)

## Cross-device / PWA

- [ ] Mobile nav opens/closes
- [ ] Installable (manifest + icons)
- [ ] Schedule readable outdoors (contrast)
- [ ] Offline shell loads via service worker

## Accessibility

- [ ] Skip link works
- [ ] Focus visible on buttons/links
- [ ] Form errors use `role="alert"`
- [ ] Scores not color-only (status labels present)
- [ ] `prefers-reduced-motion` respected
