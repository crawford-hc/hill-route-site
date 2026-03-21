/** Vite base URL, always ends with `/` when non-root. */
export function publicUrl(path: string): string {
  const base = import.meta.env.BASE_URL
  const p = path.startsWith('/') ? path.slice(1) : path
  return `${base}${p}`
}

export function routeFolderUrl(slug: string): string {
  return publicUrl(`routes/${slug}/`)
}

/** Local file under the route folder or absolute http(s) URL. */
export function routeMediaUrl(slug: string, path: string): string {
  const p = path.trim()
  if (p.startsWith('http://') || p.startsWith('https://')) return p
  return `${routeFolderUrl(slug)}${p.replace(/^\//, '')}`
}
