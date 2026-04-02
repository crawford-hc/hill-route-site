import { Link } from 'react-router-dom'
import { routeGpxUrl } from '../lib/loadRoutes'
import type { RouteJson } from '../types/route'

interface Props {
  route: RouteJson
}

export function DownloadButtons({ route }: Props) {
  const gpx = routeGpxUrl(route)

  return (
    <div className="action-bar">
      {gpx ? (
        <a className="btn btn-primary" href={gpx} download>
          Download GPX
        </a>
      ) : (
        <span className="btn btn-muted" aria-disabled>
          GPX not available
        </span>
      )}
      <Link
        className="btn btn-secondary"
        to={
          route.parentAreaSlug
            ? `/print/${route.parentAreaSlug}/${route.slug}`
            : `/print/${route.slug}`
        }
      >
        Printable card
      </Link>
    </div>
  )
}
