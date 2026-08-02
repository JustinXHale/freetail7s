# Freetail 7s

## Visual Experience and Brand Direction

**Version:** 1.0  
**Status:** Initial creative brief  
**Companion document:** Freetail 7s PWA Product Requirements Document  
**Event:** 2027 Freetail 7s  
**Event dates:** Friday, January 1–Sunday, January 3, 2027

---

### Creative direction

The visual direction should feel like an elite rugby tournament combined with an Austin New Year’s event. It should communicate speed, credibility, atmosphere, and competition without resembling a generic tournament template.

The experience should be:

- Bold but controlled
- Athletic without relying on clichés
- Dark, atmospheric, and energetic
- Photography-led
- Broadcast-aware
- Distinctly Freetail
- Easy to scan during a live event
- Equally credible for Premier and Elite U18 divisions

The visual system should make the tournament feel established and ambitious while remaining practical for a small event team to maintain.

### Brand concept

The primary creative idea is **“The bats fly again.”**

This concept connects:

- The return of Freetail 7s
- The Mexican free-tailed bat
- Night games and field lighting
- Speed and movement
- Austin’s identity
- The New Year’s event atmosphere

The bat theme should appear through shape, motion, texture, cropping, and language. The interface should not become Halloween-themed, gothic, cartoonish, or overly literal.

### Brand hierarchy

1. **Freetail 7s** is the event brand and should dominate the experience.
2. **Legacy EcoWear** is the title sponsor and event host.
3. Division identities help users navigate but should remain part of one unified tournament.
4. Additional sponsors appear according to sponsorship level.

Legacy EcoWear branding should be prominent and intentional without making the PWA feel like an apparel-store website.

### Color direction

The existing Freetail 7s logo and brand files are the authoritative source for final brand colors.

The interface should use:

- A near-black, charcoal, or deep night-tone foundation (**default for the public site and admin**)
- A warm off-white or light neutral only for deliberate light bands (`.section--light`)
- Yellow brand primary as the interactive accent on dark (links, focus, CTAs)
- Navy brand secondary for text/links **on light surfaces only** — never as text or icons on black (fails WCAG and looks like low-contrast blue)
- One restrained secondary accent for statuses or live-event emphasis
- Legacy EcoWear colors only where sponsor identification requires them

**Contrast rule (AA):** pair colors with the surface they sit on. Yellow fails on cream; navy/blue fails on near-black. Use the link tokens in `src/styles/tokens.css` (`--color-link` vs `--color-link-on-light`). Full checklist: [`docs/ACCESSIBILITY-COLOR.md`](./ACCESSIBILITY-COLOR.md).

Dark backgrounds are the default for immersive and broadcast-style areas. Light bands are for specific homepage/content sections — not a second global theme.

The final design tokens should include:

- Background / elevated / surface (dark)
- Light surface
- Primary / secondary / muted text (dark + on-light)
- Brand primary (yellow) / brand secondary (navy)
- Link / link-on-light
- Accent-on-dark
- Live, success, warning, error
- Border
- Focus

Exact color values should not be finalized until the existing logo and brand assets are reviewed.

### Typography

The recommended typography model is:

- A bold or condensed display face for event headlines, dates, scores, and major calls to action
- A highly readable sans serif for body copy, forms, navigation, schedules, and admin tools
- Tabular numerals for scores, times, standings, and financial values

The display type should feel athletic and editorial rather than militaristic or aggressive. Typography should provide much of the tournament energy so the interface does not depend on decorative effects.

Potential open-source directions include:

- Barlow Condensed or Archivo Narrow for display
- Inter, Manrope, or a similar neutral sans serif for interface and body text

The final selection should be tested against the existing Freetail wordmark.

### Photography strategy

Photography is a primary part of the Freetail identity. The available archive may contain hundreds of images, but the product should use them intentionally rather than displaying an uncurated wall of photos.

Photography should communicate:

- Elite play
- Speed and physicality
- Men’s and women’s competition
- Elite U18 competition
- Team identity
- Officials and event staff
- Austin atmosphere
- Spectators and community
- Championship moments
- The field under lights

#### Photography treatments

- Use full-bleed action photography for hero and featured-story areas.
- Favor tight, directional crops with visible movement and emotion.
- Use consistent aspect ratios within repeated components.
- Apply restrained gradients where necessary for text readability.
- Avoid heavy filters that distort team colors or skin tones.
- Do not place text over visually busy areas without an appropriate overlay.
- Use occasional black-and-white or duotone treatments only as supporting brand moments.
- Preserve the original image whenever editorial cropping is applied.

#### Image balance

Photography selections should represent all four divisions equitably. Premier divisions may lead the overall event presentation, but the Elite U18 divisions must not look like secondary or filler competitions.

#### Photo library requirements

The content system should support:

- Uploading multiple images
- Title, caption, photographer credit, and alt text
- Event year
- Division
- Team tags
- Match tags
- Featured-image designation
- Hero-image designation
- Gallery assignment
- Public or private status
- Display order
- Original image retention
- Automatically generated responsive sizes

#### Performance requirements

- Do not load original full-resolution files into public page layouts.
- Generate optimized AVIF or WebP versions with appropriate fallbacks.
- Use responsive image sources.
- Lazy load offscreen gallery images.
- Load galleries in pages or batches.
- Reserve image dimensions to prevent layout shift.
- Preload only the active hero image.

#### U18 photography

U18 photography must follow the event’s approved participation, waiver, consent, and privacy policies. The public system should not connect an identifiable U18 player’s image to private roster or contact information.

### Layout and composition

The public experience should alternate between immersive event moments and highly legible information.

Recommended composition:

