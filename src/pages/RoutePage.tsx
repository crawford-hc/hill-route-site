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

const MAYAR_DRIESH_TERRAIN_CONDITIONS = [
  {
    label: 'Wind exposure',
    body: "Big open ridge. If it’s blowing, you’re in it.",
  },
  {
    label: 'Mixed ground',
    body: 'Tracky start, then open hill, peatier bits, and whatever snow is still hanging on.',
  },
  {
    label: 'Clag flattening the tops',
    body: 'Simple enough in clear weather. Much less charming when everything turns white-grey and featureless.',
  },
  {
    label: 'Snow carryover',
    body: 'North-facing and hollowed ground can still hold old snow longer than you’d think.',
  },
  {
    label: 'Bog factor',
    body: 'Usually not a total bog-fest, but soft patches still exist and will catch the lazy foot placement.',
  },
]

const MAYAR_DRIESH_GOOD_FOR = [
  'Rough-but-readable weather',
  'Late-ish start without making the whole day stupid',
  'Two-Munro payoff with straightforward ridge logic',
  'Winter kit days where you want broad ground, not circus tricks',
]

const MAYAR_DRIESH_NOT_IDEAL_FOR = [
  'Anyone wanting a short easy local blast',
  'Full whiteout if nobody fancies doing proper nav',
  'Days where severe wind makes exposed ridge walking a pain in the arse',
  'Folk wanting a quieter, weirder, more exploratory day',
]

const MAYAR_DRIESH_LOOKOUT_FOR = [
  {
    label: 'Ridge wind and cross-gusts',
    body: 'this was picked because the line is obvious, but if it’s blowing hard it still batters your pace.',
  },
  {
    label: 'Spring shoulder-season mix',
    body: 'dry-ish lower path can turn to old snow and icy patches higher up, so don’t assume one setup works all day.',
  },
  {
    label: 'Clag on the broad tops',
    body: 'even on this readable day, visibility can flatten fast and make easy bearings feel vague.',
  },
  {
    label: 'Cornice leftovers and loaded edges in colder spells',
    body: 'give crest lines a wider berth if the snowpack looks uncertain.',
  },
  {
    label: 'Busy Glen Doll parking on decent forecasts',
    body: 'early start helps, and not blocking access keeps everyone happy.',
  },
]

const MOUNT_KEEN_TERRAIN_CONDITIONS = [
  {
    label: 'Long estate-track start',
    body: 'You cover a lot of ground before the hill really starts to bite.',
  },
  {
    label: 'Broad upper hill',
    body: 'Open summit ground with a bigger weather feel once you’re up there.',
  },
  {
    label: 'Mixed underfoot',
    body: 'Easy going lower down, rougher and more open higher up.',
  },
  {
    label: 'Wind exposure',
    body: 'The upper ground is where the day gets properly honest.',
  },
  {
    label: 'Winter carryover',
    body: 'Snow and old frozen patches can linger higher up longer than the glen suggests.',
  },
]

const MOUNT_KEEN_GOOD_FOR = [
  'Big steady day without fiddly route choices',
  'Headspace walks where you’re happy just grinding it out',
  'Decent weather windows with enough visibility to enjoy the big upper ground',
  'Winter days where you want broad terrain, not awkward scrambling nonsense',
]

const MOUNT_KEEN_NOT_IDEAL_FOR = [
  'Anyone wanting quick payoff',
  'Days where the wind is brutal on exposed upper ground',
  'People already tired before they’ve started',
  'Anyone pretending a long out-and-back feels the same as a playful multi-top ridge day',
]

const MOUNT_KEEN_LOOKOUT_FOR = [
  {
    label: 'Long approach complacency',
    body: 'it starts tame enough, which is exactly how folk end up underestimating the upper hill.',
  },
  {
    label: 'Wind on the broad summit ground',
    body: 'once you’re properly up there, there’s not much shielding and the hill can feel a lot bigger.',
  },
  {
    label: 'Cloud flattening the top',
    body: 'the shape is straightforward overall, but murk still strips the atmosphere and the views that make this one worth it.',
  },
  {
    label: 'Energy management',
    body: 'this is more of a diesel day than a sprint, so don’t burn the legs early because the summit takes its sweet time arriving.',
  },
  {
    label: 'Changeable underfoot mix',
    body: 'estate track and easier glen travel below, then rougher open hill higher up where it stops feeling like a warm-up.',
  },
]

const LOCH_LEE_GOOD_FOR = [
  'Big mileage days without technical terrain',
  'Mixed conditions where you want flexibility',
  'Steady graft rather than short sharp hits',
  'Testing legs without testing luck',
]

