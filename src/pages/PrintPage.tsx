import { Link, useParams } from 'react-router-dom'
import { PrintRouteCard } from '../components/PrintRouteCard'
import { useRouteBundle } from '../hooks/useRouteBundle'

export function PrintPage() {
  const { slug } = useParams<{ slug: string }>()
  const { route, waypoints, optionWaypoints, error } = useRouteBundle(slug)

  if (!slug) {
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
        <Link to={`/routes/${slug}`} className="btn btn-secondary">
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