- Full-width photography and large type for storytelling
- Strong grid alignment for competition information
- Generous spacing around primary decisions
- Dense but structured presentation for schedules and standings
- Layered cards only when they clarify hierarchy
- Deliberate edge-to-edge sections on mobile
- Avoid excessive rounded cards, floating pills, or generic dashboard styling

The interface should feel designed as one tournament publication, not assembled from unrelated components.

### Homepage experience

The homepage should follow this approximate narrative:

1. **Hero**
   - Return announcement
   - January 1–3, 2027
   - Austin, Texas
   - Primary team-application call to action
   - Secondary tournament-information action
   - Strong action image or controlled photo rotation

2. **Immediate event facts**
   - Four divisions
   - 32 teams
   - Five guaranteed matches
   - Three days
   - One shared tournament experience

3. **Tournament positioning**
   - Why Freetail is returning
   - Elite invitation and application positioning
   - Premier and Elite U18 competition

4. **Division presentation**
   - Premier Men
   - Premier Women
   - Elite U18 Boys
   - Elite U18 Girls

5. **Featured photography**
   - Curated historical event moments
   - Link to the event story or gallery

6. **Venue**
   - Huns Rugby Ranch
   - Field, lights, seating, and Austin location

7. **Legacy EcoWear**
   - Title-sponsor story
   - Teamwear opportunity

8. **Latest update or application status**

9. **Sponsors**

10. **Final application call to action**

During the event, the top of the homepage should change from promotional mode to tournament mode by prioritizing:

- Today’s matches
- Live match
- Latest results
- Active announcements
- Schedule and standings

### Schedule and results style

The competition interface should take cues from professional sports broadcasts without imitating a specific league.

It should feature:

- Large, readable kickoff times
- Clear team names and logos
- Strong score hierarchy
- Division and stage labels
- Obvious live, final, delayed, and upcoming states
- Fast day and division filtering
- Compact mobile match cards
- Denser desktop schedule tables where appropriate
- Standings with aligned tabular numbers
- Brackets that remain understandable on mobile

The schedule should be usable in bright daylight, under field lighting, and at a glance while moving around the venue.

### Division system

All four divisions belong to the same tournament visual system. Division differentiation should use labels and a restrained supporting cue rather than four unrelated identities.

Division cues may include:

- A small accent color
- A short division code
- A consistent icon or label treatment

Color must never be the only method of identifying a division.

### Components

Public components should include:

- Event hero
- Announcement banner
- Event-stat strip
- Division panel
- Team card
- Match card
- Live-match feature
- Score row
- Standings table
- Bracket view
- Sponsor lockup
- Photo feature
- Gallery grid
- Update card
- Venue information panel
- Application callout
- Fan MVP nominee card
- Fan MVP voting ballot
- Vote confirmation
- Fan MVP winner feature

Admin components should prioritize clarity and speed over the immersive public style. The admin experience may use lighter surfaces and denser tables while sharing the same typography, colors, and status system.

### Fan MVP experience

Fan MVP voting should feel like a featured tournament interaction rather than a generic survey form.

The experience should:

- Use strong player photography where approved.
- Identify the nominee’s team and division clearly.
- Make selecting and confirming a nominee deliberate.
- Show the voting window and current voting status.
- Provide a clear confirmation after submission.
- Keep live vote totals hidden by default.
- Give the published winner a shareable championship-style presentation.
- Remain equally usable for supporters at the venue and those following remotely.

The interface must not use manipulative countdowns, misleading popularity indicators, or visual patterns that encourage accidental voting.

### Motion and interaction

Motion should reinforce speed and state change without slowing down the experience.

Appropriate motion includes:

- Short page and section transitions
- Controlled image reveals
- Score-change feedback
- Live-status pulse used sparingly
- Smooth filtering and sorting
- Subtle directional movement inspired by flight

Avoid:

- Constant background animation
- Aggressive parallax
- Auto-playing video with sound
- Long entrance animations
- Effects that delay access to schedules or forms

All motion must respect reduced-motion preferences.

### Iconography and graphic elements

Iconography should be simple, functional, and consistent.

Supporting graphics may draw from:

- Flight paths
- Wing or bat silhouettes
- Field markings
- Scoreboard geometry
- Austin night-sky textures
- Controlled grain or halftone

Do not use clip-art bats, generic shields, flames, claw marks, or excessive distressed textures.

### Voice and interface copy

The visual tone should be supported by writing that is:

- Direct
- Confident
- Human
- Competitive
- Welcoming
- Informative

Headlines may have more personality, but logistics and rules must remain plain and precise.

Potential campaign language includes:

- The bats fly again.
- Three days. Four divisions. One tournament.
- The first rugby of the year starts here.
- Austin starts the rugby year here.

Campaign language remains subject to final brand and invitation-copy review.

### Visual accessibility

- Meet WCAG 2.2 AA contrast requirements.
- Do not place essential text directly over photography without a tested overlay.
- Maintain readable type sizes at all breakpoints.
- Do not use condensed display fonts for long body copy.
- Provide strong visible focus states.
- Do not rely only on color for division, score, or status meaning.
- Provide useful alt text and optional captions for editorial images.
- Respect reduced-motion settings.

### Visual acceptance criteria

The visual system is successful when:

- The homepage is recognizably Freetail without relying only on the logo.
- The site does not resemble a generic sports WordPress theme.
- Premier and Elite U18 divisions feel part of the same elite event.
- Photography improves the story without damaging performance.
- Schedules and scores are readable within seconds on a phone.
- The public and admin experiences feel related but appropriately optimized for different tasks.
- The design remains usable before, during, and after the tournament.

---
