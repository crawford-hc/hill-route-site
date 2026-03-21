interface Props {
  lines: string[]
}

export function RouteRecommendation({ lines }: Props) {
  if (!lines?.length) return null

  return (
    <section className="recommendation-block" aria-labelledby="rec-heading">
      <h2 id="rec-heading" className="section-title">
        The unofficial verdict
      </h2>
      <ul className="recommendation-list">
        {lines.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </section>
  )
}
