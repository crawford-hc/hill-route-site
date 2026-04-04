import { googleMapsDirectionsUrl, getParkerDestination } from '../../lib/parkerDestination'
import type { RouteJson, WaypointJson } from '../../types/route'

interface Props {
  route: RouteJson
  waypoints: WaypointJson[]
}

export function ParkerSection({ route, waypoints }: Props) {
  const dest = getParkerDestination(route, waypoints)
  const note = route.parkingNote?.trim()
  const isMayarDriesh = route.slug === 'mayar-driesh'
  const isMountKeen = route.slug === 'mount-keen'
  const isLochLeeLoop = route.slug === 'loch-lee-loop'
  const gridLine =
    route.startName?.trim() ||
    dest?.gridRef?.trim() ||
    route.startGridRef?.trim() ||
    (dest ? `${dest.lat.toFixed(5)}, ${dest.lng.toFixed(5)}` : '')

  if (!note && !dest && !isMayarDriesh) return null

  const mapsUrl = dest ? googleMapsDirectionsUrl(dest.lat, dest.lng) : null
  const aerialSrc = dest
    ? `https://www.google.com/maps?q=${dest.lat},${dest.lng}&t=k&z=15&output=embed`
    : null

  return (
    <section className="planning-section planning-parker" aria-labelledby="parker-heading">
      <h2 id="parker-heading" className="planning-section-title">
        {isMayarDriesh || isMountKeen || isLochLeeLoop ? 'The parker' : 'Parker & start'}
      </h2>
      {note
        ? note
            .split(/\n\n+/)
            .map((para) => para.trim())
            .filter(Boolean)
            .map((para, i) => (
              <p key={i} className="planning-prose">
                {para}
              </p>
            ))
        : null}
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
            aria-label="Google Maps directions to the parker"
          >
            Drive to the parker
          </a>
          <span className="planning-parker-maps-hint">Opens in Google Maps</span>
        </p>
      ) : null}
      {aerialSrc ? (
        <iframe
          title="Aerial snapshot of the parker and nearby area"
          src={aerialSrc}
          loading="lazy"
          style={{ width: '100%', minHeight: '260px', border: '0' }}
        />
      ) : null}
    </section>
  )
}
