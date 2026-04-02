import type { TextBlock, WildlifeCard } from '../../types/route'

interface Props {
  terrain?: TextBlock
  wildlifeIntro?: string
  wildlifeCards?: WildlifeCard[]
}

export function TerrainWildlifePlanning({
  terrain,
  wildlifeIntro,
  wildlifeCards,
}: Props) {
  const hasWildlife =
    (wildlifeCards?.length ?? 0) > 0 || Boolean(wildlifeIntro?.trim())

  return (
    <>
      {terrain ? (
        <section className="planning-section" aria-labelledby="terrain-detail-heading">
          <h2 id="terrain-detail-heading" className="planning-section-title">
            {terrain.title ?? 'Terrain & vibe'}
          </h2>
          <p className="planning-prose">{terrain.body}</p>
          {terrain.supporting ? (
            <p className="planning-prose-support">{terrain.supporting}</p>
          ) : null}
        </section>
      ) : null}

      {hasWildlife ? (
        <section className="planning-section" aria-labelledby="wildlife-heading">
          <h2 id="wildlife-heading" className="planning-section-title">
            Wildlife & what’s underfoot
          </h2>
          {wildlifeIntro ? <p className="planning-prose">{wildlifeIntro}</p> : null}
          {wildlifeCards?.length ? (
            <ul className="planning-wildlife-grid">
              {wildlifeCards.map((w, i) => (
                <li key={i} className="planning-wildlife-card">
                  <h3 className="planning-wildlife-title">{w.title}</h3>
                  <p className="planning-wildlife-body">{w.body}</p>
                  <p className="planning-wildlife-why">
                    <strong>Worth knowing:</strong> {w.whyItMatters}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}
    </>
  )
}
