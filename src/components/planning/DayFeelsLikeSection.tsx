import type { DayFeelsLikeContent } from '../../types/route'

interface Props {
  content: DayFeelsLikeContent
}

export function DayFeelsLikeSection({ content }: Props) {
  const id = 'day-feels-heading'
  const title = content.title ?? 'What this day probably feels like'

  return (
    <section className="planning-section planning-section--feels" aria-labelledby={id}>
      <h2 id={id} className="planning-section-title">
        {title}
      </h2>
      <p className="planning-prose">{content.body}</p>
      {content.supporting ? (
        <p className="planning-prose-support">{content.supporting}</p>
      ) : null}
      {content.summaryLines?.length ? (
        <ul className="planning-summary-chips">
          {content.summaryLines.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
