import type { RouteJson, RouteOption, WeatherNote } from '../../types/route'
import { routeMediaUrl } from '../../lib/publicUrl'

interface Props {
  route: RouteJson
  weather?: WeatherNote
  routeOptions: RouteOption[]
  activeOptionId: string | null
  onPickOption: (id: string) => void
}

export function RoutePlanningHero({
  route,
  weather,
  routeOptions,
  activeOptionId,
  onPickOption,
}: Props) {
  const badge = (route.suggestedRouteBadge ?? 'Suggested route only').trim()
  const heroImg =
    route.heroImage != null && route.heroImage !== ''
      ? routeMediaUrl(route, route.heroImage)
      : null

  return (
    <header className="planning-hero">
      {heroImg ? (
        <div className="planning-hero-visual">
          <img src={heroImg} alt="" className="planning-hero-img" />
          <div className="planning-hero-scrim" aria-hidden />
        </div>
      ) : (
        <div className="planning-hero-visual planning-hero-visual--pattern" aria-hidden />
      )}

      <div className="planning-hero-inner">
        <div className="planning-hero-top">
          {(route.area || route.country) && (
            <p className="planning-hero-kicker">
              {[route.area, route.country].filter(Boolean).join(' · ')}
            </p>
          )}
          {badge ? <span className="planning-badge">{badge}</span> : null}
          <h1 className="planning-hero-title">{route.title}</h1>
          <p className="planning-hero-summary">{route.summary}</p>
        </div>

        {weather ? (
          <div className="planning-weather" aria-labelledby="weather-glance-title">
            <h2 id="weather-glance-title" className="planning-weather-title">
              {weather.title ?? 'Weather at a glance'}
            </h2>
            <p className="planning-weather-body">{weather.body}</p>
            {weather.supporting ? (
              <p className="planning-weather-support">{weather.supporting}</p>
            ) : null}
            {weather.disclaimerLabel ? (
              <p className="planning-weather-label">{weather.disclaimerLabel}</p>
            ) : null}
          </div>
        ) : null}

        {routeOptions.length > 0 ? (
          <div className="planning-hero-options" aria-label="Quick route options">
            <p className="planning-hero-options-label">Pick a line</p>
            <div className="planning-hero-option-cards">
              {routeOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`planning-hero-opt-card ${activeOptionId === opt.id ? 'is-on' : ''}`}
                  onClick={() => onPickOption(opt.id)}
                >
                  {opt.tag ? <span className="planning-hero-opt-tag">{opt.tag}</span> : null}
                  <span className="planning-hero-opt-name">{opt.name}</span>
                  {opt.reason ? (
                    <span className="planning-hero-opt-reason">{opt.reason}</span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}
