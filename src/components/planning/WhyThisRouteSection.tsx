import type { WhyThisRouteContent } from '../../types/route'

interface Props {
  content: WhyThisRouteContent
}

export function WhyThisRouteSection({ content }: Props) {
  const id = 'why-this-route-heading'
  const title = content.title ?? 'Why this walk?'

  return (
    <section className="planning-section planning-section--why" aria-labelledby={id}>
      <h2 id={id} className="planning-section-title">
        {title}
      </h2>
      <p className="planning-prose">{content.body}</p>
      {content.callouts?.length ? (
        <ul className="planning-callouts">
          {content.callouts.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      ) : null}
      {content.supporting
        ? content.supporting
            .split(/\n\n+/)
            .map((p) => p.trim())
            .filter(Boolean)
            .map((p, i) => (
              <p key={i} className="planning-prose-support">
                {p}
              </p>
            ))
        : null}
    </section>
  )
}
