import type { LatLngBounds } from 'leaflet'

/**
 * Leaflet reports single-point bounds as isValid(); those should not beat
 * `route.bounds` or a later GPX refit.
 */
export function latLngBoundsHasUsefulSpan(
  bb: LatLngBounds | null | undefined,
  minDeg = 0.00045,
): bb is LatLngBounds {
  if (!bb?.isValid()) return false
  const sw = bb.getSouthWest()
  const ne = bb.getNorthEast()
  return (
    Math.abs(ne.lat - sw.lat) >= minDeg || Math.abs(ne.lng - sw.lng) >= minDeg
  )
}
