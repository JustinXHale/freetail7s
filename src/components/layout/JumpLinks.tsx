type JumpLink = {
  id: string
  label: string
}

type JumpLinksProps = {
  links: JumpLink[]
  label?: string
}

export function JumpLinks({
  links,
  label = 'On this page',
}: JumpLinksProps) {
  if (links.length < 2) return null

  return (
    <nav className="jump-links" aria-label={label}>
      <div className="jump-links__inner">
        <span className="jump-links__label">{label}</span>
        <ul className="jump-links__list">
          {links.map((link) => (
            <li key={link.id}>
              <a href={`#${link.id}`}>{link.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
