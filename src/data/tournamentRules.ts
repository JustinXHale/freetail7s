/** Shared tournament rules copy — keep in sync with docs/tournament-rules-freetail-2027.md */

export const RULES_PATH = '/teams/rules'

export const TOURNAMENT_CONTACT = {
  name: 'Justin Hale',
  email: 'info@freetail7s.com',
  whatsappLabel: 'tournament WhatsApp',
} as const

export const LEGACY_CONTACT = {
  name: 'Legacy Ecowear',
  email: 'info@legacyecowear.com',
  url: 'https://www.legacyecowear.com',
} as const

export const U18_ELIGIBILITY = {
  bornOnOrAfterDisplay: '1 September 2007',
  waiverBornOnOrAfterDisplay: '1 June 2007',
  maxWaivers: 2,
  summary:
    'Elite U18 players must be born on or after 1 September 2007. Up to two over-age waivers (born no earlier than 1 June 2007) may be approved at the tournament director’s discretion. Eligibility is by age grade only.',
} as const

export const PRIZE_SUMMARY =
  'Division champions receive a free set of 13 kits, plus a refund of that team’s 2027 entry fee or free entry to next year’s Freetail 7s (winner’s choice).'

export const TIEBREAK_SUMMARY =
  'Pool table ties: head-to-head, then point differential, then lowest points against, then most points scored, then coin toss. Pool matches may end in a draw (3 / 1 / 0 points). Knockout matches use sudden death and a conversion shootout — see Tournament rules.'

export const FEE_ROWS = [
  { label: '1 division', fee: 650 },
  { label: '2 divisions (same org / approved affiliate)', fee: 600 },
  { label: '3 divisions', fee: 575 },
  { label: '4 divisions', fee: 550 },
] as const

export const KIT_DISCOUNT = 50

export const KIT_DISCOUNT_SUMMARY =
  `Order a Freetail custom kit package through Legacy Ecowear (title sponsor) and take an additional $${KIT_DISCOUNT} off that team’s entry fee. The credit stacks with multi-division pricing and applies to that team only.`

export const REFUND_SUMMARY =
  'Up to 75% refund through November 20, 2026; then 25 percentage points less each week (75% → 50% → 25% → 0%). Full refund if a suitable replacement team is found. Force majeure at the tournament director’s discretion.'

export const DIVISION_VIABILITY_SUMMARY =
  'Any division may be dropped if there are not enough teams to fill the spots. Affected teams will be notified at least 30 days in advance.'

export const ACCEPTANCE_PAYMENT_SUMMARY =
  'No team is fully accepted until payment has been received in full.'

export type RulesBlock = {
  id: string
  title: string
  paragraphs?: string[]
  bullets?: string[]
}

export type RulesGroup = {
  id: string
  eyebrow: string
  title: string
  /** Short label for in-page jump links */
  navLabel: string
  intro?: string
  /** Stronger visual treatment (used for Elite U18) */
  accent?: boolean
  blocks: RulesBlock[]
}

const BLOCK_CONTACT: RulesBlock = {
  id: 'contact',
  title: 'Tournament contact',
  paragraphs: [
    'Day-of tournament director: Justin Hale, info@freetail7s.com, or the tournament WhatsApp. Team managers are responsible for ensuring players and staff know these rules.',
  ],
}

const BLOCK_STRUCTURE: RulesBlock = {
  id: 'structure',
  title: 'Tournament structure',
  bullets: [
    'Four divisions: Premier Men, Premier Women, Elite U18 Boys, Elite U18 Girls — eight teams each, two pools of four.',
    'Pools are seeded before competition. Knockout and placement brackets follow pool finishing position and are not reseeded.',
    'Each team is guaranteed five matches: three pool games plus a championship or placement semifinal and final (places 1st–8th).',
    'A player may compete in only one division at this event.',
    DIVISION_VIABILITY_SUMMARY,
    ACCEPTANCE_PAYMENT_SUMMARY,
  ],
}

const BLOCK_MATCH_OPS: RulesBlock = {
  id: 'match-ops',
  title: 'Match operations',
  paragraphs: [
    'The match schedule and team staging details will be published closer to the event. Competition is on one pitch, which keeps the staging sequence straightforward.',
  ],
  bullets: [
    'All matches: seven (7) minutes each half with a one (1) minute half-time.',
    'Teams must be in the staging area no later than two (2) minutes after the start of the second half of the preceding match. The coin toss is held at that time.',
    'If only one team is present for the coin toss, that team chooses all options. If neither team is present, the match official decides at their discretion.',
    'A match is forfeited if a team is not on the pitch and ready to start within two (2) minutes of the published kick-off time.',
    'Every team should bring two (2) kits. If colours clash and neither side volunteers to change, a coin toss decides which team changes.',
    'Because play is on a single competition pitch, fields and kick-off times are not moved without prior notice.',
  ],
}

