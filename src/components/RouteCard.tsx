import { Link } from 'react-router-dom'
import type { RouteJson } from '../types/route'
import { routeFolderUrl } from '../lib/publicUrl'

interface Props {
  route: RouteJson
}

export function RouteCard({ route }: Props) {
  const hero =
    route.heroImage != null && route.heroImage !== ''
      ? route.heroImage.startsWith('http')
        ? route.heroImage
        : `${routeFolderUrl(route.slug)}${route.heroImage.replace(/^\//, '')}`
      : null

  return (
    <article className="route-card">
      <Link to={`/routes/${route.slug}`} className="route-card-link">
        {hero ? (
          <div className="route-card-image-wrap">
            <img src={hero} alt="" className="route-card-image" loading="lazy" />
          </div>
        ) : (
          <div className="route-card-image-wrap route-card-placeholder" aria-hidden />
        )}
        <div className="route-card-body">
          <h2 className="route-card-title">{route.title}</h2>
          {(route.area || route.country) && (
            <p className="route-card-meta">
              {[route.area, route.country].filter(Boolean).join(' · ')}
            </p>
          )}
          <p className="route-card-summary">
            {route.listingBlurb ?? route.summary}
          </p>
          <span className="route-card-cta">Open route</span>
        </div>
      </Link>
    </article>
  )
}
