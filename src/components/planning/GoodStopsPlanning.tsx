import type { GoodStopsDetail } from '../../types/route'

interface Props {
  detail: GoodStopsDetail
}

export function GoodStopsPlanning({ detail }: Props) {
  const id = 'good-stops-heading'
  return (
    <section className="planning-section" aria-labelledby={id}>
      <h2 id={id} className="planning-section-title">
        Good stop spots
      </h2>
      {detail.intro ? <p className="planning-prose-support planning-stops-intro">{detail.intro}</p> : null}
      <ul className="planning-stops-list">
        {detail.spots.map((s, i) => (
          <li key={i} className="planning-stop-card">
            <h3 className="planning-stop-title">{s.title}</h3>
            <p className="planning-stop-desc">{s.description}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
