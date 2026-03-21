import { googleMapsDirectionsUrl, getParkerDestination } from '../../lib/parkerDestination'
import type { RouteJson, WaypointJson } from '../../types/route'

interface Props {
  route: RouteJson
  waypoints: WaypointJson[]
}

export function ParkerSection({ route, waypoints }: Props) {
  const dest = getParkerDestination(route, waypoints)
  const note = route.parkingNote?.trim()
  const gridLine =
    dest?.gridRef?.trim() ||
    route.startGridRef?.trim() ||
    (dest ? `${dest.lat.toFixed(5)}, ${dest.lng.toFixed(5)}` : '')

  if (!note && !dest) return null

  const mapsUrl = dest ? googleMapsDirectionsUrl(dest.lat, dest.lng) : null

  return (
    <section className="planning-section planning-parker" aria-labelledby="parker-heading">
      <h2 id="parker-heading" className="planning-section-title">
        The parker &amp; start
      </h2>
      {note ? <p className="planning-prose">{note}</p> : null}
      {gridLine ? (
        <p className="planning-parker-grid">
          <span className="planning-parker-grid-label">Parker:</span>{' '}
          <span className="planning-parker-grid-ref">{gridLine}</span>
        </p>
      ) : null}
      {mapsUrl ? (
        <p className="planning-parker-actions">
          <a
            className="btn btn-secondary planning-parker-maps-btn"
            href={mapsUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Directions to the parker in Google Maps"
          >
            Drive to the parker
          </a>
          <span className="planning-parker-maps-hint">Opens Google Maps</span>
        </p>
      ) : null}
    </section>
  )
}
