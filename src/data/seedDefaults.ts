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
      'Qualified Premier and Elite U18 teams may apply. Acceptance is by invitation and application review. Capacity is eight teams per division.',
    order: 1,
  },
  {
    id: 'entry-fee',
    question: 'What is the entry fee?',
    answer:
      'The working entry fee is $700 per team. Final fee and any paired-team or Legacy Ecowear incentives will be confirmed with the event budget. Fees are due in full by December 1, 2026.',
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
      'Yes. Guardian/waiver workflows and photo consent policies apply. Private roster and contact information for U18 players will not be published on the public site.',
    order: 5,
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
