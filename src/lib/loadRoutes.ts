import type { RouteJson, RoutesIndex, WaypointJson } from '../types/route'
import { routeFolderUrl, publicUrl } from './publicUrl'

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

export function routePhotoUrl(
  slug: string,
  route: RouteJson,
  filename: string,
): string {
  const folder = route.photoFolder?.replace(/\/$/, '') ?? ''
  const prefix = folder ? `${folder}/` : ''
  return `${routeFolderUrl(slug)}${prefix}${filename}`
}

/** Only when `gpxFile` is a non-empty string — no default `route.gpx`. */
export function routeGpxUrl(slug: string, route: RouteJson): string | null {
  const file = route.gpxFile
  if (file == null || file === '') return null
  return `${routeFolderUrl(slug)}${file}`
}
