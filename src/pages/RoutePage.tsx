import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnchorRefsSection } from '../components/AnchorRefsSection'
import { DownloadButtons } from '../components/DownloadButtons'
import { GoodStopSpots } from '../components/GoodStopSpots'
import { GridRefsBlock } from '../components/GridRefsBlock'
import { LandmarkList } from '../components/LandmarkList'
import { OrderedTops } from '../components/OrderedTops'
import { PhotoGallery } from '../components/PhotoGallery'
import { RouteDisclaimer } from '../components/RouteDisclaimer'
import { RouteHero } from '../components/RouteHero'
import { RouteMap } from '../components/RouteMap'
import { RouteNotes } from '../components/RouteNotes'
import { RouteOptionsSection } from '../components/RouteOptionsSection'
import { RouteRecommendation } from '../components/RouteRecommendation'
import { RouteStats } from '../components/RouteStats'
import { TerrainAndWildlife } from '../components/TerrainAndWildlife'
import { WaypointTable } from '../components/WaypointTable'
import { useRouteBundle } from '../hooks/useRouteBundle'
import { routePhotoUrl } from '../lib/loadRoutes'
import type { RouteJson, WaypointJson } from '../types/route'

function RoutePageLoaded({
  route,
  waypoints,
  optionWaypoints,
}: {
  route: RouteJson
  waypoints: WaypointJson[]
  optionWaypoints: Record<string, WaypointJson[]>
}) {
  const defaultLineId = route.routeOptions?.[0]?.id ?? null
  const [pickedLineId, setPickedLineId] = useState<string | null>(null)
  const mapLineId = pickedLineId ?? defaultLineId

  const photos =
    route.photos?.map((f) => ({
      src: routePhotoUrl(route.slug, route, f),
      alt: f.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
    })) ?? []

  const showLegacyTops =
    (route.orderedTops?.length ?? 0) > 0 && !(route.routeOptions?.length ?? 0)

  const routeOpts = route.routeOptions ?? []

  return (
    <article className="page-route">
      <RouteHero route={route} />
      {route.disclaimer ? <RouteDisclaimer text={route.disclaimer} /> : null}
      <DownloadButtons route={route} />

      <section className="prose-block" aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="section-title">
          Summary
        </h2>
        <p className="prose">{route.summary}</p>
      </section>

      {route.parkingNote ? (
        <section className="parking-block" aria-labelledby="parking-heading">
          <h2 id="parking-heading" className="section-title">
            Parking &amp; start
          </h2>
          <p className="prose">{route.parkingNote}</p>
        </section>
      ) : null}

      <RouteStats route={route} />

      <RouteOptionsSection options={routeOpts} optionWaypoints={optionWaypoints} />
      <RouteRecommendation lines={route.recommendation ?? []} />

      <AnchorRefsSection anchors={route.anchorRefs ?? []} />

      {routeOpts.length > 0 ? (
        <div className="map-line-picker" role="group" aria-label="Suggested line on map">
          <span id="map-line-label" className="map-line-picker-label">
            Line on map
          </span>
          <div className="map-line-picker-buttons" aria-labelledby="map-line-label">
            {routeOpts.map((o) => (
              <button
                key={o.id}
                type="button"
                className={`map-line-btn ${mapLineId === o.id ? 'is-active' : ''}`}
                onClick={() => setPickedLineId(o.id)}
              >
                {o.name}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <RouteMap route={route} waypoints={waypoints} selectedOptionId={mapLineId} />
      <WaypointTable waypoints={waypoints} />

      <GridRefsBlock route={route} waypoints={waypoints} />

      <GoodStopSpots spots={route.goodStopSpots ?? []} />
      <TerrainAndWildlife
        terrainVibe={route.terrainVibe}
        wildlifeTexture={route.wildlifeTexture}
      />

      {showLegacyTops ? <OrderedTops tops={route.orderedTops ?? []} /> : null}

      <PhotoGallery images={photos} />
      <RouteNotes notes={route.notes ?? []} />
      <LandmarkList
        id="landmarks-heading"
        title="Landmarks"
        items={route.landmarks ?? []}
      />
      <LandmarkList
        id="decisions-heading"
        title="Navigation & decisions"
        items={route.decisionPoints ?? []}
      />
    </article>
  )
}

export function RoutePage() {
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
      <div className="not-found">
        <h1 className="page-title">Route not found</h1>
        <p>
          No data at <code className="inline-code">routes/{slug}/route.json</code>.
        </p>
        <Link to="/" className="btn btn-secondary">
          Back home
        </Link>
      </div>
    )
  }

  return (
    <RoutePageLoaded
      key={slug}
      route={route}
      waypoints={waypoints}
      optionWaypoints={optionWaypoints}
    />
  )
}
