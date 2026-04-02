import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PrintRouteCard } from '../components/PrintRouteCard'
import { useRouteBundle, type RouteBundleKey } from '../hooks/useRouteBundle'

export function PrintPage() {
  const { slug, areaSlug, dayId } = useParams<{
    slug?: string
    areaSlug?: string
    dayId?: string
  }>()
  const bundleKey = useMemo((): RouteBundleKey | null => {
    if (areaSlug && dayId) return { kind: 'areaDay', areaSlug, dayId }
    if (slug) return { kind: 'route', slug }
    return null
  }, [areaSlug, dayId, slug])

  const { route, waypoints, optionWaypoints, error } = useRouteBundle(bundleKey)

  if (!bundleKey) {
    return <p className="status status-error">Missing route.</p>
  }

  if (error) {
    return <p className="status status-error">{error}</p>
  }

  if (route === undefined) {
    return <p className="status">Loading…</p>
  }

  if (route === null) {
    return (
      <div className="print-shell not-found">
        <h1 className="page-title">Route not found</h1>
        <Link to="/" className="btn btn-secondary">
          Back home
        </Link>
      </div>
    )
  }

  return (
    <div className="print-shell">
      <div className="print-toolbar no-print">
        <Link
          to={
            route.parentAreaSlug
              ? `/routes/${route.parentAreaSlug}/${route.slug}`
              : `/routes/${slug ?? route.slug}`
          }
          className="btn btn-secondary"
        >
          ← Route page
        </Link>
        <button type="button" className="btn btn-primary" onClick={() => window.print()}>
          Print / Save as PDF
        </button>
      </div>
      <PrintRouteCard
        route={route}
        waypoints={waypoints}
        optionWaypoints={optionWaypoints}
      />
    </div>
  )
}
