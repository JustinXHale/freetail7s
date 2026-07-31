/** Shared date copy for public pages — human-readable, not ISO. */

export const EVENT_DATES = {
  friday: 'Friday, January 1, 2027',
  saturday: 'Saturday, January 2, 2027',
  sunday: 'Sunday, January 3, 2027',
  rangeShort: 'January 1–3, 2027',
  applicationDeadline: 'October 1, 2026',
  paymentDeadline: 'December 1, 2026',
} as const

export const PLACEHOLDER_POOLS = [
  {
    name: 'Pool A',
    teams: ['Team A', 'Team B', 'Team C', 'Team D'],
  },
  {
    name: 'Pool B',
    teams: ['Team E', 'Team F', 'Team G', 'Team H'],
  },
] as const
