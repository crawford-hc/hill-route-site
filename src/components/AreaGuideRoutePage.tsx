import { useState } from 'react'
import { DownloadButtons } from './DownloadButtons'
import { RoutePlanningHero } from './planning/RoutePlanningHero'
import type { RouteJson } from '../types/route'

/** Glen Esk quick picks — IDs match `public/routes/glen-esk/route.json` dayCards. */
const GLEN_ESK_DAY_PICKS = [
  { label: 'Weather a bit rough?', cardId: 'mayar-driesh' },
  { label: 'Want a proper full day?', cardId: 'mount-keen' },
  { label: 'Happy to figure it out on the hill?', cardId: 'explorer' },
] as const

interface Props {
  route: RouteJson
}

export function AreaGuideRoutePage({ route }: Props) {
  const cards = route.dayCards ?? []
  const [selectedId, setSelectedId] = useState<string | null>(
    cards[0]?.id ?? null,
  )

  return (
    <article className="page-route page-route--planning page-route--area-guide">
      <RoutePlanningHero
        route={route}
        weather={route.weatherNote}
        routeOptions={[]}
        activeOptionId={null}
        onPickOption={() => {}}
      />

      <p className="area-guide-label" role="note">
        This is an area guide, not a fixed route
      </p>

      <DownloadButtons route={route} />

      <section className="area-guide-section" aria-labelledby="area-guide-days-heading">
        <h2 id="area-guide-days-heading" className="section-title">
          Hill day options
        </h2>
        <p className="area-guide-section-lead">
          Tap a card to highlight it — compare parkers, vibe, and when each day
          tends to make sense.
        </p>
        {route.slug === 'glen-esk' ? (
          <div
            className="area-guide-pick"
            aria-labelledby="area-guide-pick-heading"
          >
            <h3 id="area-guide-pick-heading" className="area-guide-pick-title">
              Pick your day
            </h3>
            <div
              className="area-guide-pick-buttons"
              role="group"
              aria-label="Quick day suggestions"
            >
              {GLEN_ESK_DAY_PICKS.map(({ label, cardId }) => {
                const exists = cards.some((c) => c.id === cardId)
                if (!exists) return null
                const isOn = selectedId === cardId
                return (
                  <button
                    key={cardId}
                    type="button"
                    className={`area-guide-pick-btn ${isOn ? 'is-selected' : ''}`}
                    onClick={() => setSelectedId(cardId)}
                    aria-pressed={isOn}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}
        <div className="area-guide-cards">
          {cards.map((card) => {
            const isOn = selectedId === card.id
            return (
              <button
                key={card.id}
                type="button"
                className={`area-guide-card ${isOn ? 'is-selected' : ''}`}
                onClick={() => setSelectedId(card.id)}
                aria-pressed={isOn}
              >
                <span className="area-guide-card-name">{card.name}</span>
                <span className="area-guide-card-subtitle">{card.subtitle}</span>
                <dl className="area-guide-card-dl">
                  <div>
                    <dt>Parker</dt>
                    <dd>{card.parker}</dd>
                  </div>
                  <div>
                    <dt>Description</dt>
                    <dd>{card.description}</dd>
                  </div>
                  <div>
                    <dt>Vibe</dt>
                    <dd>{card.vibe}</dd>
                  </div>
                </dl>
                {card.goodFor?.length ? (
                  <ul className="area-guide-card-tags" aria-label="Good for">
                    {card.goodFor.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                ) : null}
              </button>
            )
          })}
        </div>
      </section>
    </article>
  )
}
