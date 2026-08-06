import { Link } from 'react-router-dom'
import { JumpLinks } from '../components/layout/JumpLinks'
import { PagePhotoBand } from '../components/media/PhotoLightbox'
import { PAGE_PHOTOS } from '../data/photos'
import {
  RULES_GROUPS,
  TOURNAMENT_CONTACT,
  type RulesBlock,
  type RulesGroup,
} from '../data/tournamentRules'
import './TournamentRulesPage.css'

const RULES_JUMPS = RULES_GROUPS.map((group) => ({
  id: group.id,
  label: group.navLabel,
}))

function RulesSection({ block }: { block: RulesBlock }) {
  return (
    <section id={block.id} className="jump-target rules-panel__block">
      <h3 className="rules-panel__block-title">{block.title}</h3>
      {block.paragraphs?.map((p) => (
        <p key={p.slice(0, 48)}>{p}</p>
      ))}
      {block.bullets ? (
        <ul>
          {block.bullets.map((item) => (
            <li key={item.slice(0, 64)}>{item}</li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}

function RulesPanel({
  group,
  showDivider,
}: {
  group: RulesGroup
  showDivider: boolean
}) {
  const panelClass = group.accent
    ? 'rules-panel rules-panel--accent'
    : 'rules-panel'

  return (
    <>
      {showDivider ? (
        <div className="rules-panel-divider" aria-hidden="true" />
      ) : null}
      <section className={panelClass} aria-labelledby={group.id}>
        <p className="rules-panel__eyebrow">{group.eyebrow}</p>
        <h2 id={group.id} className="jump-target rules-panel__title">
          {group.title}
        </h2>
        {group.intro ? <p className="rules-panel__intro">{group.intro}</p> : null}
        {group.blocks.map((block) => (
          <RulesSection key={block.id} block={block} />
        ))}
      </section>
    </>
  )
}

export function TournamentRulesPage() {
  return (
    <div className="container section" style={{ maxWidth: 800 }}>
      <PagePhotoBand photo={PAGE_PHOTOS.teams} />
      <h1>Tournament rules</h1>
      <JumpLinks links={RULES_JUMPS} />
      <p>
        Freetail 7s 2027 · January 1–3 · Huns Rugby Ranch, Austin, Texas.
        Day-of contact:{' '}
        <strong>{TOURNAMENT_CONTACT.name}</strong>,{' '}
        <a href={`mailto:${TOURNAMENT_CONTACT.email}`}>
          {TOURNAMENT_CONTACT.email}
        </a>
        , or the {TOURNAMENT_CONTACT.whatsappLabel}.
      </p>
      <p>
        Competition rules are grouped below. Elite U18 age and safeguarding
        requirements are in their own section at the end. Entry fees,
        withdrawals, refunds, and prizes are on the{' '}
        <Link to="/apply">Apply</Link> page. Also see{' '}
        <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy</Link>.
      </p>

      {RULES_GROUPS.map((group, index) => (
        <RulesPanel key={group.id} group={group} showDivider={index > 0} />
      ))}

      <p style={{ marginTop: '2.5rem' }}>
        <Link to="/apply">Apply as a team</Link>
        {' · '}
        <Link to="/faq">FAQ</Link>
        {' · '}
        <Link to="/brackets">Teams &amp; brackets</Link>
      </p>
    </div>
  )
}
