import type { RouteJson, WaypointJson } from '../types/route'

export interface ParkerDestination {
  lat: number
  lng: number
  /** OS grid for display, when known */
  gridRef?: string
}

/**
 * Best WGS84 point for “the parker” — parking waypoint, start anchor, first polyline point, or map centre.
 */
export function getParkerDestination(
  route: RouteJson,
  waypoints: WaypointJson[],
): ParkerDestination | null {
  const parkingWp = waypoints.find((w) => w.type === 'parking' && w.lat != null && w.lng != null)
  if (parkingWp && parkingWp.lat != null && parkingWp.lng != null) {
    return {
      lat: parkingWp.lat,
      lng: parkingWp.lng,
      gridRef: parkingWp.gridRef?.trim() || undefined,
    }
  }

  const startAnchor = route.anchorRefs?.find(
    (a) => /parker|parking|start/i.test(a.label) && a.lat != null && a.lng != null,
  )
  if (startAnchor && startAnchor.lat != null && startAnchor.lng != null) {
    return {
      lat: startAnchor.lat,
      lng: startAnchor.lng,
      gridRef: startAnchor.gridRef?.trim() || undefined,
    }
  }

  const poly0 = route.routeOptions?.[0]?.suggestedPolyline?.[0]
  if (poly0) {
    return {
      lat: poly0.lat,
      lng: poly0.lng,
      gridRef: route.startGridRef?.trim() || undefined,
    }
  }

  if (route.mapCenter) {
    return {
      lat: route.mapCenter.lat,
      lng: route.mapCenter.lng,
      gridRef: route.startGridRef?.trim() || undefined,
    }
  }

  return null
}

export function googleMapsDirectionsUrl(lat: number, lng: number): string {
  const params = new URLSearchParams({
    api: '1',
    destination: `${lat},${lng}`,
  })
  return `https://www.google.com/maps/dir/?${params.toString()}`
}
