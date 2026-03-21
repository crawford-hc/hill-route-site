interface Props {
  terrainVibe?: string
  wildlifeTexture?: string
}

export function TerrainAndWildlife({ terrainVibe, wildlifeTexture }: Props) {
  if (!terrainVibe && !wildlifeTexture) return null

  return (
    <>
      {terrainVibe ? (
        <section className="vibe-section" aria-labelledby="terrain-heading">
          <h2 id="terrain-heading" className="section-title">
            Terrain &amp; vibe
          </h2>
          <p className="prose">{terrainVibe}</p>
        </section>
      ) : null}
      {wildlifeTexture ? (
        <section className="vibe-section" aria-labelledby="wildlife-heading">
          <h2 id="wildlife-heading" className="section-title">
            Wildlife &amp; hill texture
          </h2>
          <p className="prose">{wildlifeTexture}</p>
        </section>
      ) : null}
    </>
  )
}
