import type { ReactNode } from 'react'
import type { RouteJson } from '../types/route'

interface Props {
  route: RouteJson
}

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="stat">
      <dt className="stat-label">{label}</dt>
      <dd className="stat-value">{value}</dd>
    </div>
  )
}

export function RouteStats({ route }: Props) {
  const hasAny =
    route.distanceKm != null ||
    route.ascentM != null ||
    route.estimatedHours != null ||
    route.startGridRef ||
    route.finishGridRef

  if (!hasAny) return null

  return (
    <section className="route-stats" aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="section-title">
        At a glance
      </h2>
      <dl className="stats-grid">
        {route.distanceKm != null ? (
          <Stat label="Distance" value={`${route.distanceKm} km`} />
        ) : null}
        {route.ascentM != null ? (
          <Stat label="Ascent" value={`${route.ascentM} m`} />
        ) : null}
        {route.estimatedHours != null ? (
          <Stat
            label="Time (estimate)"
            value={`~${route.estimatedHours} h`}
          />
        ) : null}
        {route.startGridRef ? (
          <Stat label="Start" value={route.startGridRef} />
        ) : null}
        {route.finishGridRef ? (
          <Stat label="Finish" value={route.finishGridRef} />
        ) : null}
      </dl>
    </section>
  )
}
