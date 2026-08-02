/** Curated tournament photography from img/ft7sPhotos (served via /photos). */

export interface TournamentPhoto {
  src: string
  alt: string
  credit?: string
  caption?: string
}

export const PHOTO_CREDIT_NORMA = 'Norma Salinas Photography'

/** Full-bleed homepage hero — Freetail flag + field entry energy */
export const HERO_PHOTO: TournamentPhoto = {
  src: '/photos/489268276_1208845871246089_2869204373635315433_n.jpg',
  alt: 'Players running onto the field at Freetail 7s past the tournament bat flag',
  credit: PHOTO_CREDIT_NORMA,
}

/** Homepage action gallery */
export const FEATURED_PHOTOS: TournamentPhoto[] = [
  {
    src: '/photos/488648778_1208845764579433_4419175448678451064_n.jpg',
    alt: 'Women’s player scoring a try during Freetail 7s',
    credit: PHOTO_CREDIT_NORMA,
  },
  {
    src: '/photos/467396799_18127235788391138_9204777379564867695_n.jpg',
    alt: 'Men’s player sprinting with the ball at Freetail 7s',
    credit: PHOTO_CREDIT_NORMA,
  },
  {
    src: '/photos/489019951_1208846121246064_3179242563709892986_n.jpg',
    alt: 'Women’s tackle during Freetail 7s pool play',
    credit: PHOTO_CREDIT_NORMA,
  },
  {
    src: '/photos/489365990_1208846107912732_3679975565729411172_n.jpg',
    alt: 'Ball carrier in open space at Freetail 7s',
    credit: PHOTO_CREDIT_NORMA,
  },
  {
    src: '/photos/489530481_1208846097912733_6053907881492256070_n.jpg',
    alt: 'Player running with the ball in a colorful jersey at Freetail 7s',
    credit: PHOTO_CREDIT_NORMA,
  },
  {
    src: '/photos/467518221_18127235824391138_2026097558553491622_n.jpg',
    alt: 'Women’s player holding the ball through contact at Freetail 7s',
    credit: PHOTO_CREDIT_NORMA,
  },
  {
    src: '/photos/489701389_1208846037912739_7020813150948104689_n.jpg',
    alt: 'Match officials in Freetail 7s referee kits on the field',
    credit: PHOTO_CREDIT_NORMA,
  },
  {
    src: '/photos/489698632_1208845977912745_8575128639425636000_n.jpg',
    alt: 'Smiling tournament player in a patchwork jersey at Freetail 7s',
    credit: PHOTO_CREDIT_NORMA,
  },
  {
    src: '/photos/488883296_1208845801246096_7845063230372228482_n.jpg',
    alt: 'Tackle and support play at Freetail 7s',
    credit: PHOTO_CREDIT_NORMA,
  },
]

/** Extra action frames for page bands (not all on the homepage grid) */
export const ARCHIVE_ACTION_PHOTOS: TournamentPhoto[] = [
  {
    src: '/photos/489228635_1208845797912763_8834687067459522539_n.jpg',
    alt: 'Open-field run during Freetail 7s',
    credit: PHOTO_CREDIT_NORMA,
  },
  {
    src: '/photos/489144896_1208845761246100_3103292538372912420_n.jpg',
    alt: 'Sideline energy at Freetail 7s',
    credit: PHOTO_CREDIT_NORMA,
  },
  {
    src: '/photos/488801075_1208845881246088_3093785849656818634_n.jpg',
    alt: 'Ball in hand during Freetail 7s match play',
    credit: PHOTO_CREDIT_NORMA,
  },
  {
    src: '/photos/489329998_1208846087912734_6211200553998376426_n.jpg',
    alt: 'Defensive pressure at Freetail 7s',
    credit: PHOTO_CREDIT_NORMA,
  },
  {
    src: '/photos/488792758_1208846041246072_2814175003813484155_n.jpg',
    alt: 'Celebration moment at Freetail 7s',
    credit: PHOTO_CREDIT_NORMA,
  },
  {
    src: '/photos/489910978_1208845937912749_5207703399172805132_n.jpg',
    alt: 'Tournament atmosphere at Freetail 7s',
    credit: PHOTO_CREDIT_NORMA,
  },
  {
    src: '/photos/488980908_1208845927912750_8547071330784888203_n.jpg',
    alt: 'Players contesting the ball at Freetail 7s',
    credit: PHOTO_CREDIT_NORMA,
  },
]

export const RANCH_PHOTOS: TournamentPhoto[] = [
  {
    src: '/photos/ranch/farfieldimage.jpg',
    alt: 'Huns Rugby Ranch fields and grounds',
  },
  {
    src: '/photos/ranch/sunset.jpg',
    alt: 'Sunset over Huns Rugby Ranch',
  },
  {
    src: '/photos/ranch/tent.jpg',
    alt: 'Covered social area at Huns Rugby Ranch',
  },
  {
    src: '/photos/ranch/parking.jpg',
    alt: 'Parking at Huns Rugby Ranch',
  },
  {
    src: '/photos/ranch/backpostpic.webp',
    alt: 'Goal posts and pitch at Huns Rugby Ranch',
  },
]

