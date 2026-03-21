import type { RouteJson } from '../types/route'
import { routeFolderUrl } from '../lib/publicUrl'

interface Props {
  route: RouteJson
}

export function RouteHero({ route }: Props) {
  const hero =
    route.heroImage != null && route.heroImage !== ''
      ? route.heroImage.startsWith('http')
        ? route.heroImage
        : `${routeFolderUrl(route.slug)}${route.heroImage.replace(/^\//, '')}`
      : null

  return (
    <section className="route-hero" aria-labelledby="route-title">
      {hero ? (
        <div className="route-hero-image">
          <img src={hero} alt="" />
        </div>
      ) : null}
      <div className="route-hero-text">
        {(route.area || route.country) && (
          <p className="route-hero-kicker">
            {[route.area, route.country].filter(Boolean).join(' · ')}
          </p>
        )}
        <h1 id="route-title" className="route-hero-title">
          {route.title}
        </h1>
        {route.routeType ? (
          <p className="route-hero-type">{route.routeType}</p>
        ) : null}
      </div>
    </section>
  )
}
