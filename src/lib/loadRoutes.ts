import type { RouteJson, RoutesIndex, WaypointJson } from '../types/route'
import { publicUrl, routeFolderUrl, routeResourceFolder } from './publicUrl'

export async function loadRoutesIndex(): Promise<RoutesIndex> {
  const res = await fetch(publicUrl('routes/index.json'))
  if (!res.ok) throw new Error('Could not load routes index')
  return res.json() as Promise<RoutesIndex>
}

export async function loadRoute(slug: string): Promise<RouteJson | null> {
  const res = await fetch(`${routeFolderUrl(slug)}route.json`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Failed to load route: ${slug}`)
  return res.json() as Promise<RouteJson>
}

export async function loadAreaDayRoute(
  areaSlug: string,
  dayId: string,
): Promise<RouteJson | null> {
  const base = routeFolderUrl(`${areaSlug}/days/${dayId}`)
  const res = await fetch(`${base}route.json`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Failed to load day: ${areaSlug}/${dayId}`)
  return res.json() as Promise<RouteJson>
}

export async function loadWaypoints(
  slug: string,
  waypointFile = 'waypoints.json',
): Promise<WaypointJson[]> {
  const res = await fetch(`${routeFolderUrl(slug)}${waypointFile}`)
  if (!res.ok) return []
  try {
    const data = (await res.json()) as WaypointJson[] | { waypoints: WaypointJson[] }
    if (Array.isArray(data)) return data
    if (data?.waypoints && Array.isArray(data.waypoints)) return data.waypoints
    return []
  } catch {
    return []
  }
}

export async function loadAreaDayWaypoints(
  areaSlug: string,
  dayId: string,
  waypointFile = 'waypoints.json',
): Promise<WaypointJson[]> {
  const base = routeFolderUrl(`${areaSlug}/days/${dayId}`)
  const res = await fetch(`${base}${waypointFile}`)
  if (!res.ok) return []
  try {
    const data = (await res.json()) as WaypointJson[] | { waypoints: WaypointJson[] }
    if (Array.isArray(data)) return data
    if (data?.waypoints && Array.isArray(data.waypoints)) return data.waypoints
    return []
  } catch {
    return []
  }
}

export function routePhotoUrl(route: RouteJson, filename: string): string {
  const root = routeResourceFolder(route)
  const folder = route.photoFolder?.replace(/\/$/, '') ?? ''
  const prefix = folder ? `${folder}/` : ''
  return `${root}${prefix}${filename}`
}

/** Only when `gpxFile` is a non-empty string — no default `route.gpx`. */
export function routeGpxUrl(route: RouteJson): string | null {
  const file = route.gpxFile
  if (file == null || file === '') return null
  return `${routeResourceFolder(route)}${file}`
}
