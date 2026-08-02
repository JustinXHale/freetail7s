# Freetail 7s PWA

## Product Requirements Document

**Version:** 1.2  
**Status:** Initial build brief  
**Companion document:** Freetail 7s Visual Experience and Brand Direction  
**Event:** 2027 Freetail 7s  
**Event dates:** Friday, January 1–Sunday, January 3, 2027  
**Venue:** Huns Rugby Ranch, 4107 Nixon Lane, Austin, Texas  
**Title sponsor and event host:** Legacy EcoWear

---

## 1. Product Summary

The Freetail 7s PWA will be the central source of truth for the 2027 tournament. It will replace the existing WordPress-style event site with a fast, mobile-first application that supports the entire event lifecycle:

- Promoting the tournament
- Inviting and registering teams
- Publishing accepted teams and tournament information
- Creating and managing pools, schedules, scores, standings, and results
- Engaging supporters through Fan MVP voting
- Sharing live tournament announcements
- Providing authenticated administrative and event-operations tools

The public experience should feel like a polished elite tournament website. The authenticated experience should give the event organizer one reliable place to manage information without updating multiple pages, documents, or platforms.

The application will be maintained directly by the event organizer through a GitHub-based development workflow and built to support quick updates before and during the event.

---

## 2. Problem

Freetail 7s information currently lives across an older website, forms, schedules, spreadsheets, messages, social media, and organizer knowledge. That creates several problems:

- Teams may receive inconsistent or outdated information.
- Schedule changes require updates in multiple places.
- Tournament announcements can be missed.
- Applications, payments, team status, and event content are difficult to track together.
- WordPress introduces unnecessary maintenance for a relatively focused event.
- Game-day information needs to be mobile-friendly and quickly editable.
- Private operational information cannot safely live on the public website.

The PWA should make the published information authoritative: if a team, player, referee, staff member, or spectator needs an answer, the website should be the first place they look.

---

## 3. Product Vision

Create a modern, reliable tournament platform that gives every participant the same high-quality experience from invitation through the final whistle.

The product should be:

- **Authoritative:** One source of truth for event information.
- **Fast:** Optimized for mobile devices and limited venue connectivity.
- **Simple:** Easy for spectators and teams to understand without instruction.
- **Operational:** Useful to the organizer and event staff, not only promotional.
- **Maintainable:** Manageable by one technically comfortable organizer.
- **Reusable:** Capable of supporting future Freetail 7s tournaments without rebuilding the application.

---

## 4. Event Model

### Divisions

- Premier Men
- Premier Women
- Elite U18 Boys
- Elite U18 Girls

### Capacity

- Eight teams per division
- Two pools of four per division
- 32 teams total

### Competition format

Each team is guaranteed five matches:

1. Three pool matches
2. One championship or placement semifinal
3. One championship or placement final

Every team finishes with a final placement from first through eighth.

### Tournament schedule model

- **Friday:** Elite U18 Boys and Girls pool play
- **Saturday:** Elite U18 knockout and placement matches; first two Premier Men and Women pool rounds
- **Sunday:** Final Premier Men and Women pool round; adult knockout and placement matches
- **Total matches:** 80
- **Primary plan:** One competition field
- **Secondary field:** Warm-up, contingency, and emergency overflow

### Registration

- Entry fee: **$700** per team, due in full by November 20, 2026.
- Multi-division / approved affiliate discount (locked once accepted): 2 divisions **$650** each; 3 **$625**; 4 **$600**.
- Legacy Ecowear Freetail custom kit package: additional **$50** off that team only (stacks with multi-division rate).
- Withdrawals: up to 75% refund through Nov 20, then −25 percentage points each week; full refund if a suitable replacement is found.
- Public handbook: Tournament rules (`/teams/rules`) — see also `docs/tournament-rules-freetail-2027.md`.

---

## 5. Goals

### Primary goals

1. Give teams and spectators one reliable location for all tournament information.
2. Allow the organizer to update public information without editing source code.
3. Allow the organizer to build and manage the tournament schedule and scores directly through the authenticated application.
4. Provide a secure administrative area for private event operations.
5. Make the application reliable and useful on mobile devices during the tournament.
6. Build a reusable foundation for future Freetail 7s events.
7. Increase fan participation through an in-app Fan MVP voting experience.

