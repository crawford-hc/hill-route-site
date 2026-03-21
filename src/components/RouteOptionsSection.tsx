import type { RouteOption, WaypointJson } from '../types/route'
import { OptionWaypointBlock } from './OptionWaypointBlock'

interface Props {
  options: RouteOption[]
  optionWaypoints: Record<string, WaypointJson[]>
}

export function RouteOptionsSection({ options, optionWaypoints }: Props) {
  if (!options.length) return null

  return (
    <section className="route-options-section" aria-labelledby="options-heading">
      <h2 id="options-heading" className="section-title">
        Route options
      </h2>
      <p className="route-options-lead">
        Two suggested shapes for the same patch of ground. Neither is the One True Line — pick
        what fits the group and the weather.
      </p>
      <div className="route-options-grid">
        {options.map((opt) => (
          <article key={opt.id} className="route-option-card">
            <h3 className="route-option-name">{opt.name}</h3>
            <p className="route-option-why">
              <span className="route-option-label">Why bother</span> {opt.reason}
            </p>
            <h4 className="route-option-sub">Suggested line</h4>
            <ol className="route-option-line">
              {opt.suggestedLine.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
            <p className="route-option-explain">{opt.explanation}</p>
            <OptionWaypointBlock
              waypoints={optionWaypoints[opt.id] ?? []}
              waypointFile={opt.waypointFile}
            />
          </article>
        ))}
      </div>
    </section>
  )
}