const BLOCK_LAWS: RulesBlock = {
  id: 'laws',
  title: 'Laws of the game',
  paragraphs: [
    'Matches are played under World Rugby Laws of the Game with seven-a-side variations, together with these event rules. Matters not covered here are decided under the disputes process below.',
  ],
  bullets: [
    'Conversions and other place kicks must be taken from the field of play (including from behind the posts when needed for speed of match).',
    'Squad members may enter or leave the field only as the Laws allow. Approaches to match officials outside proper channels may be treated as misconduct.',
  ],
}

const BLOCK_SQUAD: RulesBlock = {
  id: 'squad',
  title: 'Squads, substitutions, and stoppages',
  bullets: [
    'Up to fifteen (15) players may be available for each match from the approved tournament roster.',
    'A team may make up to five (5) substitutions per match (World Rugby Sevens). Blood and head-injury replacements do not count toward the five.',
    'A team must have at least seven players fit to start.',
    'If a player is ruled out for the remainder of the event, no additional player may be added to the tournament roster. The roster stays at the approved fifteen.',
    'For injuries, time is not stopped unless the referee, in consultation with medical staff, determines the injury requires a stoppage for safety. The referee may end a match early for participant safety.',
  ],
}

const BLOCK_POOL_POINTS: RulesBlock = {
  id: 'pool-points',
  title: 'Pool competition points',
  bullets: [
    '3 points for a win',
    '1 point for a draw',
    '0 points for a loss',
    'Pool matches may end level. Sudden death is not used in pool play.',
  ],
}

const BLOCK_POOL_TIEBREAK: RulesBlock = {
  id: 'pool-tiebreak',
  title: 'Pool table tiebreakers',
  paragraphs: [
    'If two or more teams are equal on competition points, ranking is decided in this order:',
  ],
  bullets: [
    'Head-to-head result among the tied teams (when two teams are tied and have played each other)',
    'Point differential (points for minus points against) across all pool matches',
    'Lowest points against across all pool matches',
    'Most points scored across all pool matches',
    'Coin toss between the team managers concerned',
  ],
}

const BLOCK_KNOCKOUT: RulesBlock = {
  id: 'knockout',
  title: 'Knockout and placement matches',
  paragraphs: [
    'Knockout and placement matches cannot end in a draw. If scores are level after full time:',
  ],
  bullets: [
    'Two periods of three (3) minutes of sudden-death play. Replacements are reset for extra time. The first team to score wins.',
    'If still level: a conversion shootout. Kickers may be any player who has taken the field or any unused replacement.',
    'Best of three from the 22-metre line: first from one sideline, then from the middle, then from the opposite sideline.',
    'If still level: move to the 40-metre line, sudden death (if one team makes and the other misses, the maker wins).',
    'If all attempts miss from the 40: return to the 22, still sudden death.',
  ],
}

const BLOCK_FORFEIT: RulesBlock = {
  id: 'forfeit',
  title: 'Forfeit, no-show, and abandonment',
  bullets: [
    'A forfeit or no-show is recorded as 28–0 to the non-offending team.',
    'A team that refuses to play or abandons a match in progress forfeits that match. Further participation is at the tournament director’s discretion.',
    'If the referee abandons a match for non-disciplinary reasons: at half-time or in the second half the score stands; during the first half the result is a draw in pool play, or the score stands in knockout fixtures.',
    'If a result appears manipulated to improve standings, the tournament director may adjust the recorded score at their discretion.',
  ],
}

const BLOCK_DISPUTES: RulesBlock = {
  id: 'disputes',
  title: 'Results, protests, and disputes',
  bullets: [
    'At the end of each match, captains or team managers must confirm the final score with the referee (or designated match official) before leaving the field.',
    'A disputed match result must be raised by the team manager before that team’s next kick-off, or within two (2) hours of match completion, whichever is sooner.',
    'Disputes are heard first by the referee manager. If the referee manager cannot resolve the matter, the tournament director decides. That decision is final.',
    'The tournament director may publish binding amendments or directions for the conduct of the event; once communicated, they apply to all participating teams.',
  ],
}

const BLOCK_DISCIPLINE: RulesBlock = {
  id: 'discipline',
  title: 'Cards and discipline',
  bullets: [
    'Yellow card: two (2) minutes in the sin bin (World Rugby Sevens timing as applied by the referee).',
    'A red card arising from a second yellow in the same match ends that player’s participation for the remainder of that match only. There is no automatic next-match ban unless the tournament director directs otherwise.',
    'Yellow cards do not accumulate across the weekend for automatic hearing or suspension at Freetail 7s.',
    'A straight red card for foul play is reviewed by the tournament director, the referee manager, and one additional party at the tournament director’s discretion before further participation is decided.',
  ],
}

const BLOCK_CHECK_IN: RulesBlock = {
  id: 'check-in',
  title: 'Check-in, accreditation, and technical area',
  bullets: [
    'Teams must check in on site before their first match. Check-in is available the night before competition or the morning of.',
    'Players must present government-issued or school identification that shows a photograph and proof of age (name and date of birth).',
    'Only rostered players plus coaches and medical staff needed for a match or a rules question may be in the technical / match area. All others remain outside that area (bleachers or designated spectator zones).',
  ],
}