### Secondary goals

1. Increase team application completion.
2. Encourage organizations to bring corresponding boys/girls or men/women teams.
3. Promote Legacy EcoWear teamwear incentives.
4. Improve sponsor visibility.
5. Support spectator attendance and ticket sales.
6. Reduce repetitive questions sent directly to the organizer.

### Non-goals for the initial release

- Replacing full accounting software
- Building a custom hotel-booking platform
- Building a complete referee-assignment system
- Managing protected medical records
- Storing unnecessary personal information about U18 players
- Building native iOS or Android applications
- Creating a general-purpose tournament platform for other organizations

---

## 6. Users

### Tournament organizer

Needs complete control over event information, applications, teams, schedules, results, announcements, and access.

### Event administrator or trusted staff

Needs limited access to update assigned areas such as scores, teams, content, or announcements.

### Team manager or coach

Needs to understand the event, apply, confirm acceptance, pay registration, submit required team information, and view schedule updates.

### Player

Needs quick access to schedules, results, venue information, tournament rules, and announcements.

### Parent or guardian

Needs clear U18 event information, venue details, schedule information, safety expectations, and required forms.

### Referee

Needs the current match schedule, assignments or operational instructions, field information, and tournament contacts.

### Spectator

Needs tickets, schedules, results, venue information, parking details, event policies, and announcements.

### Sponsor

Needs appropriate brand visibility and a credible event destination to share.

---

## 7. Product Scope and Release Phases

## Phase 1: Announcement and applications

Phase 1 must be available before the tournament is publicly announced.

### Public features

- Event homepage
- Dates, venue, divisions, and format
- Event positioning and history
- Team application or registration-interest form
- Registration fee and payment deadline
- Legacy EcoWear title-sponsor presentation
- Team-entry incentives once finalized
- Frequently asked questions
- Contact form
- Sponsor area
- Travel and host-hotel placeholder
- Email-list or tournament-update signup

### Admin features

- Secure administrator sign-in
- Edit core event content
- View and export team applications
- Mark applications as submitted, reviewing, accepted, waitlisted, or declined
- Manage division capacity
- Publish announcements
- Manage FAQ content

### Phase 1 acceptance criteria

- The organizer can change key event details without a code deployment.
- A team can submit an application successfully from a phone.
- The organizer can review the submitted application privately.
- No private application data is publicly accessible.
- Public pages are installable as a PWA and work on current mobile and desktop browsers.

---

## Phase 2: Accepted teams and tournament preparation

Phase 2 should be available after applications begin and before pools are announced.

### Public features

- Accepted-team directory by division
- Team profiles with logo, location, and optional short description
- Host-hotel and travel information
- Spectator ticket information
- Venue map, parking, seating, restroom, and accessibility information
- Tournament rules and eligibility
- Published pools
- Initial schedule
- Sponsor directory

### Team-management features

- Team-manager access or secure team-specific submission link
- Team contact confirmation
- Logo upload
- Team profile submission
- Payment-status visibility
- Required-document checklist
- Roster submission or roster-status tracking
- U18 guardian/waiver workflow or links to the approved external system

### Admin features

- Create and edit teams
- Assign teams to divisions and pools
- Track payment status
- Track required team materials
- Import and export team data
- Generate or upload schedules
- Publish or unpublish pools and schedules
- Manual override for every generated value

---

## Phase 3: Live tournament experience

### Public features

- Today view
- Live and upcoming matches
- Full schedule with division, team, day, and status filters
- Pool standings
- Bracket and placement view
- Match results
- Fan MVP nominees and voting
- Tournament announcements
- Delay or emergency banner
- Streaming links
- Final results and champions

### Admin and staff features

- Start, delay, complete, or cancel a match
- Create, edit, reorder, publish, and unpublish tournament matches
- Enter and correct scores
- Record forfeits
- Update field and kickoff time
- Publish urgent announcements
- Recalculate standings
- Override standings when required
- Lock completed pool stages
- Advance teams into semifinal and placement matches
- Open and close Fan MVP voting
- Manage Fan MVP nominees and publish winners
- Record referee notes or operational notes without making them public

### Reliability requirements

