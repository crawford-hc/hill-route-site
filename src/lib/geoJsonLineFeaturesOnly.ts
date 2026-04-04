import type { FeatureCollection } from 'geojson'
import type { WaypointJson } from '../types/route'

/** Drop Point/MultiPoint etc. so GPX `<wpt>` features do not render as map pins. */
export function featureCollectionLineFeaturesOnly(
  fc: FeatureCollection,
): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: fc.features.filter((f) => {
      const t = f.geometry?.type
      return t === 'LineString' || t === 'MultiLineString'
    }),
  }
}

/** First/last waypoint by `order`; single pin when start and finish coincide. */
export function terminalWaypointsForMap(waypoints: WaypointJson[]): WaypointJson[] {
  if (waypoints.length === 0) return []
  const sorted = [...waypoints].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const first = sorted[0]!
  const last = sorted[sorted.length - 1]!
  const sameSpot =
    Math.abs(first.lat - last.lat) < 1e-5 && Math.abs(first.lng - last.lng) < 1e-5
  return sameSpot ? [first] : [first, last]
}
