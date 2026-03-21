export interface MapCenter {
  lat: number
  lng: number
}

export interface LatLng {
  lat: number
  lng: number
}

/** Optional map bounds in WGS84 (south, west, north, east). */
export interface RouteBounds {
  south: number
  west: number
  north: number
  east: number
}

export interface Landmark {
  title: string
  description: string
}

/** Key grid anchors; include lat/lng to show on the map. */
export interface AnchorRef {
  label: string
  gridRef: string
  lat?: number
  lng?: number
}

/** A suggested line variant on the same hill day (not a separate slug). */
export interface RouteOption {
  id: string
  name: string
  /** Short “why this exists” */
  reason: string
  /** Human-readable steps (may include inline grid refs) */
  suggestedLine: string[]
  /** Extra colour / nuance */
  explanation: string
  /**
   * Ordered WGS84 points for the hand-drawn suggested route line (primary map source).
   * Typically a rough sketch — not a surveyed track.
   */
  suggestedPolyline?: LatLng[]
  /** Optional ordered waypoints JSON for copy / GPX builders */
  waypointFile?: string
}

export interface RouteJson {
  slug: string
  title: string
  area?: string
  country?: string
  summary: string
  /** Shown prominently under the title */
  disclaimer?: string
  parkingNote?: string
  routeType?: string
  distanceKm?: number
  ascentM?: number
  estimatedHours?: number
  orderedTops?: string[]
  startGridRef?: string
  finishGridRef?: string
  anchorRefs?: AnchorRef[]
  routeOptions?: RouteOption[]
  recommendation?: string[]
  goodStopSpots?: string[]
  terrainVibe?: string
  wildlifeTexture?: string
  notes?: string[]
  landmarks?: Landmark[]
  decisionPoints?: Landmark[]
  mapCenter: MapCenter
  mapZoom?: number
  bounds?: RouteBounds
  /**
   * Optional recorded GPX for comparison overlay / download only.
   * Omit, set to `null`, or `""` to disable — there is no implicit default filename.
   */
  gpxFile?: string | null
  waypointFile?: string
  photoFolder?: string
  photos?: string[]
  heroImage?: string
}

export type WaypointType =
  | 'parking'
  | 'summit'
  | 'junction'
  | 'landmark'
  | 'gate'
  | 'river-crossing'
  | 'anchor'
  | 'corridor'
  | 'other'
  | string

export interface WaypointJson {
  id: string
  name: string
  lat: number
  lng: number
  gridRef?: string
  elevationM?: number
  type: WaypointType
  description?: string
  order?: number
}

export interface RoutesIndex {
  routes: string[]
}
