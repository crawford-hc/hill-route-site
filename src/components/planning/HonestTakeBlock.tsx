import type { RecommendationBlock } from '../../types/route'

interface Props {
  block: RecommendationBlock
}

export function HonestTakeBlock({ block }: Props) {
  const id = 'honest-take-heading'
  return (
    <section className="planning-honest-take" aria-labelledby={id}>
      <h2 id={id} className="planning-honest-take-title">
        {block.title}
      </h2>
      <ul className="planning-honest-take-lines">
        {block.lines.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
      {block.supporting ? (
        <p className="planning-honest-take-support">{block.supporting}</p>
      ) : null}
    </section>
  )
}
