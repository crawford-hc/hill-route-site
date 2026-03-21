interface Props {
  spots: string[]
}

export function GoodStopSpots({ spots }: Props) {
  if (!spots?.length) return null

  return (
    <section className="stops-section" aria-labelledby="stops-heading">
      <h2 id="stops-heading" className="section-title">
        Good stop spots
      </h2>
      <ul className="stops-list">
        {spots.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </section>
  )
}
