import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DownloadButtons } from '../components/DownloadButtons'
import { GridRefsBlock } from '../components/GridRefsBlock'
import { LandmarkList } from '../components/LandmarkList'
import { OrderedTops } from '../components/OrderedTops'
import { PhotoGallery } from '../components/PhotoGallery'
import { RouteMap } from '../components/RouteMap'
import { RouteNotes } from '../components/RouteNotes'
import { RouteStats } from '../components/RouteStats'
import { WaypointTable } from '../components/WaypointTable'
import { AnchorRefsPanel } from '../components/planning/AnchorRefsPanel'
import { DayFeelsLikeSection } from '../components/planning/DayFeelsLikeSection'
import { GoodStopsPlanning } from '../components/planning/GoodStopsPlanning'
import { HonestTakeBlock } from '../components/planning/HonestTakeBlock'
import { LookoutGallery } from '../components/planning/LookoutGallery'
import { ParkerSection } from '../components/planning/ParkerSection'
import { QualityHillDayMeter } from '../components/planning/QualityHillDayMeter'
import { RouteOptionsPlanning } from '../components/planning/RouteOptionsPlanning'
import { RoutePlanningHero } from '../components/planning/RoutePlanningHero'
import { TerrainWildlifePlanning } from '../components/planning/TerrainWildlifePlanning'
import { TitledProseSection } from '../components/planning/TitledProseSection'
import { WhyThisRouteSection } from '../components/planning/WhyThisRouteSection'
import { AreaGuideRoutePage } from '../components/AreaGuideRoutePage'
import { useRouteBundle, type RouteBundleKey } from '../hooks/useRouteBundle'
import { routePhotoUrl } from '../lib/loadRoutes'
import { recommendationFromRoute } from '../lib/recommendationFromRoute'
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
      src: routePhotoUrl(route, f),
      alt: f.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
    })) ?? []

  const showLegacyTops =
    (route.orderedTops?.length ?? 0) > 0 && !(route.routeOptions?.length ?? 0)

  const routeOpts = route.routeOptions ?? []
  const rec = recommendationFromRoute(route)

  return (
    <article className="page-route page-route--planning">
      <RoutePlanningHero
        route={route}
        weather={route.weatherNote}
        routeOptions={routeOpts}
        activeOptionId={mapLineId}
        onPickOption={setPickedLineId}
      />

      <DownloadButtons route={route} />

      {route.qualityMeter ? <QualityHillDayMeter meter={route.qualityMeter} /> : null}

      {route.disclaimerSection ? (
        <TitledProseSection
          id="disclaimer-section-heading"
          title={route.disclaimerSection.title ?? 'Suggested route only'}
          body={route.disclaimerSection.body}
          supporting={route.disclaimerSection.supporting}
          className="planning-section--disclaimer"
        />
      ) : null}

      {route.whyThisRoute ? <WhyThisRouteSection content={route.whyThisRoute} /> : null}

      {rec ? <HonestTakeBlock block={rec} /> : null}

      <RouteOptionsPlanning options={routeOpts} optionWaypoints={optionWaypoints} />

      <ParkerSection route={route} waypoints={waypoints} />

      <RouteStats route={route} />

      <AnchorRefsPanel
        title={route.anchorRefsTitle}
        intro={route.anchorRefsIntro}
        anchors={route.anchorRefs ?? []}
      />

      {routeOpts.length > 0 ? (
        <div className="planning-map-toolbar">
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
        </div>
      ) : null}

      <div className="planning-map-wrap">
        <RouteMap route={route} waypoints={waypoints} selectedOptionId={mapLineId} />
      </div>

      <WaypointTable waypoints={waypoints} />

      <GridRefsBlock
        route={route}
        waypoints={waypoints}
        title="All grid refs (full list)"
        hint="Start, finish, anchors, and waypoint grids — copy into a mapping app or notes."
      />

      {route.goodStopsDetail ? <GoodStopsPlanning detail={route.goodStopsDetail} /> : null}

      {route.whatDayFeelsLike ? (
        <DayFeelsLikeSection content={route.whatDayFeelsLike} />
      ) : null}

      <TerrainWildlifePlanning
        terrain={route.terrainDetail}
        wildlifeIntro={route.wildlifeIntro}
        wildlifeCards={route.wildlifeCards}
      />

      <LookoutGallery
        route={route}
        items={route.lookoutGallery ?? []}
        intro={
          route.lookoutGalleryIntro ??
          'Not rare magic, just the sort of stuff that makes this hill feel like itself.'
        }
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

      {route.planningFooterNote ? (
        <p className="route-planning-page-footer">{route.planningFooterNote}</p>
      ) : null}
    </article>
  )
}

export function RoutePage() {
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
    const dataPath =
      bundleKey.kind === 'areaDay'
        ? `routes/${bundleKey.areaSlug}/days/${bundleKey.dayId}/route.json`
        : `routes/${bundleKey.slug}/route.json`
    return (
      <div className="not-found">
        <h1 className="page-title">Route not found</h1>
        <p>
          No data at <code className="inline-code">{dataPath}</code>.
        </p>
        <Link to="/" className="btn btn-secondary">
          Back home
        </Link>
      </div>
    )
  }

  const isAreaGuide = (route.dayCards?.length ?? 0) > 0
  const pageKey =
    bundleKey.kind === 'areaDay'
      ? `${bundleKey.areaSlug}/${bundleKey.dayId}`
      : bundleKey.slug

  return isAreaGuide ? (
    <AreaGuideRoutePage key={pageKey} route={route} />
  ) : (
    <RoutePageLoaded
      key={pageKey}
      route={route}
      waypoints={waypoints}
      optionWaypoints={optionWaypoints}
    />
  )
}
