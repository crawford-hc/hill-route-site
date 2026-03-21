interface Props {
  tops: string[]
}

export function OrderedTops({ tops }: Props) {
  if (!tops?.length) return null

  return (
    <section className="tops-section" aria-labelledby="tops-heading">
      <h2 id="tops-heading" className="section-title">
        Tops (in order)
      </h2>
      <ol className="tops-list">
        {tops.map((name, i) => (
          <li key={`${i}-${name}`}>{name}</li>
        ))}
      </ol>
    </section>
  )
}