- Previously loaded schedules remain viewable during weak connectivity.
- Admin score updates prevent accidental duplicate submissions.
- Public pages refresh efficiently without requiring the user to reload manually.
- Every schedule or result change records who made it and when.

---

## Phase 4: Post-tournament

- Publish champions and final placements
- Archive the complete schedule and results
- Publish photo and video galleries
- Thank sponsors, teams, referees, trainers, and volunteers
- Collect team feedback
- Open interest registration for the next tournament
- Duplicate the event structure for the following year without overwriting the 2027 archive

---

## 8. Public Information Architecture

### Primary navigation

1. Home
2. Tournament
3. Teams
4. Schedule & Results
5. Visit
6. Sponsors
7. FAQ
8. Fan MVP

### Recommended routes

- `/`
- `/tournament`
- `/apply`
- `/teams`
- `/teams/:teamSlug`
- `/pools`
- `/schedule`
- `/standings`
- `/results`
- `/fan-mvp`
- `/visit`
- `/tickets`
- `/sponsors`
- `/faq`
- `/contact`
- `/updates`
- `/updates/:updateSlug`

### Tournament page

- Event overview
- Tournament history
- Divisions
- Competition format
- Five-match guarantee
- Venue and dates
- Entry fee and deadlines
- Application process
- Awards
- Rules and eligibility

### Visit page

- Huns Rugby Ranch address
- Map and directions
- Airport information
- Parking
- Seating
- Accessibility
- Restrooms
- Food and beverage
- Host hotel
- Local area information

---

## 9. Administrative Information Architecture

### Recommended routes

- `/admin`
- `/admin/applications`
- `/admin/teams`
- `/admin/divisions`
- `/admin/pools`
- `/admin/schedule`
- `/admin/results`
- `/admin/fan-mvp`
- `/admin/announcements`
- `/admin/content`
- `/admin/sponsors`
- `/admin/operations`
- `/admin/users`
- `/admin/settings`

### Admin dashboard

The dashboard should show:

- Applications by status
- Accepted teams by division
- Remaining division capacity
- Payments due or incomplete
- Missing team information
- Upcoming administrative deadlines
- Unpublished schedule changes
- Recent score or content updates
- Active tournament alerts

### Operations area

The private operations area may include:

- Organizer contacts
- Venue contacts
- Trainer contacts
- Referee information
- Broadcast information
- Vendor status
- Facility checklist
- Restroom and sanitation details
- Emergency action plan
- Internal documents and links
- Daily opening and closing checklists
- Incident and disciplinary links

Sensitive medical information should not be stored in this system.

---

## 10. Roles and Permissions

Admin access must be secured through authentication and authorization. Hiding an admin link is not sufficient security.

### Owner

- Full system access
- Manage users and roles
- Edit all event information
- Publish and unpublish content
- Manage teams, schedules, results, and settings

### Event administrator

- Manage applications and teams
- Manage content and announcements
- Manage schedules and results
- Cannot transfer ownership or delete the event

### Scorekeeper

- View private game-day information
- Enter and correct scores
- Update match status
- View the organizer-managed schedule
- Cannot access applications, payment information, or system settings

### Content editor

- Update public pages, FAQ, sponsors, and announcements
- Cannot edit payments, teams, or results unless separately authorized

### Team manager

- Access only the manager’s own team information
- Submit required team materials
- View payment and submission status
- Cannot see other teams’ private information

### Public user

- Read published tournament information only

---

## 11. Core Data Model

### Event

- Event name
- Year
- Dates
- Venue
- Status
- Public contact information
- Registration settings
- Ticket settings
- Sponsor settings

### Division

- Name
- Type
- Age category
- Capacity
- Entry fee
- Registration deadline
- Eligibility summary
- Published status

### Organization

- Organization name
- Location
- Primary contact
- Entered teams
- Paired-entry eligibility
- Legacy EcoWear incentive status

### Team

- Team name
- Organization
- Division
- Logo
- Location
- Description
- Application status
- Payment status
- Pool
- Public status

### Application

- Applicant and organization
- Requested division
- Team history or qualifications
- Contact details
- Submission date
- Review status
- Internal notes
- Acceptance date

### Pool

- Division
- Pool name
- Teams
- Standings rules
- Published status

### Match

