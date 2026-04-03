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
import type { AttributedImage, RouteJson, WaypointJson } from '../types/route'

interface SimpleCard {
  title: string
  description: string
  whyToday?: string
  imageSrc?: string
  imageAlt?: string
  source?: string
  link?: string
}

function SimpleCardSection({ id, title, cards }: { id: string; title: string; cards: SimpleCard[] }) {
  return (
    <section className="planning-section" aria-labelledby={id}>
      <h2 id={id} className="planning-section-title">
        {title}
      </h2>
      <ul className="planning-wildlife-grid">
        {cards.map((card, i) => (
          <li key={i} className="planning-wildlife-card">
            {card.imageSrc ? (
              <div className="planning-figure-frame">
                <img
                  src={card.imageSrc}
                  alt={card.imageAlt ?? card.title}
                  className="planning-figure-img"
                  loading="lazy"
                />
              </div>
            ) : null}
            <h3 className="planning-wildlife-title">{card.title}</h3>
            <p className="planning-wildlife-body">{card.description}</p>
            {card.whyToday ? <p className="planning-wildlife-why">Why today: {card.whyToday}</p> : null}
            {card.source || card.link ? (
              <p className="planning-wildlife-why">
                Source: {card.source ?? 'External reference'}{' '}
                {card.link ? (
                  <>
                    (
                    <a href={card.link} target="_blank" rel="noopener noreferrer">
                      read more
                    </a>
                    )
                  </>
                ) : null}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}

const MAYAR_DRIESH_TERRAIN_CONDITION_CARDS: SimpleCard[] = [
  { title: 'Wind exposure', description: "Big open ridge - if it's blowing, you're in it all day." },
  { title: 'Mixed ground', description: 'Dry start, then peat and soft sections higher up.' },
  {
    title: 'Clag flattening the plateau',
    description: 'Simple in clear weather, vague bearings in whiteout.',
  },
  {
    title: 'Snow carryover',
    description: 'Hollows and north-facing bits hold onto it longer than expected.',
  },
  {
    title: 'Bog indicators',
    description: 'Cottongrass usually means soft ground - pick your line.',
  },
]

const MAYAR_DRIESH_WHATS_AROUND_YOU_GALLERY: AttributedImage[] = [
  {
    id: 'md-cottongrass',
    title: 'Cottongrass',
    imageUrl: 'photos/cottongrass-hermaness.jpg',
    caption:
      'White tufts in peat usually means soft ground. Why today: wet conditions and early growth mean the bog is still holding water.',
    sourceName: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Common_Cotton-grass_(Eriophorum_angustifolium),_Hermaness_-_geograph.org.uk_-_6548063.jpg',
    attributionText:
      '© Mike Pennington. Geograph Britain and Ireland, image ID 6548063; mirrored on Wikimedia Commons with photographer credit.',
    licenseName: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
  },
  {
    id: 'md-red-grouse',
    title: 'Red grouse',
    imageUrl: 'photos/red-grouse-heather.jpg',
    caption:
      'Loud, territorial moorland bird. Why today: breeding season means they are usually more visible and vocal.',
    sourceName: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Red_Grouse_(2954268645).jpg',
    attributionText:
      '© Alastair Rae (London, UK). Uploaded from Flickr; reviewed on Wikimedia Commons.',
    licenseName: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
  },
  {
    id: 'md-red-deer',
    title: 'Deer',
    imageUrl: 'photos/red-deer-stag.jpg',
    caption:
      'Red deer moving across open slopes. Why today: low disturbance and broad ground keep sightings realistic.',
    sourceName: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Red_deer_stag.jpg',
    attributionText: '© Mehmet Karatay. Own work; uploaded to Wikimedia Commons.',
    licenseName: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
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

      {route.whyThisRoute ? <WhyThisRouteSection content={route.whyThisRoute} /> : null}

      {isMayarDriesh ? (
        <SimpleCardSection
          id="terrain-conditions-heading"
          title="Terrain & conditions"
          cards={MAYAR_DRIESH_TERRAIN_CONDITION_CARDS}
        />
      ) : route.whatToLookOutFor?.length ? (
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

      {route.disclaimerSection ? (
        <TitledProseSection
          id="disclaimer-section-heading"
          title={route.disclaimerSection.title ?? 'Suggested line only'}
          body={route.disclaimerSection.body}
          supporting={route.disclaimerSection.supporting}
          className="planning-section--disclaimer"
        />
      ) : null}

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

      <div className="planning-map-wrap">
        <RouteMap route={route} waypoints={waypoints} selectedOptionId={mapLineId} />
      </div>

      <WaypointTable waypoints={waypoints} />

      <GridRefsBlock
        route={route}
        waypoints={waypoints}
        title="All grid refs (full list)"
        hint="Start, finish, anchors, waypoints — paste into your app or scribble on the map."
      />

      {route.goodStopsDetail ? <GoodStopsPlanning detail={route.goodStopsDetail} /> : null}

      {isMayarDriesh ? (
        <LookoutGallery
          route={route}
          title="What's around you"
          items={MAYAR_DRIESH_WHATS_AROUND_YOU_GALLERY}
          intro="Quick visual reads for this ridge day: what you might spot, and what the ground is telling you."
        />
      ) : route.whatYouMightSee?.length ? (
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
          'Stuff you might actually see or step in — nothing curated for Instagram.'
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
