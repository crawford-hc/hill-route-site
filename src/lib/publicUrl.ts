import type { RouteJson } from '../types/route'

/** Vite base URL, always ends with `/` when non-root. */
export function publicUrl(path: string): string {
  const base = import.meta.env.BASE_URL
  const p = path.startsWith('/') ? path.slice(1) : path
  return `${base}${p}`
}

export function routeFolderUrl(slug: string): string {
  return publicUrl(`routes/${slug}/`)
}

export function areaDayRouteFolderUrl(areaSlug: string, dayId: string): string {
  return publicUrl(`routes/${areaSlug}/days/${dayId}/`)
}

/** Folder URL for static assets and JSON for this route (top-level or area day). */
export function routeResourceFolder(route: RouteJson): string {
  const parent = route.parentAreaSlug?.trim()
  if (parent) return areaDayRouteFolderUrl(parent, route.slug)
  return routeFolderUrl(route.slug)
}

/** Local file under the route folder or absolute http(s) URL. */
export function routeMediaUrl(route: RouteJson, path: string): string {
  const p = path.trim()
  if (p.startsWith('http://') || p.startsWith('https://')) return p
  return `${routeResourceFolder(route)}${p.replace(/^\//, '')}`
}