- Match number
- Event day
- Scheduled kickoff
- Actual kickoff
- Field
- Division
- Stage
- Pool or bracket reference
- Home team
- Away team
- Home score
- Away score
- Match status
- Streaming link
- Public notes
- Internal notes

### Player or MVP nominee

- Public display name
- Team
- Division
- Player number or position when supplied
- Profile image when approved
- Short public description
- Nomination status
- Public status

The public nominee record must remain separate from private roster, guardian, contact, and eligibility information.

### Fan MVP vote

- MVP category or division
- Nominee
- Vote timestamp
- Voting-session identifier
- Abuse-prevention signals
- Valid, flagged, or invalid status

The voting record should store only the minimum information needed to operate and protect the vote.

### Standing

- Team
- Played
- Wins
- Draws
- Losses
- Points for
- Points against
- Point differential
- Competition points
- Rank
- Override reason

### Announcement

- Title
- Message
- Severity
- Publish time
- Expiration time
- Audience

### Sponsor

- Name
- Logo
- Tier
- Website
- Description
- Display order

### User

- Name
- Email
- Role
- Access status
- Last sign-in

### Audit record

- User
- Action
- Entity
- Previous value
- New value
- Timestamp

---

## 12. Schedule and Results Requirements

### Schedule

- Support 80 matches across three days.
- Allow the organizer to create the complete tournament schedule inside the admin application.
- Allow individual and bulk match creation.
- Allow drag-and-drop or equivalent schedule reordering.
- Allow schedules to be saved as drafts before publication.
- Allow the organizer to publish, unpublish, and republish schedules.
- Support one primary competition field.
- Support a secondary field when contingency use is required.
- Use an initial 22-minute match-slot model.
- Allow buffer periods that are not matches.
- Prevent accidental team schedule conflicts.
- Flag insufficient recovery periods.
- Allow manual adjustments after generation.
- Preserve match numbers when times change.
- Provide clear warnings before a schedule change affects a published match.
- Record an audit history for schedule changes.

### Organizer schedule workflow

1. Create or confirm divisions, teams, and pools.
2. Generate or manually create pool matches.
3. Assign dates, kickoff times, fields, and match numbers.
4. Review team conflicts and recovery warnings.
5. Save the schedule as a draft.
6. Publish the approved schedule.
7. Make controlled changes when required.
8. Notify affected users when a published match changes.

The schedule must remain editable after publication without requiring a code deployment or spreadsheet replacement.

### Score management

- Authorized staff can enter scores from a phone, tablet, or desktop.
- Score entry must identify the match and both teams clearly.
- The system should require confirmation before marking a match final.
- Final scores automatically update pool standings where applicable.
- Corrected scores automatically recalculate affected standings and brackets.
- Score corrections require an audit record showing who changed the result and when.
- Authorized staff can record forfeits, abandoned matches, and cancelled matches.
- Draft or unconfirmed scores must not appear publicly as final.
- The organizer can override an automatically calculated result or advancement with a required reason.

### Pool standings

- Automatically calculate standings after published results.
- Support configurable competition points and tiebreakers.
- Show an explanation of tiebreaking rules publicly.
- Allow authorized manual overrides with a required reason.

### Brackets and placements

Each division must support:

- First through fourth championship semifinals
- Fifth through eighth placement semifinals
- First-place final
- Third-place match
- Fifth-place match
- Seventh-place match

### Match status

- Scheduled
- Warm-up or on deck
- Live
- Delayed
- Final
- Forfeit
- Cancelled

---

## 13. Fan MVP Voting Requirements

### Purpose

Fan MVP voting will create a simple tournament-day engagement loop inside the PWA. It should give supporters a reason to return to the application beyond checking schedules and scores while creating a recognizable fan-selected tournament award.

### Public experience

- Display the active Fan MVP category or categories.
- Display approved nominees with team, division, image, and short description when available.
- Allow a supporter to select one nominee and submit a vote.
- Confirm that the vote was received.
- Clearly display when voting opens and closes.
- Prevent additional votes when the configured voting limit has been reached.
- Do not display live vote totals unless the organizer explicitly enables them.
- Publish the winner after the organizer verifies and closes the vote.
- Provide a shareable winner view after publication.

### Admin experience

