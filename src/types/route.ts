export interface MapCenter {
  lat: number
  lng: number
}

export interface LatLng {
  lat: number
  lng: number
}

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

export interface AnchorRef {
  label: string
  gridRef: string
  lat?: number
  lng?: number
}

/** Open-licensed or local image with full attribution (Geograph, Wikimedia, etc.). */
export interface AttributedImage {
  id: string
  title: string
  /** Relative to route folder, absolute URL, or omit for placeholder */
  imageUrl?: string
  caption: string
  sourceName: string
  sourceUrl?: string
  attributionText: string
  licenseName: string
  licenseUrl?: string
}

export interface WeatherNote {
  title?: string
  body: string
  supporting?: string
  disclaimerLabel?: string
}

export interface StopSpotDetail {
  title: string
  description: string
}

export interface WildlifeCard {
  title: string
  body: string
  whyItMatters: string
}

export interface TextBlock {
  title?: string
  body: string
  supporting?: string
}

export interface WhyThisRouteContent {
  title?: string
  body: string
  callouts?: string[]
  supporting?: string
}

export interface RecommendationBlock {
  title: string
  lines: string[]
  supporting?: string
}

export interface DayFeelsLikeContent {
  title?: string
  body: string
  supporting?: string
  summaryLines?: string[]
}

export interface GoodStopsDetail {
  intro?: string
  spots: StopSpotDetail[]
}

export type QualityFactorImpact = 'positive' | 'negative' | 'neutral'

export interface QualityMeterFactor {
  label: string
  impact: QualityFactorImpact
  note: string
}

export interface QualityMeterSubscore {
  label: string
  score: number
  note: string
}

/** Informal “how’s the day looking” gauge for a route (optional per route). */
export interface QualityMeter {
  score: number
  headline: string
  verdict: string
  lowLabel: string
  highLabel: string
  factors: QualityMeterFactor[]
  subscores?: QualityMeterSubscore[]
}

export interface RouteOption {
  id: string
  name: string
  /** Short “why this exists” / legacy */
  reason?: string
  /** Optional bullet-style steps */
  suggestedLine?: string[]
  /** Narrative suggested line (preferred for rich pages) */
  lineDescription?: string
  /** e.g. “Better route shape” */
  tag?: string
  /** Extra colour / legacy */
  explanation?: string
  whyPick?: string
  tradeoff?: string
  suggestedPolyline?: LatLng[]
  waypointFile?: string
}

export interface RouteJson {
  slug: string
  title: string
  area?: string
  country?: string
  /** Main story / hero text */
  summary: string
  /** Short line for homepage cards if `summary` is long */
  listingBlurb?: string
  /** Badge next to title, e.g. “Suggested route only” */
  suggestedRouteBadge?: string
  disclaimer?: string
  /** Titled disclaimer block (rich planning pages) */
  disclaimerSection?: TextBlock
  parkingNote?: string
  routeType?: string
  distanceKm?: number
  ascentM?: number
  estimatedHours?: number
  orderedTops?: string[]
  startGridRef?: string
  finishGridRef?: string
  anchorRefs?: AnchorRef[]
  anchorRefsTitle?: string
  anchorRefsIntro?: string
  routeOptions?: RouteOption[]
  /** Legacy simple lines */
  recommendation?: string[]
  recommendationBlock?: RecommendationBlock
  whyThisRoute?: WhyThisRouteContent
  /** Tongue-in-cheek day-quality summary (optional) */
  qualityMeter?: QualityMeter
  weatherNote?: WeatherNote
  whatDayFeelsLike?: DayFeelsLikeContent
  goodStopSpots?: string[]
  goodStopsDetail?: GoodStopsDetail
  terrainVibe?: string
  terrainDetail?: TextBlock
  wildlifeTexture?: string
  /** Intro paragraph above wildlife cards */
  wildlifeIntro?: string
  wildlifeCards?: WildlifeCard[]
  lookoutGallery?: AttributedImage[]
  lookoutGalleryIntro?: string
  planningFooterNote?: string
  notes?: string[]
  landmarks?: Landmark[]
  decisionPoints?: Landmark[]
  mapCenter: MapCenter
  mapZoom?: number
  bounds?: RouteBounds
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
