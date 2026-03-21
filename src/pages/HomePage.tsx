import { useEffect, useState } from 'react'
import { RouteCard } from '../components/RouteCard'
import { loadRoute, loadRoutesIndex } from '../lib/loadRoutes'
import type { RouteJson } from '../types/route'

export function HomePage() {
  const [routes, setRoutes] = useState<RouteJson[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const idx = await loadRoutesIndex()
        const loaded = await Promise.all(
          idx.routes.map((slug) => loadRoute(slug)),
        )
        const ok = loaded.filter((r): r is RouteJson => r != null)
        if (!cancelled) {
          setRoutes(ok)
          setError(ok.length === 0 ? 'No routes found. Add slugs to routes/index.json.' : null)
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load routes')
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

      <div className="route-card-grid">
        {routes.map((r) => (
          <RouteCard key={r.slug} route={r} />
        ))}
      </div>
    </div>
  )
}
