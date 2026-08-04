export const DIVISION_SEED = [
  {
    id: 'premier-men',
    code: 'premier-men' as const,
    name: 'Premier Men',
    shortName: 'PM',
    capacity: 8,
    order: 1,
    isU18: false,
  },
  {
    id: 'premier-women',
    code: 'premier-women' as const,
    name: 'Premier Women',
    shortName: 'PW',
    capacity: 8,
    order: 2,
    isU18: false,
  },
  {
    id: 'elite-u18-boys',
    code: 'elite-u18-boys' as const,
    name: 'Elite U18 Boys',
    shortName: 'U18B',
    capacity: 8,
    order: 3,
    isU18: true,
  },
  {
    id: 'elite-u18-girls',
    code: 'elite-u18-girls' as const,
    name: 'Elite U18 Girls',
    shortName: 'U18G',
    capacity: 8,
    order: 4,
    isU18: true,
  },
]

export const DEFAULT_FAQS = [
  {
    id: 'who-can-apply',
    question: 'Who can apply to Freetail 7s?',
    answer:
      'Qualified Premier and Elite U18 teams may apply. Acceptance is by invitation and application review. Capacity is eight teams per division. See Tournament rules for age eligibility and Premier 19+ requirements.',
    order: 1,
  },
  {
    id: 'entry-fee',
    question: 'What is the entry fee?',
    answer:
      'Base entry fee is $650 per team, due in full by November 20, 2026. Same-umbrella or approved affiliate teams: $600 each for two divisions, $575 for three, $550 for four (locked once accepted). Legacy Ecowear Freetail custom kit package: additional $50 off that team only.',
    order: 2,
  },
  {
    id: 'format',
    question: 'How many matches does each team play?',
    answer:
      'Every team is guaranteed five matches: three pool matches plus a championship or placement semifinal and final. Every team finishes with a placement from first through eighth.',
    order: 3,
  },
  {
    id: 'venue',
    question: 'Where is the tournament?',
    answer:
      'Huns Rugby Ranch, 4107 Nixon Lane, Austin, Texas. Primary plan is one competition field with a secondary field for warm-up and contingency.',
    order: 4,
  },
  {
    id: 'u18',
    question: 'Are there special requirements for Elite U18 divisions?',
    answer:
      'Players must be born on or after 1 September 2007 (up to two over-age waivers born no earlier than 1 June 2007, TD approval). Guardian/waiver and photo consent apply. Private roster and contact information for U18 players will not be published. Full details under Tournament rules.',
    order: 5,
  },
  {
    id: 'prizes',
    question: 'What do division champions receive?',
    answer:
      'A free set of 13 kits, plus a refund of that team’s 2027 entry fee or free entry to next year’s Freetail 7s (winner’s choice).',
    order: 6,
  },
  {
    id: 'refunds',
    question: 'What is the withdrawal and refund policy?',
    answer:
      'Up to 75% refund through November 20, 2026; then 25 percentage points less each week (75% → 50% → 25% → 0%). Full refund if a suitable replacement team is found. Force majeure at the tournament director’s discretion. Fee and refund details are on the Apply page; also see Terms.',
    order: 7,
  },
  {
    id: 'division-drop',
    question: 'Can a division be cancelled if it does not fill?',
    answer:
      'Yes. Any division may be dropped if there are not enough teams to fill the spots. Affected teams will be notified at least 30 days in advance. No team is fully accepted until payment has been received in full.',
    order: 8,
  },
]

export const DEFAULT_SPONSORS = [
  {
    id: 'legacy-ecowear',
    name: 'Legacy Ecowear',
    tier: 'title' as const,
    blurb:
      'Title sponsor and event host. Eco-friendly teamwear and gear — formerly Hooligan Sport.',
    order: 1,
    url: 'https://legacyecowear.com/pages/legacy-ecowear-company-profile',
  },
  {
    id: 'to3',
    name: 'Tō3',
    tier: 'supporting' as const,
    blurb: 'Communications sponsor. Free live voice for crews at the venue.',
    order: 2,
    url: 'https://justinxhale.github.io/to3-site/',
  },
  {
    id: 'project-popolo',
    name: 'Project Pōpolo',
    tier: 'supporting' as const,
    blurb: 'Referee crew managers for Premier and Elite U18 matches.',
    order: 3,
    url: 'https://projectpopolo.com/',
  },
]
