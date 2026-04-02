import { useEffect, useState } from 'react'
import { RouteCard } from '../components/RouteCard'
import { loadRoute, loadRoutesIndex } from '../lib/loadRoutes'
import type { RouteJson } from '../types/route'

export function HomePage() {
  const [routes, setRoutes] = useState<RouteJson[]>([])
  const [error, setError] = useState<string | null>(null)
  const [failedSlugs, setFailedSlugs] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const idx = await loadRoutesIndex()
        const loaded = await Promise.all(
          idx.routes.map(async (slug) => {
            try {
              const r = await loadRoute(slug)
              if (r == null) {
                console.warn(
                  `[HomePage] route.json failed to load for slug "${slug}" (missing or not found)`,
                )
                return { slug, route: null as null }
              }
              return { slug, route: r }
            } catch (e) {
              console.warn(
                `[HomePage] route.json failed to load for slug "${slug}"`,
                e,
              )
              return { slug, route: null as null }
            }
          }),
        )
        const ok = loaded
          .filter((x): x is { slug: string; route: RouteJson } => x.route != null)
          .map((x) => x.route)
        const failed = loaded.filter((x) => x.route == null).map((x) => x.slug)
        if (!cancelled) {
          setRoutes(ok)
          setFailedSlugs(failed)
          setError(ok.length === 0 ? 'No routes found. Add slugs to routes/index.json.' : null)
        }
      } catch (e) {
        if (!cancelled) {
          setFailedSlugs([])
          setError(e instanceof Error ? e.message : 'Failed to load routes')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="page-home">
      <header className="page-header">
        <h1 className="page-title">Shared hill routes</h1>
        <p className="page-lead">
          Walking and hill days with friends — route cards, maps, GPX, and print-friendly
          summaries. Add new routes by dropping JSON and files under{' '}
          <code className="inline-code">public/routes/</code>.
        </p>
      </header>

      {loading ? <p className="status">Loading routes…</p> : null}
      {error ? <p className="status status-error">{error}</p> : null}
      {!loading && failedSlugs.length > 0 ? (
        <div className="status status-error" role="status">
          <p className="status" style={{ marginBottom: '0.5rem' }}>
            Some routes failed to load:
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            {failedSlugs.map((slug) => (
              <li key={slug}>
                <code className="inline-code">{slug}</code>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="route-card-grid">
        {routes.map((r) => (
          <RouteCard key={r.slug} route={r} />
        ))}
      </div>
    </div>
  )
}