export const WINNERS_2022: TournamentPhoto[] = [
  {
    src: '/photos/2022winner/navChampions.jpg',
    alt: '2022 Freetail 7s men’s champions — National Athletic Village',
    caption: 'Men’s champions — NAV',
  },
  {
    src: '/photos/2022winner/menRunnerUp.jpg',
    alt: '2022 Freetail 7s men’s runner-up',
    caption: 'Men’s runner-up',
  },
  {
    src: '/photos/2022winner/roots3rd.jpg',
    alt: '2022 Freetail 7s men’s third place — Roots',
    caption: 'Men’s 3rd — Roots',
  },
  {
    src: '/photos/2022winner/menPlate.jpg',
    alt: '2022 Freetail 7s men’s plate winners',
    caption: 'Men’s plate',
  },
  {
    src: '/photos/2022winner/menArmyBowl.jpg',
    alt: '2022 Freetail 7s men’s bowl winners — Army',
    caption: 'Men’s bowl — Army',
  },
  {
    src: '/photos/2022winner/womenChamps.jpg',
    alt: '2022 Freetail 7s women’s champions',
    caption: 'Women’s champions',
  },
  {
    src: '/photos/2022winner/women3rd.jpg',
    alt: '2022 Freetail 7s women’s third place',
    caption: 'Women’s 3rd',
  },
  {
    src: '/photos/2022winner/womenPLate.jpg',
    alt: '2022 Freetail 7s women’s plate winners',
    caption: 'Women’s plate',
  },
]

export const WINNERS_2023: TournamentPhoto[] = [
  {
    src: '/photos/2023winners/menAndwomen.jpg',
    alt: '2023 Freetail 7s men’s and women’s champions celebrating together',
    caption: 'Champions — men & women',
  },
  {
    src: '/photos/2023winners/menNAV.jpg',
    alt: '2023 Freetail 7s men’s champions — National Athletic Village',
    caption: 'Men’s champions — NAV',
  },
  {
    src: '/photos/2023winners/runnerUpFaith.jpg',
    alt: '2023 Freetail 7s men’s runner-up — Faith',
    caption: 'Men’s runner-up — Faith',
  },
  {
    src: '/photos/2023winners/men3rdplace.jpg',
    alt: '2023 Freetail 7s men’s third place',
    caption: 'Men’s 3rd',
  },
  {
    src: '/photos/2023winners/plate.jpg',
    alt: '2023 Freetail 7s plate winners',
    caption: 'Plate',
  },
  {
    src: '/photos/2023winners/rootsPlate.jpg',
    alt: '2023 Freetail 7s roots plate winners',
    caption: 'Roots plate',
  },
  {
    src: '/photos/2023winners/Bowl.jpg',
    alt: '2023 Freetail 7s bowl winners',
    caption: 'Bowl',
  },
  {
    src: '/photos/2023winners/womenHEB.jpg',
    alt: '2023 Freetail 7s women’s champions — HEB',
    caption: 'Women’s champions — HEB',
  },
  {
    src: '/photos/2023winners/womenRunnerUpNorthshore.jpg',
    alt: '2023 Freetail 7s women’s runner-up — Northshore',
    caption: 'Women’s runner-up — Northshore',
  },
]

export const REFEREE_PHOTOS: TournamentPhoto[] = [
  {
    src: '/photos/referees/joe.jpg',
    alt: 'Freetail 7s match official Joe on the field',
    caption: 'Match official',
  },
]

/** Apply landing track images */
export const APPLY_TRACK_PHOTOS = {
  team: WINNERS_2023[0],
  referee: REFEREE_PHOTOS[0],
} as const

/** Single page-hero banners — one image per route for mobile-first layouts */
export const PAGE_PHOTOS = {
  about: WINNERS_2023[0],
  apply: ARCHIVE_ACTION_PHOTOS[0],
  teams: ARCHIVE_ACTION_PHOTOS[2],
  schedule: ARCHIVE_ACTION_PHOTOS[1],
  today: ARCHIVE_ACTION_PHOTOS[4],
  pools: ARCHIVE_ACTION_PHOTOS[5],
  results: WINNERS_2023[1],
  brackets: WINNERS_2022[5],
  tickets: ARCHIVE_ACTION_PHOTOS[6],
  sponsors: FEATURED_PHOTOS[6],
  faq: ARCHIVE_ACTION_PHOTOS[3],
  contact: FEATURED_PHOTOS[3],
  updates: ARCHIVE_ACTION_PHOTOS[6],
  login: ARCHIVE_ACTION_PHOTOS[0],
  teamPortal: FEATURED_PHOTOS[7],
  privacy: ARCHIVE_ACTION_PHOTOS[5],
  terms: FEATURED_PHOTOS[6],
} as const satisfies Record<string, TournamentPhoto>

export const FACEBOOK_PHOTOS_URL = 'https://www.facebook.com/freetail7s/photos'
