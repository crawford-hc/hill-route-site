import type { RouteJson, WaypointJson } from '../types/route'
import { collectGridRefs, gridRefsPlainText, waypointsToCopyText } from '../lib/gridRefs'
import { recommendationFromRoute } from '../lib/recommendationFromRoute'
import { getParkerDestination, googleMapsDirectionsUrl } from '../lib/parkerDestination'

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
  const parkerDest = getParkerDestination(route, waypoints)
  const parkerGrid =
    parkerDest?.gridRef?.trim() ||
    route.startGridRef?.trim() ||
    (parkerDest
      ? `${parkerDest.lat.toFixed(5)}, ${parkerDest.lng.toFixed(5)}`
      : '')
  const parkerMapsUrl = parkerDest ? googleMapsDirectionsUrl(parkerDest.lat, parkerDest.lng) : null

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

  const recBlock = recommendationFromRoute(route)

  return (
    <article className="print-card">
      <header className="print-card-header">
        {route.suggestedRouteBadge ? (
          <p className="print-badge">{route.suggestedRouteBadge}</p>
        ) : null}
        <h1 className="print-card-title">{route.title}</h1>
        {(route.area || route.country) && (
          <p className="print-card-meta">
            {[route.area, route.country].filter(Boolean).join(' · ')}
          </p>
        )}
        <p className="print-card-summary">{route.summary}</p>
      </header>

      {route.weatherNote ? (
        <section className="print-block">
          <h2 className="print-block-title">{route.weatherNote.title ?? 'Weather'}</h2>
          <p className="print-prose">{route.weatherNote.body}</p>
          {route.weatherNote.supporting ? (
            <p className="print-prose">{route.weatherNote.supporting}</p>
          ) : null}
          {route.weatherNote.disclaimerLabel ? (
            <p className="print-small">{route.weatherNote.disclaimerLabel}</p>
          ) : null}
        </section>
      ) : null}

      {route.qualityMeter ? (
        <section className="print-block print-qhm">
          <h2 className="print-block-title">Quality Hill Day Meter</h2>
          <p className="print-prose print-qhm-scoreline">
            <strong>{route.qualityMeter.score}%</strong> — {route.qualityMeter.headline}
          </p>
          <p className="print-prose">{route.qualityMeter.verdict}</p>
          <p className="print-small">
            Scale: {route.qualityMeter.lowLabel} → {route.qualityMeter.highLabel}
          </p>
          {route.qualityMeter.factors.length > 0 ? (
            <>
              <h3 className="print-subhead">Factors</h3>
              <ul className="print-ul">
                {route.qualityMeter.factors.map((f, i) => (
                  <li key={i}>
                    <strong>{f.label}</strong> ({f.impact}): {f.note}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          {route.qualityMeter.subscores?.length ? (
            <>
              <h3 className="print-subhead">Sub-scores</h3>
              <ul className="print-ul">
                {route.qualityMeter.subscores.map((s, i) => (
                  <li key={i}>
                    <strong>{s.label}:</strong> {s.score}% — {s.note}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      ) : null}

      {route.disclaimerSection ? (
        <section className="print-block print-disclaimer">
          <h2 className="print-block-title">{route.disclaimerSection.title ?? 'Heads-up'}</h2>
          <p className="print-prose">{route.disclaimerSection.body}</p>
        </section>
      ) : null}

      {route.whyThisRoute ? (
        <section className="print-block">
          <h2 className="print-block-title">{route.whyThisRoute.title ?? 'Why this walk?'}</h2>
          <p className="print-prose">{route.whyThisRoute.body}</p>
          {route.whyThisRoute.callouts?.length ? (
            <ul className="print-ul">
              {route.whyThisRoute.callouts.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          ) : null}
          {route.whyThisRoute.supporting ? (
            <p className="print-prose">{route.whyThisRoute.supporting}</p>
          ) : null}
        </section>
      ) : null}

      {recBlock ? (
        <section className="print-block">
          <h2 className="print-block-title">{recBlock.title}</h2>
          <ul className="print-ul">
            {recBlock.lines.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
          {recBlock.supporting ? <p className="print-prose">{recBlock.supporting}</p> : null}
        </section>
      ) : null}

      {(route.routeOptions?.length ?? 0) > 0 ? (
        <section className="print-block">
          <h2 className="print-block-title">Map</h2>
          <p className="print-prose">
            On the site, green solid = hand-drawn suggestion, not a surveyed line. Purple dashed GPX,
            if there is one, is only for comparing — not the main route.
          </p>
        </section>
      ) : null}

      {(route.routeOptions ?? []).map((opt) => (
        <section key={opt.id} className="print-block">
          <h2 className="print-block-title">{opt.name}</h2>
          {opt.tag ? <p className="print-tag">{opt.tag}</p> : null}
          {opt.reason ? <p className="print-prose">{opt.reason}</p> : null}
          {opt.lineDescription ? (
            <>
              <h3 className="print-subhead">Suggested line</h3>
              <p className="print-prose">{opt.lineDescription}</p>
            </>
          ) : opt.suggestedLine?.length ? (
            <>
              <h3 className="print-subhead">Suggested line</h3>
              <ol className="print-ol">
                {opt.suggestedLine.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </>
          ) : null}
          {opt.whyPick ? (
            <>
              <h3 className="print-subhead">Why pick this one</h3>
              <p className="print-prose">{opt.whyPick}</p>
            </>
          ) : null}
          {opt.tradeoff ? (
            <>
              <h3 className="print-subhead">Tradeoff</h3>
              <p className="print-prose">{opt.tradeoff}</p>
            </>
          ) : null}
          {opt.explanation && !opt.whyPick ? (
            <p className="print-prose">{opt.explanation}</p>
          ) : null}
          {opt.waypointFile && (optionWaypoints[opt.id]?.length ?? 0) > 0 ? (
            <>
              <h3 className="print-subhead">Waypoints ({opt.waypointFile})</h3>
              <pre className="print-pre">{waypointsToCopyText(optionWaypoints[opt.id] ?? [])}</pre>
            </>
          ) : null}
        </section>
      ))}

      {route.parkingNote?.trim() || parkerDest ? (
        <section className="print-block">
          <h2 className="print-block-title">Parker &amp; start</h2>
          {route.parkingNote?.trim() ? (
            <p className="print-prose">{route.parkingNote}</p>
          ) : null}
          {parkerGrid ? (
            <p className="print-prose print-parker-grid">
              <strong>Parker:</strong> {parkerGrid}
            </p>
          ) : null}
          {parkerMapsUrl ? (
            <p className="print-prose print-small">
              Maps link to the parker: {parkerMapsUrl}
            </p>
          ) : null}
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
          {route.startGridRef ? <li>Parker: {route.startGridRef}</li> : null}
          {route.finishGridRef ? <li>Finish: {route.finishGridRef}</li> : null}
        </ul>
      </section>

      {(route.anchorRefs ?? []).length > 0 ? (
        <section className="print-block">
          <h2 className="print-block-title">{route.anchorRefsTitle ?? 'Anchor refs'}</h2>
          {route.anchorRefsIntro ? <p className="print-prose">{route.anchorRefsIntro}</p> : null}
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
          <h2 className="print-block-title">Grid refs (full list)</h2>
          <pre className="print-pre">{gridText}</pre>
        </section>
      ) : null}

      {route.goodStopsDetail?.spots.length ? (
        <section className="print-block">
          <h2 className="print-block-title">Good stop spots</h2>
          {route.goodStopsDetail.intro ? (
            <p className="print-prose">{route.goodStopsDetail.intro}</p>
          ) : null}
          <ul className="print-ul">
            {route.goodStopsDetail.spots.map((s, i) => (
              <li key={i}>
                <strong>{s.title}:</strong> {s.description}
              </li>
            ))}
          </ul>
        </section>
      ) : (route.goodStopSpots ?? []).length > 0 ? (
        <section className="print-block">
          <h2 className="print-block-title">Good stop spots</h2>
          <ul className="print-ul">
            {(route.goodStopSpots ?? []).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {route.whatDayFeelsLike ? (
        <section className="print-block">
          <h2 className="print-block-title">
            {route.whatDayFeelsLike.title ?? 'What the day’s like'}
          </h2>
          <p className="print-prose">{route.whatDayFeelsLike.body}</p>
          {route.whatDayFeelsLike.supporting ? (
            <p className="print-prose">{route.whatDayFeelsLike.supporting}</p>
          ) : null}
          {route.whatDayFeelsLike.summaryLines?.length ? (
            <ul className="print-ul">
              {route.whatDayFeelsLike.summaryLines.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {route.terrainDetail ? (
        <section className="print-block">
          <h2 className="print-block-title">{route.terrainDetail.title ?? 'Terrain & vibe'}</h2>
          <p className="print-prose">{route.terrainDetail.body}</p>
          {route.terrainDetail.supporting ? (
            <p className="print-prose">{route.terrainDetail.supporting}</p>
          ) : null}
        </section>
      ) : route.terrainVibe ? (
        <section className="print-block">
          <h2 className="print-block-title">Terrain &amp; vibe</h2>
          <p className="print-prose">{route.terrainVibe}</p>
        </section>
      ) : null}

      {route.wildlifeIntro || (route.wildlifeCards?.length ?? 0) > 0 ? (
        <section className="print-block">
          <h2 className="print-block-title">Wildlife &amp; what’s underfoot</h2>
          {route.wildlifeIntro ? <p className="print-prose">{route.wildlifeIntro}</p> : null}
          <ul className="print-ul">
            {(route.wildlifeCards ?? []).map((w, i) => (
              <li key={i}>
                <strong>{w.title}:</strong> {w.body} <em>Worth knowing:</em> {w.whyItMatters}
              </li>
            ))}
          </ul>
        </section>
      ) : route.wildlifeTexture ? (
        <section className="print-block">
          <h2 className="print-block-title">Wildlife &amp; what’s underfoot</h2>
          <p className="print-prose">{route.wildlifeTexture}</p>
        </section>
      ) : null}

      {(route.lookoutGallery ?? []).length > 0 ? (
        <section className="print-block">
          <h2 className="print-block-title">What to look out for</h2>
          {route.lookoutGalleryIntro ? (
            <p className="print-prose">{route.lookoutGalleryIntro}</p>
          ) : null}
          <ul className="print-ul">
            {(route.lookoutGallery ?? []).map((item) => {
              const cap = [
                item.description,
                item.whyToday,
                item.interestingBit,
                item.caption,
              ]
                .map((s) => s?.trim())
                .filter(Boolean)
                .join(' ')
              const credit = [item.attributionText, item.licenseName, item.sourceName]
                .map((s) => s?.trim())
                .filter(Boolean)
                .join('; ')
              return (
                <li key={item.id}>
                  <strong>{item.title}:</strong> {cap || '—'}{' '}
                  {credit ? (
                    <span className="print-small">({credit})</span>
                  ) : null}
                </li>
              )
            })}
          </ul>
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
          <h2 className="print-block-title">Nav calls</h2>
          <ul className="print-ul">
            {decisionLines.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <footer className="print-footer">
        <p>
          {route.planningFooterNote ??
            'Printed from Hill routes — suggested line only. Check the day before you go.'}
        </p>
      </footer>
    </article>
  )
}
