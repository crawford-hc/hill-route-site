import type { RouteJson, WaypointJson } from '../types/route'
import { collectGridRefs, gridRefsPlainText, waypointsToCopyText } from '../lib/gridRefs'

interface Props {
  route: RouteJson
  waypoints: WaypointJson[]
  optionWaypoints: Record<string, WaypointJson[]>
}

function sortWaypoints(rows: WaypointJson[]) {
  return [...rows].sort((a, b) => {
    const ao = a.order ?? Number.MAX_SAFE_INTEGER
    const bo = b.order ?? Number.MAX_SAFE_INTEGER
    if (ao !== bo) return ao - bo
    return a.name.localeCompare(b.name)
  })
}

export function PrintRouteCard({ route, waypoints, optionWaypoints }: Props) {
  const gridLines = collectGridRefs(route, waypoints)
  const gridText = gridRefsPlainText(gridLines)

  const wpRows = sortWaypoints(waypoints)

  const noteLines = route.notes ?? []
  const landmarkLines = (route.landmarks ?? []).map(
    (l) => `${l.title}: ${l.description}`,
  )
  const decisionLines = (route.decisionPoints ?? []).map(
    (l) => `${l.title}: ${l.description}`,
  )

  const showLegacyTops =
    (route.orderedTops?.length ?? 0) > 0 && !(route.routeOptions?.length ?? 0)

  return (
    <article className="print-card">
      <header className="print-card-header">
        <h1 className="print-card-title">{route.title}</h1>
        {(route.area || route.country) && (
          <p className="print-card-meta">
            {[route.area, route.country].filter(Boolean).join(' · ')}
          </p>
        )}
        <p className="print-card-summary">{route.summary}</p>
      </header>

      {route.disclaimer ? (
        <section className="print-block print-disclaimer">
          <h2 className="print-block-title">Disclaimer</h2>
          <p className="print-prose">{route.disclaimer}</p>
        </section>
      ) : null}

      {(route.routeOptions?.length ?? 0) > 0 ? (
        <section className="print-block">
          <h2 className="print-block-title">Map</h2>
          <p className="print-prose">
            On the website, the green line is a hand-drawn suggested trace only (not surveyed). If
            you add a GPX file later, it can appear as an optional dashed overlay for comparison —
            it is not the primary route source.
          </p>
        </section>
      ) : null}

      {(route.routeOptions ?? []).map((opt) => (
        <section key={opt.id} className="print-block">
          <h2 className="print-block-title">{opt.name}</h2>
          <p className="print-prose">
            <strong>Why:</strong> {opt.reason}
          </p>
          <h3 className="print-subhead">Suggested line</h3>
          <ol className="print-ol">
            {opt.suggestedLine.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          <p className="print-prose">{opt.explanation}</p>
          {opt.waypointFile && (optionWaypoints[opt.id]?.length ?? 0) > 0 ? (
            <>
              <h3 className="print-subhead">Waypoints ({opt.waypointFile})</h3>
              <pre className="print-pre">{waypointsToCopyText(optionWaypoints[opt.id] ?? [])}</pre>
            </>
          ) : null}
        </section>
      ))}

      {(route.recommendation ?? []).length > 0 ? (
        <section className="print-block">
          <h2 className="print-block-title">Verdict</h2>
          <ul className="print-ul">
            {(route.recommendation ?? []).map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {(route.anchorRefs ?? []).length > 0 ? (
        <section className="print-block">
          <h2 className="print-block-title">Anchor refs</h2>
          <table className="print-table">
            <thead>
              <tr>
                <th>What</th>
                <th>Grid</th>
              </tr>
            </thead>
            <tbody>
              {(route.anchorRefs ?? []).map((a, i) => (
                <tr key={i}>
                  <td>{a.label}</td>
                  <td>{a.gridRef}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      <section className="print-block">
        <h2 className="print-block-title">Stats</h2>
        <ul className="print-stats">
          {route.distanceKm != null ? <li>Distance: {route.distanceKm} km</li> : null}
          {route.ascentM != null ? <li>Ascent: {route.ascentM} m</li> : null}
          {route.estimatedHours != null ? (
            <li>Time (estimate): ~{route.estimatedHours} h</li>
          ) : null}
          {route.startGridRef ? <li>Start: {route.startGridRef}</li> : null}
          {route.finishGridRef ? <li>Finish: {route.finishGridRef}</li> : null}
          {route.parkingNote ? <li>Parking: {route.parkingNote}</li> : null}
        </ul>
      </section>

      {showLegacyTops ? (
        <section className="print-block">
          <h2 className="print-block-title">Tops</h2>
          <ol className="print-ol">
            {(route.orderedTops ?? []).map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ol>
        </section>
      ) : null}

      {wpRows.length > 0 ? (
        <section className="print-block">
          <h2 className="print-block-title">Map waypoints</h2>
          <table className="print-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Description</th>
                <th>Grid</th>
                <th>m</th>
              </tr>
            </thead>
            <tbody>
              {wpRows.map((w) => (
                <tr key={w.id}>
                  <td>{w.name}</td>
                  <td>{w.type}</td>
                  <td>{w.description ?? ''}</td>
                  <td>{w.gridRef ?? ''}</td>
                  <td>{w.elevationM ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {gridText ? (
        <section className="print-block">
          <h2 className="print-block-title">Grid refs (copy block)</h2>
          <pre className="print-pre">{gridText}</pre>
        </section>
      ) : null}

      {(route.goodStopSpots ?? []).length > 0 ? (
        <section className="print-block">
          <h2 className="print-block-title">Good stop spots</h2>
          <ul className="print-ul">
            {(route.goodStopSpots ?? []).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {route.terrainVibe ? (
        <section className="print-block">
          <h2 className="print-block-title">Terrain &amp; vibe</h2>
          <p className="print-prose">{route.terrainVibe}</p>
        </section>
      ) : null}

      {route.wildlifeTexture ? (
        <section className="print-block">
          <h2 className="print-block-title">Wildlife &amp; hill texture</h2>
          <p className="print-prose">{route.wildlifeTexture}</p>
        </section>
      ) : null}

      {noteLines.length > 0 ? (
        <section className="print-block">
          <h2 className="print-block-title">Notes</h2>
          <ul className="print-ul">
            {noteLines.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {landmarkLines.length > 0 ? (
        <section className="print-block">
          <h2 className="print-block-title">Landmarks</h2>
          <ul className="print-ul">
            {landmarkLines.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {decisionLines.length > 0 ? (
        <section className="print-block">
          <h2 className="print-block-title">Navigation</h2>
          <ul className="print-ul">
            {decisionLines.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <footer className="print-footer">
        <p>Printed from Hill routes — suggested route only; check conditions on the day.</p>
      </footer>
    </article>
  )
}
