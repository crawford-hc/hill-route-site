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
  /** Legacy single body under the title; optional when using structured fields. */
  caption?: string
  /** Short scene text (structured “What’s around you” cards). */
  description?: string
  whyToday?: string
  interestingBit?: string
  /** `<img>` alt text; defaults to `title`. */
  imageAlt?: string
  sourceName?: string
  sourceUrl?: string
  attributionText?: string
  licenseName?: string
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

export type ContextualCardCategory =
  | 'terrain'
  | 'ground'
  | 'wildlife'
  | 'seasonal'

export interface ContextualCard {
  id: string
  title: string
  description: string
  whyToday?: string
  category: ContextualCardCategory
  tags: string[]
  image: string
  alt: string
  credit: string
  link?: string
}

export interface RouteContext {
  terrain: string[]
  ground: string[]
  season: string[]
  conditions: string[]
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

/** One selectable hill-day option on an area-style page (no map line). */
export interface DayCard {
  id: string
  name: string
  subtitle: string
  parker: string
  description: string
  vibe: string
  goodFor: string[]
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
  /** When this file lives under `routes/{area}/days/{slug}/`, set for correct links and asset URLs. */
  parentAreaSlug?: string
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
  /** Main waypoint file must contain this id with type "parking"; overrides other parker resolution. */
  parkerWaypointId?: string
  /** If false, skip polyline[0] and mapCenter. Omitted keeps legacy fallbacks. */
  allowInferredParkerFromPolylineOrMapCenter?: boolean
  routeType?: string
  distanceKm?: number
  ascentM?: number
  estimatedHours?: number
  orderedTops?: string[]
  /** Display label for the parker line (e.g. access name); optional when grid ref is enough. */
  startName?: string
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
  whatToLookOutFor?: string[]
  goodStopSpots?: string[]
  goodStopsDetail?: GoodStopsDetail
  whatYouMightSee?: string[]
  terrainVibe?: string
  terrainDetail?: TextBlock
  wildlifeTexture?: string
  /** Intro paragraph above wildlife cards */
  wildlifeIntro?: string
  wildlifeCards?: WildlifeCard[]
  routeContext?: RouteContext
  contextualCards?: ContextualCard[]
  lookoutGallery?: AttributedImage[]
  lookoutGalleryIntro?: string
  planningFooterNote?: string
  notes?: string[]
  landmarks?: Landmark[]
  decisionPoints?: Landmark[]
  mapZoom?: number
  bounds?: RouteBounds
  gpxFile?: string | null
  waypointFile?: string
  photoFolder?: string
  photos?: string[]
  heroImage?: string
  /** Area-style pages: selectable day cards, no suggested polylines. */
  dayCards?: DayCard[]
  /** Required for map routes; omit on area-only pages. */
  mapCenter?: MapCenter
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