const LOCH_LEE_NOT_IDEAL_FOR = [
  'Anyone wanting a quick win',
  'Proper whiteout conditions with no nav confidence',
  'People who hate bog / soft ground',
  'Days where high wind makes open ground miserable',
]

const LOCH_LEE_LOOKOUT_FOR = [
  { label: 'Wind on the high ground', body: '' },
  { label: 'Patchy snow / mixed ground', body: '' },
  { label: 'Clag drifting in and out', body: '' },
  { label: 'Energy management over the full loop', body: '' },
  { label: 'River / burn levels after recent weather', body: '' },
]

const LOCH_LEE_TERRAIN_CONDITIONS = [
  { label: 'Long approach track', body: '' },
  { label: 'Peat + moss ground', body: '' },
  { label: 'Rolling plateau feel', body: '' },
  { label: 'Gradual climbs', body: '' },
  { label: 'Exposure band around the higher section', body: '' },
]

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
  const isMayarDriesh = route.slug === 'mayar-driesh'
  const isMountKeen = route.slug === 'mount-keen'
  const isLochLeeLoop = route.slug === 'loch-lee-loop'
  const mkStyleDay = isMountKeen || isLochLeeLoop
  const goodForList = isMountKeen
    ? MOUNT_KEEN_GOOD_FOR
    : isLochLeeLoop
      ? LOCH_LEE_GOOD_FOR
      : null
  const notIdealList = isMountKeen
    ? MOUNT_KEEN_NOT_IDEAL_FOR
    : isLochLeeLoop
      ? LOCH_LEE_NOT_IDEAL_FOR
      : null
  const lookoutList = isMountKeen
    ? MOUNT_KEEN_LOOKOUT_FOR
    : isLochLeeLoop
      ? LOCH_LEE_LOOKOUT_FOR
      : null
  const terrainList = isMountKeen
    ? MOUNT_KEEN_TERRAIN_CONDITIONS
    : isLochLeeLoop
      ? LOCH_LEE_TERRAIN_CONDITIONS
      : null

  return (
    <article
      className={`page-route page-route--planning${isMayarDriesh ? ' page-route--mayar-driesh' : ''}${isLochLeeLoop ? ' page-route--loch-lee-loop' : ''}${isMayarDriesh || isLochLeeLoop ? ' page-route--disclosure-tools' : ''}`}
    >
      <RoutePlanningHero
        route={route}
        weather={route.weatherNote}
        routeOptions={routeOpts}
        activeOptionId={mapLineId}
        onPickOption={setPickedLineId}
      />

      <DownloadButtons route={route} />

      {route.qualityMeter ? <QualityHillDayMeter meter={route.qualityMeter} /> : null}

      {isLochLeeLoop ? (
        <>
          {routeOpts.length > 0 ? (
            <div className="planning-map-toolbar">
              <div className="map-line-picker" role="group" aria-label="Which line on the map">
                <span id="map-line-label-loch" className="map-line-picker-label">
                  Map line
                </span>
                <div className="map-line-picker-buttons" aria-labelledby="map-line-label-loch">
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
            <RouteMap
              route={route}
              waypoints={waypoints}
              selectedOptionId={mapLineId}
              gpxLineOnly
              waypointMarkers="terminals"
            />
          </div>
          <ParkerSection route={route} waypoints={waypoints} />
        </>
      ) : null}

      {isMayarDriesh && route.whyThisRoute ? (
        <section className="planning-section planning-section--why" aria-labelledby="why-this-route-heading">
          <h2 id="why-this-route-heading" className="planning-section-title">
            {route.whyThisRoute.title}
          </h2>
          <p className="planning-prose">{route.whyThisRoute.body}</p>
          {route.whyThisRoute.supporting
            ?.split('\n\n')
            .map((paragraph, i) => <p key={i} className="planning-prose-support">{paragraph}</p>)}
        </section>
      ) : route.whyThisRoute ? (
        <WhyThisRouteSection content={route.whyThisRoute} />
      ) : null}

      {mkStyleDay && route.whatDayFeelsLike ? (
        <DayFeelsLikeSection content={route.whatDayFeelsLike} />
      ) : null}

      {mkStyleDay && goodForList ? (
        <section className="planning-section planning-section--tight" aria-labelledby="good-for-heading">
          <h2 id="good-for-heading" className="planning-section-title">
            Good for
          </h2>
          <ul className="planning-summary-chips planning-summary-chips--dense">
            {goodForList.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {mkStyleDay && notIdealList ? (
        <section className="planning-section planning-section--tight" aria-labelledby="not-ideal-heading">
          <h2 id="not-ideal-heading" className="planning-section-title">
            Not ideal for
          </h2>
          <ul className="planning-summary-chips planning-summary-chips--dense">
            {notIdealList.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {mkStyleDay && lookoutList ? (
        <section className="planning-section planning-section--tight" aria-labelledby="look-out-day-heading">
          <h2 id="look-out-day-heading" className="planning-section-title">
            What to look out for on the day
          </h2>
          <ul
            className={`planning-callouts planning-callouts--compact-grid${isLochLeeLoop ? ' planning-callouts--lookout-intel' : ''}`}
          >
            {lookoutList.map((item, i) => (
              <li
                key={i}
                className={isLochLeeLoop ? 'planning-lookout-intel-item' : 'planning-callout-card'}
              >
                <strong
                  className={
                    isLochLeeLoop ? 'planning-lookout-intel-label' : 'planning-callout-card-label'
                  }
                >
                  {item.label}
                </strong>
                {item.body ? (
                  <span
                    className={
                      isLochLeeLoop ? 'planning-lookout-intel-body' : 'planning-callout-card-body'
                    }
                  >
                    {item.body}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {mkStyleDay && terrainList ? (
        <section className="planning-section planning-section--tight" aria-labelledby="terrain-conditions-heading">
          <h2 id="terrain-conditions-heading" className="planning-section-title">
            Terrain &amp; conditions
          </h2>
          <ul className="planning-callouts planning-callouts--compact-grid">
            {terrainList.map((item, i) => (
              <li key={i} className="planning-callout-card">
                <strong className="planning-callout-card-label">{item.label}</strong>
                {item.body ? (
                  <span className="planning-callout-card-body">{item.body}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {isMayarDriesh ? (
        <>
          <section className="planning-section planning-section--tight" aria-labelledby="terrain-conditions-heading">
            <h2 id="terrain-conditions-heading" className="planning-section-title">
              Terrain &amp; conditions
            </h2>
            <ul className="planning-callouts planning-callouts--compact-grid">
              {MAYAR_DRIESH_TERRAIN_CONDITIONS.map((item, i) => (
                <li key={i} className="planning-callout-card">
                  <strong className="planning-callout-card-label">{item.label}</strong>
                  <span className="planning-callout-card-body">{item.body}</span>
                </li>
              ))}
            </ul>
          </section>

          {route.whatDayFeelsLike ? <DayFeelsLikeSection content={route.whatDayFeelsLike} /> : null}

          <section className="planning-section planning-section--tight" aria-labelledby="good-for-heading">
            <h2 id="good-for-heading" className="planning-section-title">
              Good for
            </h2>
            <ul className="planning-summary-chips planning-summary-chips--dense">
              {MAYAR_DRIESH_GOOD_FOR.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="planning-section planning-section--tight" aria-labelledby="not-ideal-heading">
            <h2 id="not-ideal-heading" className="planning-section-title">
              Not ideal for
            </h2>
            <ul className="planning-summary-chips planning-summary-chips--dense">
              {MAYAR_DRIESH_NOT_IDEAL_FOR.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="planning-section planning-section--tight" aria-labelledby="look-out-day-heading">
            <h2 id="look-out-day-heading" className="planning-section-title">
              What to look out for on the day
            </h2>
            <ul className="planning-callouts planning-callouts--compact-grid">
              {MAYAR_DRIESH_LOOKOUT_FOR.map((item, i) => (
                <li key={i} className="planning-callout-card">
                  <strong className="planning-callout-card-label">{item.label}</strong>
                  <span className="planning-callout-card-body">{item.body}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : !isMountKeen && !isLochLeeLoop && route.whatToLookOutFor?.length ? (
        <section className="planning-section" aria-labelledby="look-out-day-heading">
          <h2 id="look-out-day-heading" className="planning-section-title">
            What to look out for on the day
          </h2>
          <ul className="planning-callouts">
            {route.whatToLookOutFor.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {!isMayarDriesh && !isMountKeen && !isLochLeeLoop && route.disclaimerSection ? (
        <TitledProseSection
          id="disclaimer-section-heading"
          title={route.disclaimerSection.title ?? 'Suggested line only'}
          body={route.disclaimerSection.body}
          supporting={route.disclaimerSection.supporting}
          className="planning-section--disclaimer"
        />
      ) : null}

      {!isMayarDriesh && !isMountKeen && !isLochLeeLoop && rec ? (
        <HonestTakeBlock block={rec} />
      ) : null}

      <RouteOptionsPlanning options={routeOpts} optionWaypoints={optionWaypoints} />

      {!isLochLeeLoop ? <ParkerSection route={route} waypoints={waypoints} /> : null}

      {(isMountKeen || isLochLeeLoop) && rec ? <HonestTakeBlock block={rec} /> : null}

      {(isMountKeen || isLochLeeLoop) && route.goodStopsDetail ? (
        <GoodStopsPlanning detail={route.goodStopsDetail} />
      ) : null}

      {isMountKeen || isLochLeeLoop ? (
        <LookoutGallery
          route={route}
          title="What's around you"
          items={route.lookoutGallery ?? []}
          intro={route.lookoutGalleryIntro}
        />
      ) : null}

      {isMayarDriesh && rec ? <HonestTakeBlock block={rec} /> : null}

      <RouteStats route={route} />

      {!isMayarDriesh ? (
        <AnchorRefsPanel
          title={route.anchorRefsTitle}
          intro={route.anchorRefsIntro}
          anchors={route.anchorRefs ?? []}
        />
      ) : null}

      {routeOpts.length > 0 && !isLochLeeLoop ? (
        <div className="planning-map-toolbar">
          <div className="map-line-picker" role="group" aria-label="Which line on the map">
            <span id="map-line-label" className="map-line-picker-label">
              Map line
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

      {!isLochLeeLoop ? (
        <div className="planning-map-wrap">
          <RouteMap route={route} waypoints={waypoints} selectedOptionId={mapLineId} />
        </div>
      ) : null}

      {isMayarDriesh || isLochLeeLoop ? (
        <div className="planning-tools-split">
          <details className="planning-disclosure planning-disclosure--tool">
            <summary>Waypoints (full)</summary>
            <WaypointTable waypoints={waypoints} />
          </details>
          <details className="planning-disclosure planning-disclosure--tool">
            <summary>
              {isMayarDriesh ? 'Navigation data' : 'All grid refs (full list)'}
            </summary>
            <GridRefsBlock
              route={route}
              waypoints={waypoints}
              title="All grid refs (full list)"
              hint="Start, finish, anchors, waypoints — paste into your app or scribble on the map."
            />
          </details>
        </div>
      ) : (
        <WaypointTable waypoints={waypoints} />
      )}

      {!isMayarDriesh && !isLochLeeLoop ? (
        <GridRefsBlock
          route={route}
          waypoints={waypoints}
          title="All grid refs (full list)"
          hint="Start, finish, anchors, waypoints — paste into your app or scribble on the map."
        />
      ) : null}

      {isMayarDriesh ? (
        <LookoutGallery
          route={route}
          title="What's around you"
          items={route.lookoutGallery ?? []}
          intro={route.lookoutGalleryIntro}
        />
      ) : null}

      {!isMountKeen && !isLochLeeLoop && route.goodStopsDetail ? (
        <GoodStopsPlanning detail={route.goodStopsDetail} />
      ) : null}

      {!isMayarDriesh && route.whatYouMightSee?.length ? (
        <section className="planning-section" aria-labelledby="flora-fauna-heading">
          <h2 id="flora-fauna-heading" className="planning-section-title">
            What you might see (flora &amp; fauna)
          </h2>
          <ul className="planning-callouts">
            {route.whatYouMightSee.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {isMayarDriesh && route.disclaimerSection ? (
        <TitledProseSection
          id="disclaimer-section-heading"
          title={route.disclaimerSection.title ?? 'Suggested line only'}
          body={route.disclaimerSection.body}
          supporting={route.disclaimerSection.supporting}
          className="planning-section--disclaimer"
        />
      ) : null}

      {route.whatDayFeelsLike && !isMayarDriesh && !isMountKeen && !isLochLeeLoop ? (
        <DayFeelsLikeSection content={route.whatDayFeelsLike} />
      ) : null}

      {!isMountKeen && !isLochLeeLoop ? (
        <TerrainWildlifePlanning
          terrain={route.terrainDetail}
          wildlifeIntro={route.wildlifeIntro}
          wildlifeCards={route.wildlifeCards}
        />
      ) : null}

      {!isMayarDriesh && !isMountKeen && !isLochLeeLoop ? (
        <LookoutGallery
          route={route}
          items={route.lookoutGallery ?? []}
          intro={
            route.lookoutGalleryIntro ??
            'Stuff you might actually see or step in — nothing curated for Instagram.'
          }
        />
      ) : null}

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
        title="Nav calls"
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