const BLOCK_CONDUCT: RulesBlock = {
  id: 'conduct',
  title: 'Conduct',
  bullets: [
    'Players, staff, and supporters are expected to behave in the spirit of the game. Violent or abusive behaviour may result in removal from the venue and future invitation decisions.',
    'Supporters are not allowed on the competition pitch. Unauthorized pitch entry may result in sanctions for the associated team.',
    'Alcohol is not permitted in the match / technical area. Alcohol may be consumed in bleachers and designated eating areas where venue rules allow.',
  ],
}

const BLOCK_MEDICAL: RulesBlock = {
  id: 'medical',
  title: 'Medical and player welfare',
  bullets: [
    'The referee is the sole judge of fact and law and will consider available medical information when deciding whether a player is fit to continue.',
    'When team and tournament medical staff hold equivalent credentials, tournament medical staff have authority on return-to-play and concussion decisions.',
    'When credentials differ (for example a physician versus an athletic trainer), the higher clinical authority governs; a physician’s orders take precedence.',
    'The tournament accepts no liability for injuries sustained during the event beyond what applicable law and the published terms require.',
  ],
}

const BLOCK_PREMIER: RulesBlock = {
  id: 'premier',
  title: 'Premier divisions',
  paragraphs: [
    'Premier Men and Premier Women are adult divisions. Players must be 19 years of age or older.',
  ],
}

const BLOCK_FEES_POINTER: RulesBlock = {
  id: 'fees-pointer',
  title: 'Entry fees, refunds, and prizes',
  paragraphs: [
    'Entry fees, multi-division discounts, withdrawals, refunds, and champion prizes are published on the Apply page, not in this competition handbook.',
  ],
}

export const RULES_U18: RulesBlock[] = [
  {
    id: 'u18-age',
    title: 'Age eligibility',
    bullets: [
      'Players must be born on or after 1 September 2007.',
      'Over-age waivers: a team may request up to two (2) players born no earlier than 1 June 2007, subject to tournament director approval.',
      'Eligibility is by age grade only. High school, college, or club registration status does not by itself bar or qualify a player.',
    ],
  },
  {
    id: 'u18-check-in',
    title: 'Check-in proof of age',
    paragraphs: [
      'At team check-in, each Elite U18 player must present identification that includes a photograph and proof of age (name and date of birth). Acceptable examples include a passport, driver’s license or state ID, school ID with DOB, or a passport/school ID paired with a copy of a birth certificate when one document alone is incomplete.',
    ],
  },
  {
    id: 'u18-safeguarding',
    title: 'Guardians, waivers, and privacy',
    bullets: [
      'Guardian / waiver and photo-consent requirements apply for Elite U18 participants.',
      'Private roster and contact information for U18 players is not published on the public site.',
    ],
  },
]

/** Panel groups for the public Tournament rules page */
export const RULES_GROUPS: RulesGroup[] = [
  {
    id: 'rules-overview',
    eyebrow: 'All divisions',
    title: 'Overview',
    navLabel: 'Overview',
    intro:
      'Event shape, who to contact, Premier age, and where fees and prizes live.',
    blocks: [BLOCK_CONTACT, BLOCK_STRUCTURE, BLOCK_PREMIER, BLOCK_FEES_POINTER],
  },
  {
    id: 'rules-match-day',
    eyebrow: 'On the day',
    title: 'Match day',
    navLabel: 'Match day',
    intro:
      'Staging, kick-off readiness, kits, laws, squads, and stoppages.',
    blocks: [BLOCK_MATCH_OPS, BLOCK_LAWS, BLOCK_SQUAD],
  },
  {
    id: 'rules-competition',
    eyebrow: 'On the field',
    title: 'Competition',
    navLabel: 'Competition',
    intro:
      'Pool points, table tiebreakers, knockout extras, and forfeits.',
    blocks: [
      BLOCK_POOL_POINTS,
      BLOCK_POOL_TIEBREAK,
      BLOCK_KNOCKOUT,
      BLOCK_FORFEIT,
    ],
  },
  {
    id: 'rules-disputes',
    eyebrow: 'Governance',
    title: 'Disputes and discipline',
    navLabel: 'Disputes',
    intro: 'Score confirmation, protests, cards, and how rulings are made.',
    blocks: [BLOCK_DISPUTES, BLOCK_DISCIPLINE],
  },
  {
    id: 'rules-venue',
    eyebrow: 'At the venue',
    title: 'Check-in, conduct, and medical',
    navLabel: 'Check-in',
    intro:
      'Accreditation, technical area, conduct, alcohol, and player welfare.',
    blocks: [BLOCK_CHECK_IN, BLOCK_CONDUCT, BLOCK_MEDICAL],
  },
  {
    id: 'rules-u18',
    eyebrow: 'Age-grade competition',
    title: 'Elite U18 Boys and Girls',
    navLabel: 'Elite U18',
    intro:
      'The following requirements apply only to Elite U18 divisions, in addition to the general rules above.',
    accent: true,
    blocks: RULES_U18,
  },
]

/** Flat list of non-U18 blocks (for docs sync / tooling) */
export const RULES_COMMON: RulesBlock[] = RULES_GROUPS.filter(
  (g) => g.id !== 'rules-u18',
).flatMap((g) => g.blocks)