- Create one overall Fan MVP award or separate awards by division.
- Add, edit, reorder, publish, and remove nominees.
- Open, pause, reopen, and close voting.
- Configure the voting start and end times.
- Configure the allowed voting frequency.
- View total votes and participation.
- Review voting activity that has been flagged as suspicious.
- Invalidate abusive or duplicate votes.
- Select and publish the verified winner.
- Export voting results.
- Preserve an audit history of voting configuration and winner publication.

### Voting integrity

The application must include reasonable protection against automated or repeated voting without creating unnecessary friction for legitimate supporters.

Potential controls include:

- Authenticated voting
- Verified email or magic-link voting
- One vote per account
- One vote per voting session or device
- Rate limiting
- Bot protection
- Duplicate-pattern detection
- Server-side vote validation

The final voting method remains a product decision. Client-side restrictions alone are not sufficient.

### U18 considerations

- Only organizer-approved U18 nominees may be published.
- Public nominee records must not expose birth dates, contact information, guardian information, or private roster data.
- Images and names must follow the approved U18 consent and photography policy.
- The organizer must be able to disable voting for an individual division if consent or nomination requirements are incomplete.

### Fan MVP acceptance criteria

- Voting can be opened and closed without a code deployment.
- A supporter can complete a vote comfortably on a phone.
- A vote is validated by the backend before it is counted.
- The organizer can review participation without seeing unnecessary personal information.
- Live totals remain private by default.
- The verified winner can be published to the public PWA.

---

## 14. Application and Registration Requirements

### Initial application fields

- Organization name
- Team name
- Division
- City, state, and country
- Primary contact
- Email
- Phone
- Team website or social profile
- Team history and recent results
- Why the team is a fit for Freetail 7s
- Whether the organization plans to enter the corresponding gender division
- Whether the organization is interested in Legacy EcoWear kits
- Agreement to application terms

### Application workflow

1. Team submits application.
2. Organizer receives a private notification.
3. Organizer reviews the application.
4. Application is accepted, waitlisted, or declined.
5. Accepted team receives registration instructions.
6. Registration is paid in full by November 20, 2026.
7. Team completes remaining event requirements.
8. Team is published after organizer approval.

### Payments

The PWA should initially support linking to an approved payment provider rather than storing card information.

The system should track:

- Amount due
- Discounts or credits
- Amount paid
- Payment date
- Payment status
- Refund status
- Internal transaction reference

Final pricing, discounts, refund rules, and payment provider remain to be determined.

---

## 15. Content Management Requirements

The organizer must be able to update the following without changing code:

- Homepage announcement
- Dates and venue
- Registration status
- Entry fee and deadlines
- Divisions
- Tournament format
- Team list
- Travel and hotel information
- Ticket information
- Food and beverage information
- FAQ
- Sponsors
- Contact information
- Rules and policies
- Tournament alerts
- Fan MVP content, nominees, voting state, and winner

Content should support draft and published states where appropriate.

---

## 16. Notifications

### Phase 1

- Email confirmation after an application is submitted
- Organizer notification for new applications
- Acceptance, waitlist, and decline emails

### Later phases

- Payment reminders
- Missing-information reminders
- Schedule-published notification
- Schedule-change notification
- Tournament alert notification
- Fan MVP voting-open and winner notifications

Email is the required initial channel. SMS and push notifications are future enhancements.

---

## 17. PWA and Nonfunctional Requirements

### Performance

- Mobile-first responsive interface
- Core public pages load quickly on cellular connections
- Images are optimized and lazy loaded
- Schedule views remain usable with large datasets

### Installability

- Valid web app manifest
- Branded application icons
- Standalone display mode
- Installable on supported mobile and desktop browsers

### Offline and weak-connectivity behavior

- Cache the application shell.
- Cache the most recently loaded schedule, teams, standings, and venue information.
- Clearly show when displayed information may be stale.
- Queue supported admin actions only when safe; otherwise require reconnection.

### Accessibility

- Target WCAG 2.2 AA
- Keyboard-accessible navigation and admin controls
- Visible focus states
- Sufficient color contrast
- Semantic headings and landmarks
- Form errors announced to assistive technology
- Scores and status are not communicated through color alone

### Security and privacy

- Authentication required for all admin routes and data.
- Server-enforced role permissions.
- Public and private data stored separately or protected through explicit access rules.
- No public U18 roster or personal contact information.
- No payment-card storage.
- Audit important administrative changes.
- Rate-limit public forms and protect them against spam.
- Validate Fan MVP votes on the server and monitor suspicious voting patterns.

### Browser support

- Current Chrome, Safari, Firefox, and Edge
- Current iOS Safari and Android Chrome

---

## 18. Recommended Technical Direction

This section is a recommendation rather than a fixed product requirement.

### Front end

- React
- TypeScript
- Vite
- PWA plugin/service worker
- Responsive component system

### Backend

Firebase is a strong fit because the organizer already has experience with it and the product requires authentication, live data, secure rules, file storage, and server-side actions.

Potential services:

- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Cloud Functions where needed
- Firebase Hosting or another static web host

### Source control and deployment

- GitHub repository
- Pull-request or protected-branch workflow as desired
- Automated preview and production deployment
- Separate development and production environments

GitHub should store and deploy the code, but it should not be treated as the private application database. A Google Sheet may be used for export, reporting, or selected integrations, but the PWA should have one authoritative operational data source.

### Google Forms and Sheets

Google Forms may be used for an initial lightweight application workflow if speed requires it. However:

- Private team data must not be exposed through a public sheet.
- Public schedules and results should not depend on fragile published-sheet URLs.
- The long-term source of truth should be the authenticated application database.
- Import and export to Google Sheets should be supported where it reduces organizer work.

---

## 19. Analytics and Success Measures

### Phase 1 measures

- Unique visitors
- Application-page visits
- Application starts
- Completed applications
- Completion rate
- Division demand
- Paired-team interest
- Legacy EcoWear kit interest
- FAQ usage

### Tournament measures

- Schedule page usage
- Repeat visitors
- Live-result usage
- Fan MVP voting participation
- Percentage of tournament visitors who vote
- Return visits related to voting and winner publication
- Announcement views
- Ticket-link conversions
- Number of organizer questions that could have been answered by the PWA

Privacy-respecting analytics should be preferred.

---

## 20. Open Product Decisions

These decisions do not block initial application architecture, but they affect content and later workflows:

**Decided (published in Tournament rules / site copy):**
- Final team entry fee → $700
- Multi-division / affiliate discount → $650 / $625 / $600
- Legacy / Freetail kit credit → $50 off that team
- Acceptance and cancellation / refund terms → published ladder
- U18 eligibility → born on/after 1 Sept 2007; max 2 waivers from 1 June 2007; age-grade only
- Competition points → 3 / 1 / 0; pool tiebreak H2H → PD → PA → PF → coin; KO sudden death + conversion shootout
- Championship award → 13 kits + fee refund or next-year entry

**Still open:**
- Application opening date (rolling; deadline Oct 1, 2026 on site)
- Payment provider and processing-fee policy
- Host hotel
- Spectator ticket prices and provider
- Beer and concession arrangement
- Broadcast platform and production workflow
- Exact kickoff schedule
- Referee assignments and access needs
- Whether team managers need accounts or secure submission links
- Whether Fan MVP is one tournament-wide award or one award per division
- Fan MVP nomination process and voting eligibility
- Fan MVP voting frequency and identity-verification method
- Final Freetail color tokens after reviewing the existing brand files
- Final display and interface typefaces
- Photo consent and publishing workflow for Elite U18 divisions

---

## 21. MVP Launch Checklist

Before the initial public announcement:

- Production domain connected
- HTTPS enabled
- PWA manifest and icons configured
- Visual tokens documented
- Responsive image processing configured
- Initial curated image collection uploaded with credits and alt text
- Core event facts reviewed
- Application form tested
- Application data secured
- Admin sign-in tested
- Confirmation and organizer-notification emails tested
- Privacy policy published
- Terms/application acknowledgement published
- Contact method tested
- Analytics configured
- Error and empty states reviewed
- Mobile, desktop, and accessibility checks completed
- Backup/export process documented

---

## 22. Definition of Success

The first release is successful when Freetail 7s can be announced using the PWA as the official destination, a qualified team can understand the event and submit an application without needing direct clarification, and the organizer can review that application and update core event information without changing application code.

The full tournament release is successful when teams, spectators, referees, and staff rely on the PWA for the current schedule and results, while the organizer can safely manage tournament changes from one authenticated system.
